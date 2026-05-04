import { NextRequest } from 'next/server';
import { requireRegionalTeam } from '@/lib/auth/requireRegionalTeam';
import { jsonNoStore } from '@/lib/http/jsonNoStore';
import { clientIpFromRequest, rateLimitExceeded } from '@/lib/security/rateLimit';
import { parseTalentJsonBody, talentRowToDbInsert } from '@/lib/regionalTalentPayload';

export const runtime = 'nodejs';

const POST_WINDOW_MS = 15 * 60 * 1000;
const POST_MAX = 30;

export async function GET(request: NextRequest) {
  const gate = await requireRegionalTeam();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  const limit = Math.min(100, Math.max(10, parseInt(request.nextUrl.searchParams.get('limit') || '40', 10)));
  const offset = Math.max(0, parseInt(request.nextUrl.searchParams.get('offset') || '0', 10));
  const end = offset + limit - 1;

  let q = gate.admin
    .from('regional_talents')
    .select(
      'id, created_at, updated_at, created_by, region, source, full_name, gender, date_of_birth, phone, email, national_id, passport, current_address, city, woreda_subcity, emergency_contact_name, emergency_contact_phone, highest_education, field_of_study, institution_name, graduation_year, languages, skills_summary, notes',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false });

  if (!gate.seeAllRegionalTalents) {
    q = q.eq('created_by', gate.userId);
  }

  const { data, error, count } = await q.range(offset, end);

  if (error) {
    console.error('[regional-talents GET]', error);
    return jsonNoStore({ error: 'Could not load records' }, 500);
  }

  const rows = data ?? [];
  const creatorIds = [...new Set(rows.map((r) => r.created_by).filter(Boolean))] as string[];
  let creatorNames: Record<string, string> = {};
  if (creatorIds.length > 0) {
    const { data: profs } = await gate.admin.from('profiles').select('id, full_name').in('id', creatorIds);
    creatorNames = Object.fromEntries((profs ?? []).map((p) => [p.id, p.full_name ?? '']));
  }

  return jsonNoStore({
    items: rows.map((r) => ({
      ...r,
      submitted_by_name: creatorNames[r.created_by] ?? null,
    })),
    total: count ?? 0,
    limit,
    offset,
    scope: gate.seeAllRegionalTalents ? 'all' : 'mine',
  });
}

export async function POST(request: NextRequest) {
  const gate = await requireRegionalTeam();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  const ip = clientIpFromRequest(request);
  if (rateLimitExceeded(`regional-talent-post:${ip}`, POST_MAX, POST_WINDOW_MS)) {
    return jsonNoStore({ error: 'Too many submissions. Please wait and try again.' }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: 'Invalid JSON' }, 400);
  }

  const o = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};

  const { data: prof } = await gate.admin.from('profiles').select('default_region').eq('id', gate.userId).maybeSingle();
  const clientFallback =
    typeof o.defaultRegionFallback === 'string' ? o.defaultRegionFallback.trim() : '';
  const fallbackRegion = (clientFallback || prof?.default_region || '').trim();

  const parsed = parseTalentJsonBody(o, fallbackRegion);
  if ('error' in parsed) {
    return jsonNoStore({ error: parsed.error }, 400);
  }

  const insert = talentRowToDbInsert(parsed, gate.userId, 'form');
  const { data: inserted, error } = await gate.admin.from('regional_talents').insert(insert).select('id').single();

  if (error) {
    console.error('[regional-talents POST]', error);
    return jsonNoStore({ error: 'Could not save record' }, 500);
  }

  const setDefault = o.setDefaultRegion === true && parsed.region.length >= 2;
  if (setDefault) {
    await gate.admin.from('profiles').update({ default_region: parsed.region }).eq('id', gate.userId);
  }

  return jsonNoStore({ ok: true, id: inserted?.id, defaultRegionUpdated: Boolean(setDefault) });
}
