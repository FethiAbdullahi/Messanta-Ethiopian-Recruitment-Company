import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { sendEnrollmentNotifications } from '@/lib/notify';
import { clientIpFromRequest, rateLimitExceeded } from '@/lib/security/rateLimit';
import { parseEnrollmentForm } from '@/lib/security/enrollValidation';

export const runtime = 'nodejs';

/** Max submissions per IP per window (abuse protection for CV uploads). */
const ENROLL_RATE_MAX = 8;
const ENROLL_RATE_WINDOW_MS = 15 * 60 * 1000;

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function allowedUpload(file: File): boolean {
  if (file.size > MAX_FILE_BYTES) return false;
  if (ALLOWED_MIME.has(file.type)) return true;
  const n = file.name.toLowerCase();
  return n.endsWith('.pdf') || n.endsWith('.doc') || n.endsWith('.docx');
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180) || 'document.pdf';
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Registration is not configured. Set Supabase environment variables.' },
      { status: 503 }
    );
  }

  const ip = clientIpFromRequest(request);
  if (rateLimitExceeded(`enroll:${ip}`, ENROLL_RATE_MAX, ENROLL_RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: 'Too many submissions from this network. Please wait and try again later.' },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const parsed = parseEnrollmentForm(form);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const {
    fullName,
    dob,
    phone,
    email,
    nationalId,
    passport,
    programId,
    programTitle,
    experience,
    cvLink,
  } = parsed.fields;
  const cvFile = form.get('cvFile');

  const admin = createAdminClient();
  let cv_storage_path: string | null = null;

  if (cvFile instanceof File && cvFile.size > 0) {
    if (!allowedUpload(cvFile)) {
      return NextResponse.json(
        { error: 'CV must be a PDF or Word file under 5 MB.' },
        { status: 400 }
      );
    }
    const folder = randomUUID();
    const path = `${folder}/${sanitizeFilename(cvFile.name)}`;
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const { error: upErr } = await admin.storage.from('enrollment-files').upload(path, buffer, {
      contentType: cvFile.type || 'application/octet-stream',
      upsert: false,
    });
    if (upErr) {
      console.error(upErr);
      return NextResponse.json({ error: 'Could not upload file. Try again.' }, { status: 500 });
    }
    cv_storage_path = path;
  }

  const { error: insErr } = await admin.from('enrollments').insert({
    full_name: fullName,
    date_of_birth: dob,
    phone,
    email,
    national_id: nationalId,
    passport: passport || null,
    program_id: programId || null,
    program_title: programTitle,
    experience: experience || null,
    cv_storage_path,
    cv_link: cvLink || null,
  });

  if (insErr) {
    console.error(insErr);
    return NextResponse.json({ error: 'Could not save enrollment.' }, { status: 500 });
  }

  const notify = await sendEnrollmentNotifications(
    {
      toEmail: email,
      toPhone: phone,
      fullName,
      programTitle,
    },
    {
      fullName,
      dob,
      phone,
      email,
      nationalId,
      passport,
      programId,
      programTitle,
      experience,
      cvLink,
      cvStoragePath: cv_storage_path,
    }
  );

  return NextResponse.json({
    ok: true,
    confirmation: {
      traineeEmailSent: notify.traineeEmailSent,
      adminEmailSent: notify.adminEmailSent,
      smsSent: notify.smsSent,
      notifyErrors: notify.errors,
    },
  });
}
