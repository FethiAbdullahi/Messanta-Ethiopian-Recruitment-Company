import { NextRequest } from 'next/server';
import { requireRegionalTeam } from '@/lib/auth/requireRegionalTeam';
import { jsonNoStore } from '@/lib/http/jsonNoStore';
import { clientIpFromRequest, rateLimitExceeded } from '@/lib/security/rateLimit';
import {
  matrixToRecords,
  parseCsvToMatrix,
  parseXlsxToMatrix,
  rowRecordToTalent,
} from '@/lib/regionalTalentBulk';
import { talentRowToDbInsert } from '@/lib/regionalTalentPayload';

export const runtime = 'nodejs';

const BULK_WINDOW_MS = 60 * 60 * 1000;
const BULK_MAX = 8;
const MAX_ROWS = 500;

export async function POST(request: NextRequest) {
  const gate = await requireRegionalTeam();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  const ip = clientIpFromRequest(request);
  if (rateLimitExceeded(`regional-talent-bulk:${ip}`, BULK_MAX, BULK_WINDOW_MS)) {
    return jsonNoStore({ error: 'Too many bulk uploads. Please try again later.' }, 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonNoStore({ error: 'Invalid form data' }, 400);
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size < 1) {
    return jsonNoStore({ error: 'Upload a CSV or Excel file.' }, 400);
  }
  if (file.size > 8 * 1024 * 1024) {
    return jsonNoStore({ error: 'File too large (max 8 MB).' }, 400);
  }

  const defaultRegion = String(form.get('defaultRegion') ?? '').trim();
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();

  let matrix: string[][];
  let source: 'bulk_csv' | 'bulk_xlsx';
  try {
    if (name.endsWith('.csv')) {
      const text = new TextDecoder('utf-8').decode(buf);
      matrix = parseCsvToMatrix(text);
      source = 'bulk_csv';
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      matrix = parseXlsxToMatrix(buf);
      source = 'bulk_xlsx';
    } else {
      return jsonNoStore({ error: 'Use a .csv, .xls, or .xlsx file.' }, 400);
    }
  } catch (e) {
    console.error('[bulk parse]', e);
    return jsonNoStore({ error: 'Could not read the spreadsheet.' }, 400);
  }

  const records = matrixToRecords(matrix);
  if (records.length === 0) {
    return jsonNoStore({ error: 'No data rows found after the header row.' }, 400);
  }
  if (records.length > MAX_ROWS) {
    return jsonNoStore({ error: `Maximum ${MAX_ROWS} rows per upload.` }, 400);
  }

  const rowsToInsert: Record<string, unknown>[] = [];
  const rowErrors: { row: number; message: string }[] = [];

  for (let i = 0; i < records.length; i++) {
    const mapped = rowRecordToTalent(records[i], defaultRegion);
    if (!mapped.ok) {
      rowErrors.push({ row: i + 2, message: mapped.error });
      continue;
    }
    rowsToInsert.push(talentRowToDbInsert(mapped.row, gate.userId, source));
  }

  if (rowsToInsert.length === 0) {
    return jsonNoStore({ error: 'No valid rows to import.', rowErrors }, 400);
  }

  const { error } = await gate.admin.from('regional_talents').insert(rowsToInsert);
  if (error) {
    console.error('[regional-talents bulk insert]', error);
    return jsonNoStore({ error: 'Database import failed.', detail: error.message }, 500);
  }

  return jsonNoStore({
    ok: true,
    imported: rowsToInsert.length,
    skipped: rowErrors.length,
    rowErrors: rowErrors.slice(0, 50),
  });
}
