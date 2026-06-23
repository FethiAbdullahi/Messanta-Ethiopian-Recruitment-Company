import { clampField, isValidEnrollmentEmail } from '@/lib/security/enrollValidation';
import type { ParsedTalentRow } from '@/lib/regionalTalentBulk';

function str(o: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  }
  return '';
}

/** Map JSON body (camelCase or snake_case) into a normalized talent row. */
export function parseTalentJsonBody(body: unknown, fallbackRegion: string): ParsedTalentRow | { error: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid JSON body' };
  }
  const o = body as Record<string, unknown>;

  const region = clampField(str(o, 'region', 'Region') || fallbackRegion, 200);
  const full_name = clampField(str(o, 'fullName', 'full_name'), 200);
  const phone = clampField(str(o, 'phone', 'Phone'), 40);
  const emailRaw = clampField(str(o, 'email', 'Email'), 254).toLowerCase();

  if (!full_name || full_name.length < 2) return { error: 'Full name is required.' };
  if (!phone || phone.length < 5) return { error: 'Phone is required.' };
  if (!region || region.length < 2) return { error: 'Region is required.' };
  if (emailRaw && !isValidEnrollmentEmail(emailRaw)) return { error: 'Invalid email.' };

  const dobRaw = str(o, 'dateOfBirth', 'date_of_birth', 'dob').slice(0, 32);
  let date_of_birth: string | null = null;
  if (dobRaw) {
    const d = new Date(dobRaw);
    if (!Number.isNaN(d.getTime())) date_of_birth = d.toISOString().slice(0, 10);
    else if (/^\d{4}-\d{2}-\d{2}$/.test(dobRaw)) date_of_birth = dobRaw;
  }

  const empty = (max: number, ...keys: string[]) => {
    const v = clampField(str(o, ...keys), max);
    return v.length ? v : null;
  };

  return {
    region,
    full_name,
    gender: empty(40, 'gender', 'Gender'),
    date_of_birth,
    phone,
    email: emailRaw.length ? emailRaw : null,
    national_id: empty(80, 'nationalId', 'national_id'),
    passport: empty(80, 'passport', 'Passport'),
    employment_id: empty(80, 'employmentId', 'employment_id'),
    current_address: empty(500, 'currentAddress', 'current_address'),
    city: empty(120, 'city', 'City'),
    woreda_subcity: empty(120, 'woredaSubcity', 'woreda_subcity'),
    emergency_contact_name: empty(200, 'emergencyContactName', 'emergency_contact_name'),
    emergency_contact_phone: empty(40, 'emergencyContactPhone', 'emergency_contact_phone'),
    highest_education: empty(120, 'highestEducation', 'highest_education'),
    field_of_study: empty(200, 'fieldOfStudy', 'field_of_study'),
    institution_name: empty(300, 'institutionName', 'institution_name'),
    graduation_year: empty(16, 'graduationYear', 'graduation_year'),
    languages: empty(500, 'languages', 'Languages'),
    skills_summary: empty(4000, 'skillsSummary', 'skills_summary'),
    notes: empty(8000, 'notes', 'Notes'),
  };
}

export function talentRowToDbInsert(
  row: ParsedTalentRow,
  createdBy: string,
  source: 'form' | 'bulk_csv' | 'bulk_xlsx'
): Record<string, unknown> {
  return {
    created_by: createdBy,
    region: row.region,
    source,
    full_name: row.full_name,
    gender: row.gender,
    date_of_birth: row.date_of_birth,
    phone: row.phone,
    email: row.email,
    national_id: row.national_id,
    passport: row.passport,
    employment_id: row.employment_id,
    current_address: row.current_address,
    city: row.city,
    woreda_subcity: row.woreda_subcity,
    emergency_contact_name: row.emergency_contact_name,
    emergency_contact_phone: row.emergency_contact_phone,
    highest_education: row.highest_education,
    field_of_study: row.field_of_study,
    institution_name: row.institution_name,
    graduation_year: row.graduation_year,
    languages: row.languages,
    skills_summary: row.skills_summary,
    notes: row.notes,
  };
}
