import { NextRequest } from 'next/server';
import { requireRegionalTeam } from '@/lib/auth/requireRegionalTeam';
import { jsonNoStore } from '@/lib/http/jsonNoStore';
import { clampField } from '@/lib/security/enrollValidation';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest) {
  const gate = await requireRegionalTeam();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: 'Invalid JSON' }, 400);
  }
  const o = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  const raw = String(o.defaultRegion ?? o.default_region ?? '').trim();
  const default_region = clampField(raw, 200);
  if (default_region.length < 2) {
    return jsonNoStore({ error: 'Region must be at least 2 characters.' }, 400);
  }

  const { error } = await gate.admin.from('profiles').update({ default_region }).eq('id', gate.userId);
  if (error) {
    console.error('[default-region PATCH]', error);
    return jsonNoStore({ error: 'Could not update profile' }, 500);
  }

  return jsonNoStore({ ok: true, default_region });
}
