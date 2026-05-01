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

function readBody(o: Record<string, unknown>) {
  return {
    name: clampField(String(o.name ?? ''), 200),
    email: clampField(String(o.email ?? ''), 254).toLowerCase(),
    phone: clampField(String(o.phone ?? ''), 80),
    subject: clampField(String(o.subject ?? ''), 300),
    message: clampField(String(o.message ?? ''), 10000),
  };
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'This form is not configured yet. Please try again later.' },
      { status: 503 }
    );
  }

  const ip = clientIpFromRequest(request);
  if (rateLimitExceeded(`contact:${ip}`, RATE_MAX, RATE_WINDOW_MS)) {
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
  const { name, email, phone, subject, message } = readBody(o);

  if (name.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!email || !isValidEnrollmentEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }
  if (subject.length < 1) {
    return NextResponse.json({ error: 'Please choose a subject.' }, { status: 400 });
  }
  if (message.length < 3) {
    return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from('contact_submissions').insert({
    name,
    email,
    phone: phone || null,
    subject,
    message,
  });

  if (error) {
    console.error('[contact POST]', error);
    return NextResponse.json({ error: 'Could not save your message.' }, { status: 500 });
  }

  void notifyAdminLead(
    `Contact: ${subject}`,
    `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>${
      phone ? `<p>Phone: ${escapeHtml(phone)}</p>` : ''
    }<p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`
  );

  return NextResponse.json({ ok: true });
}
