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
    .from('employer_requests')
    .select(
      'id, created_at, company_name, country, contact_person, email, phone, roles_requested, number_of_workers, start_date, job_description, notes',
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
