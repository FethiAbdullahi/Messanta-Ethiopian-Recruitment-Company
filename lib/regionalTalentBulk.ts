import * as XLSX from 'xlsx';
import { clampField } from '@/lib/security/enrollValidation';

/** Parse CSV (RFC-style quotes supported). */
export function parseCsvToMatrix(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQuote = false;
  const s = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuote) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuote = true;
    } else if (c === ',') {
      row.push(cur);
      cur = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(cur);
      cur = '';
      if (row.some((cell) => String(cell).trim().length > 0)) rows.push(row);
      row = [];
    } else {
      cur += c;
    }
  }
  row.push(cur);
  if (row.some((cell) => String(cell).trim().length > 0)) rows.push(row);
  return rows;
}

export function parseXlsxToMatrix(buffer: ArrayBuffer): string[][] {
  const wb = XLSX.read(buffer, { type: 'array' });
  const name = wb.SheetNames[0];
  if (!name) return [];
  const sheet = wb.Sheets[name];
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '', raw: false }) as string[][];
  return rows.map((r) => r.map((c) => (c == null ? '' : String(c))));
}

export function normalizeHeaderKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

const ALIASES: Record<string, string> = {
  name: 'full_name',
  fullname: 'full_name',
  student_name: 'full_name',
  talent_name: 'full_name',
  mobile: 'phone',
  telephone: 'phone',
  tel: 'phone',
  dob: 'date_of_birth',
  birth_date: 'date_of_birth',
  address: 'current_address',
  education: 'highest_education',
  school: 'institution_name',
  university: 'institution_name',
  program: 'field_of_study',
  skill: 'skills_summary',
};

export function mapHeaderToCanonical(h: string): string {
  const n = normalizeHeaderKey(h);
  return ALIASES[n] ?? n;
}

export type ParsedTalentRow = {
  region: string;
  full_name: string;
  gender: string | null;
  date_of_birth: string | null;
  phone: string;
  email: string | null;
  national_id: string | null;
  passport: string | null;
  current_address: string | null;
  city: string | null;
  woreda_subcity: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  highest_education: string | null;
  field_of_study: string | null;
  institution_name: string | null;
  graduation_year: string | null;
  languages: string | null;
  skills_summary: string | null;
  notes: string | null;
};

const LIMITS: Record<keyof Omit<ParsedTalentRow, 'date_of_birth'>, number> = {
  region: 200,
  full_name: 200,
  gender: 40,
  phone: 40,
  email: 254,
  national_id: 80,
  passport: 80,
  current_address: 500,
  city: 120,
  woreda_subcity: 120,
  emergency_contact_name: 200,
  emergency_contact_phone: 40,
  highest_education: 120,
  field_of_study: 200,
  institution_name: 300,
  graduation_year: 16,
  languages: 500,
  skills_summary: 4000,
  notes: 8000,
};

function emptyToNull(s: string): string | null {
  const t = s.trim();
  return t.length ? t : null;
}

export function rowRecordToTalent(
  rec: Record<string, string>,
  fallbackRegion: string
): { ok: true; row: ParsedTalentRow } | { ok: false; error: string } {
  const get = (k: string) => {
    const v = rec[k];
    return typeof v === 'string' ? v : '';
  };

  const region = clampField(get('region') || fallbackRegion, LIMITS.region);
  const full_name = clampField(get('full_name'), LIMITS.full_name);
  const phone = clampField(get('phone'), LIMITS.phone);

  if (!full_name || full_name.length < 2) {
    return { ok: false, error: 'full_name is required' };
  }
  if (!phone || phone.length < 5) {
    return { ok: false, error: 'phone is required' };
  }
  if (!region || region.length < 2) {
    return { ok: false, error: 'region is required (column or default)' };
  }

  const dobRaw = get('date_of_birth').trim();
  let date_of_birth: string | null = null;
  if (dobRaw) {
    const d = new Date(dobRaw);
    if (!Number.isNaN(d.getTime())) {
      date_of_birth = d.toISOString().slice(0, 10);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(dobRaw)) {
      date_of_birth = dobRaw;
    }
  }

  const row: ParsedTalentRow = {
    region,
    full_name,
    gender: emptyToNull(clampField(get('gender'), LIMITS.gender)),
    date_of_birth,
    phone,
    email: emptyToNull(clampField(get('email'), LIMITS.email)),
    national_id: emptyToNull(clampField(get('national_id'), LIMITS.national_id)),
    passport: emptyToNull(clampField(get('passport'), LIMITS.passport)),
    current_address: emptyToNull(clampField(get('current_address'), LIMITS.current_address)),
    city: emptyToNull(clampField(get('city'), LIMITS.city)),
    woreda_subcity: emptyToNull(clampField(get('woreda_subcity'), LIMITS.woreda_subcity)),
    emergency_contact_name: emptyToNull(clampField(get('emergency_contact_name'), LIMITS.emergency_contact_name)),
    emergency_contact_phone: emptyToNull(clampField(get('emergency_contact_phone'), LIMITS.emergency_contact_phone)),
    highest_education: emptyToNull(clampField(get('highest_education'), LIMITS.highest_education)),
    field_of_study: emptyToNull(clampField(get('field_of_study'), LIMITS.field_of_study)),
    institution_name: emptyToNull(clampField(get('institution_name'), LIMITS.institution_name)),
    graduation_year: emptyToNull(clampField(get('graduation_year'), LIMITS.graduation_year)),
    languages: emptyToNull(clampField(get('languages'), LIMITS.languages)),
    skills_summary: emptyToNull(clampField(get('skills_summary'), LIMITS.skills_summary)),
    notes: emptyToNull(clampField(get('notes'), LIMITS.notes)),
  };

  return { ok: true, row };
}

export function matrixToRecords(matrix: string[][]): Record<string, string>[] {
  if (matrix.length < 2) return [];
  const headerCells = matrix[0].map((h) => mapHeaderToCanonical(String(h)));
  const out: Record<string, string>[] = [];
  for (let r = 1; r < matrix.length; r++) {
    const line = matrix[r];
    if (!line || !line.some((c) => String(c).trim().length > 0)) continue;
    const rec: Record<string, string> = {};
    for (let c = 0; c < headerCells.length; c++) {
      const key = headerCells[c];
      if (!key) continue;
      rec[key] = String(line[c] ?? '').trim();
    }
    out.push(rec);
  }
  return out;
}
