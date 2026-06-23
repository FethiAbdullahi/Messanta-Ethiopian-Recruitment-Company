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

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'This form is not configured yet. Please try again later.' },
      { status: 503 }
    );
  }

  const ip = clientIpFromRequest(request);
  if (rateLimitExceeded(`shortlist-request:${ip}`, RATE_MAX, RATE_WINDOW_MS)) {
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

  const candidate_id = clampField(String(o.candidateId ?? o.candidate_id ?? ''), 120);
  const candidate_name = clampField(String(o.candidateName ?? o.candidate_name ?? ''), 200);
  const company_name = clampField(String(o.companyName ?? o.company_name ?? ''), 300);
  const contact_person = clampField(String(o.contactPerson ?? o.contact_person ?? ''), 200);
  const email = clampField(String(o.email ?? ''), 254).toLowerCase();
  const phone = clampField(String(o.phone ?? ''), 80);
  const country = clampField(String(o.country ?? ''), 120);
  const notesRaw = clampField(String(o.notes ?? ''), 8000);

  if (candidate_id.length < 1 || candidate_name.length < 1) {
    return NextResponse.json({ error: 'Candidate information is missing.' }, { status: 400 });
  }
  if (company_name.length < 2) {
    return NextResponse.json({ error: 'Company name is required.' }, { status: 400 });
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
  if (country.length < 2) {
    return NextResponse.json({ error: 'Country is required.' }, { status: 400 });
  }

  const notes = notesRaw.length > 0 ? notesRaw : null;

  const admin = createAdminClient();
  const { error } = await admin.from('shortlist_requests').insert({
    candidate_id,
    candidate_name,
    company_name,
    contact_person,
    email,
    phone,
    country,
    notes,
  });

  if (error) {
    console.error('[shortlist-request POST]', error);
    return NextResponse.json({ error: 'Could not save your request.' }, { status: 500 });
  }

  void notifyAdminLead(
    `Shortlist: ${candidate_name}`,
    `<p>Candidate: <strong>${escapeHtml(candidate_name)}</strong> (${escapeHtml(candidate_id)})</p>
<p>Company: ${escapeHtml(company_name)} · ${escapeHtml(country)}</p>
<p>Contact: ${escapeHtml(contact_person)} &lt;${escapeHtml(email)}&gt; · ${escapeHtml(phone)}</p>${
      notes ? `<p>Notes: ${escapeHtml(notes).replace(/\n/g, '<br/>')}</p>` : ''
    }`
  );

  return NextResponse.json({ ok: true });
}
