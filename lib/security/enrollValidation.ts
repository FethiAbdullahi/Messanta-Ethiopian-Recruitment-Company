const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEnrollmentEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

export function clampField(s: string, max: number): string {
  return s.trim().slice(0, max);
}

export type EnrollmentFields = {
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
};

const LIMITS = {
  fullName: 200,
  phone: 40,
  nationalId: 64,
  passport: 64,
  programId: 120,
  programTitle: 300,
  experience: 8000,
  cvLink: 2000,
} as const;

export function parseEnrollmentForm(form: FormData): { ok: true; fields: EnrollmentFields } | { ok: false; error: string } {
  const fullName = clampField(String(form.get('fullName') ?? ''), LIMITS.fullName);
  const dob = clampField(String(form.get('dob') ?? ''), 32);
  const phone = clampField(String(form.get('phone') ?? ''), LIMITS.phone);
  const email = clampField(String(form.get('email') ?? ''), 254).toLowerCase();
  const nationalId = clampField(String(form.get('nationalId') ?? ''), LIMITS.nationalId);
  const passport = clampField(String(form.get('passport') ?? ''), LIMITS.passport);
  const programId = clampField(String(form.get('programId') ?? ''), LIMITS.programId);
  const programTitle = clampField(String(form.get('programTitle') ?? ''), LIMITS.programTitle);
  const experience = clampField(String(form.get('experience') ?? ''), LIMITS.experience);
  const cvLink = clampField(String(form.get('cvLink') ?? ''), LIMITS.cvLink);

  if (!fullName || !dob || !phone || !email || !nationalId || !programTitle) {
    return { ok: false, error: 'Missing required fields' };
  }
  if (!isValidEnrollmentEmail(email)) {
    return { ok: false, error: 'Invalid email address' };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return { ok: false, error: 'Invalid date of birth format' };
  }

  return {
    ok: true,
    fields: {
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
    },
  };
}
