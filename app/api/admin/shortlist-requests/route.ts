import { NextRequest } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth/requireSuperAdmin';
import { jsonNoStore } from '@/lib/http/jsonNoStore';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const gate = await requireSuperAdmin();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  const limit = Math.min(100, Math.max(10, parseInt(request.nextUrl.searchParams.get('limit') || '40', 10)));
  const offset = Math.max(0, parseInt(request.nextUrl.searchParams.get('offset') || '0', 10));
  const end = offset + limit - 1;

  const { data, error, count } = await gate.admin
    .from('shortlist_requests')
    .select(
      'id, created_at, candidate_id, candidate_name, company_name, contact_person, email, phone, country, notes',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, end);

  if (error) {
    console.error(error);
    return jsonNoStore({ error: 'Could not load requests' }, 500);
  }

  return jsonNoStore({
    items: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
}
