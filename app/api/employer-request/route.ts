import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { clientIpFromRequest, rateLimitExceeded } from '@/lib/security/rateLimit';
import { isValidEnrollmentEmail, clampField } from '@/lib/security/enrollValidation';
import { notifyAdminLead } from '@/lib/notify';
import { escapeHtml } from '@/lib/htmlEscape';

export const runtime = 'nodejs';

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 10;

function numWorkers(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.floor(raw);
  const s = String(raw ?? '').trim();
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : 0;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'This form is not configured yet. Please try again later.' },
      { status: 503 }
    );
  }

  const ip = clientIpFromRequest(request);
  if (rateLimitExceeded(`employer-request:${ip}`, RATE_MAX, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: 'Too many submissions from this network. Please wait and try again later.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const o = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};

  const company_name = clampField(String(o.companyName ?? o.company_name ?? ''), 300);
  const country = clampField(String(o.country ?? ''), 120);
  const contact_person = clampField(String(o.contactPerson ?? o.contact_person ?? ''), 200);
  const email = clampField(String(o.email ?? ''), 254).toLowerCase();
  const phone = clampField(String(o.phone ?? ''), 80);
  const roles_requested = clampField(String(o.rolesRequested ?? o.roles_requested ?? ''), 500);
  const number_of_workers = numWorkers(o.numberOfWorkers ?? o.number_of_workers);
  const start_date = clampField(String(o.startDate ?? o.start_date ?? ''), 64);
  const job_description = clampField(String(o.jobDescription ?? o.job_description ?? ''), 12000);
  const notesRaw = clampField(String(o.notes ?? ''), 8000);

  if (company_name.length < 2) {
    return NextResponse.json({ error: 'Company name is required.' }, { status: 400 });
  }
  if (country.length < 2) {
    return NextResponse.json({ error: 'Country is required.' }, { status: 400 });
  }
  if (contact_person.length < 2) {
    return NextResponse.json({ error: 'Contact person is required.' }, { status: 400 });
  }
  if (!email || !isValidEnrollmentEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }
  if (phone.length < 5) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  }
  if (roles_requested.length < 2) {
    return NextResponse.json({ error: 'Roles requested is required.' }, { status: 400 });
  }
  if (number_of_workers < 1 || number_of_workers > 50_000) {
    return NextResponse.json({ error: 'Number of workers must be between 1 and 50000.' }, { status: 400 });
  }
  if (start_date.length < 4) {
    return NextResponse.json({ error: 'Start date is required.' }, { status: 400 });
  }
  if (job_description.length < 5) {
    return NextResponse.json(
      {
        error:
          'Please add a short job description in the “Job description” box (below roles and start date). A sentence or two is enough.',
      },
      { status: 400 }
    );
  }

  const notes = notesRaw.length > 0 ? notesRaw : null;

  const admin = createAdminClient();
  const { error } = await admin.from('employer_requests').insert({
    company_name,
    country,
    contact_person,
    email,
    phone,
    roles_requested,
    number_of_workers,
    start_date,
    job_description,
    notes,
  });

  if (error) {
    console.error('[employer-request POST]', error);
    return NextResponse.json({ error: 'Could not save your request.' }, { status: 500 });
  }

  void notifyAdminLead(
    `Employer request: ${company_name}`,
    `<p><strong>${escapeHtml(company_name)}</strong> (${escapeHtml(country)})</p>
<p>Contact: ${escapeHtml(contact_person)} &lt;${escapeHtml(email)}&gt; · ${escapeHtml(phone)}</p>
<p>Workers: ${number_of_workers} · Start: ${escapeHtml(start_date)}</p>
<p>Roles: ${escapeHtml(roles_requested)}</p>
<p>${escapeHtml(job_description).replace(/\n/g, '<br/>')}</p>${notes ? `<p>Notes: ${escapeHtml(notes).replace(/\n/g, '<br/>')}</p>` : ''}`
  );

  return NextResponse.json({ ok: true });
}
