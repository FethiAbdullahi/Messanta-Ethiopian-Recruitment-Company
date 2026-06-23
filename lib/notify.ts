import { escapeHtml } from '@/lib/htmlEscape';

const DEFAULT_ADMIN_EMAIL = 'skillsforlifeethio@gmail.com';

type EnrollmentTraineePayload = {
  toEmail: string;
  toPhone: string;
  fullName: string;
  programTitle: string;
};

export type EnrollmentAdminPayload = {
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  nationalId: string;
  passport: string;
  programId: string;
  programTitle: string;
  experience: string;
  cvLink: string;
  cvStoragePath: string | null;
};

function adminEmail(): string {
  return (process.env.ADMIN_NOTIFICATION_EMAIL ?? DEFAULT_ADMIN_EMAIL).trim();
}

function publicSiteUrl(): string {
  const u = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? '').trim();
  if (!u) return '';
  if (u.startsWith('http')) return u.replace(/\/$/, '');
  return `https://${u}`.replace(/\/$/, '');
}

async function sendResendEmail(params: {
  to: string[];
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resendKey || !from) {
    return { ok: false, error: 'Resend not configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `${res.status} ${text}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'unknown error' };
  }
}

export async function sendEnrollmentNotifications(
  trainee: EnrollmentTraineePayload,
  adminDetail: EnrollmentAdminPayload
): Promise<{
  traineeEmailSent: boolean;
  adminEmailSent: boolean;
  smsSent: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  let traineeEmailSent = false;
  let adminEmailSent = false;
  let smsSent = false;

  const traineeHtml = `<p>Hello ${escapeHtml(trainee.fullName)},</p>
<p>You have been successfully registered for <strong>${escapeHtml(trainee.programTitle)}</strong>.</p>
<p>We will contact you soon with next steps.</p>`;

  const traineeRes = await sendResendEmail({
    to: [trainee.toEmail],
    subject: 'Registration confirmed — Skills for Life',
    html: traineeHtml,
  });
  if (traineeRes.ok) {
    traineeEmailSent = true;
  } else if (traineeRes.error && traineeRes.error !== 'Resend not configured') {
    errors.push(`Trainee email: ${traineeRes.error}`);
  }

  const adminTo = adminEmail();
  const siteBase = publicSiteUrl();
  const enrollmentsCta = siteBase
    ? `<p style="margin-top:8px;font-size:13px"><a href="${escapeHtml(`${siteBase}/admin/enrollments`)}" style="color:#0d9488">Open enrollments dashboard</a></p>`
    : '';

  const adminHtml = `<h2>New program enrollment</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
<tr><td style="padding:6px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.fullName)}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.email)}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.phone)}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>Date of birth</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.dob)}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>National ID</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.nationalId)}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>Passport</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.passport || '—')}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>Program</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.programTitle)}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>Program ID</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.programId || '—')}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>Experience</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.experience || '—')}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>CV link</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.cvLink || '—')}</td></tr>
<tr><td style="padding:6px;border:1px solid #ddd"><strong>CV file (storage path)</strong></td><td style="padding:6px;border:1px solid #ddd">${escapeHtml(adminDetail.cvStoragePath || '—')}</td></tr>
</table>
<p style="margin-top:16px;font-size:13px;color:#444">Signed-in super admins can open <strong>Admin → Enrollments</strong> and download the CV securely (short-lived link).</p>
${enrollmentsCta}`;

  const adminRes = await sendResendEmail({
    to: [adminTo],
    subject: `New enrollment: ${adminDetail.fullName} — ${adminDetail.programTitle}`,
    html: adminHtml,
  });
  if (adminRes.ok) {
    adminEmailSent = true;
  } else if (adminRes.error && adminRes.error !== 'Resend not configured') {
    errors.push(`Admin email: ${adminRes.error}`);
  }

  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM_NUMBER;
  if (twilioSid && twilioToken && twilioFrom && trainee.toPhone) {
    const to = normalizePhone(trainee.toPhone);
    if (to) {
      try {
        const body = new URLSearchParams({
          To: to,
          From: twilioFrom,
          Body: `Hi ${trainee.fullName}, you're registered for ${trainee.programTitle}. We'll contact you soon. — Skills for Life`,
        });
        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization:
                'Basic ' +
                Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
          }
        );
        if (!res.ok) {
          const text = await res.text();
          errors.push(`SMS: ${res.status} ${text}`);
        } else {
          smsSent = true;
        }
      } catch (e) {
        errors.push(`SMS: ${e instanceof Error ? e.message : 'unknown error'}`);
      }
    }
  }

  return { traineeEmailSent, adminEmailSent, smsSent, errors };
}

/** Fire-and-forget admin alert for site leads (contact, employer, shortlist). */
export async function notifyAdminLead(subject: string, htmlBody: string): Promise<void> {
  const base = publicSiteUrl();
  const footer = base
    ? `<p style="margin-top:12px;font-size:13px"><a href="${escapeHtml(`${base}/admin/messages`)}">View in admin</a></p>`
    : '';
  const res = await sendResendEmail({
    to: [adminEmail()],
    subject,
    html: `${htmlBody}${footer}`,
  });
  if (!res.ok && res.error !== 'Resend not configured') {
    console.error('[notifyAdminLead]', res.error);
  }
}

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 9) return null;
  if (raw.trim().startsWith('+')) {
    return '+' + digits;
  }
  if (digits.startsWith('251')) {
    return '+' + digits;
  }
  return '+251' + digits.replace(/^0+/, '');
}
