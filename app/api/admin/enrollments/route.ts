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
    .from('enrollments')
    .select(
      'id, created_at, full_name, date_of_birth, phone, email, national_id, passport, program_id, program_title, experience, cv_storage_path, cv_link',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, end);

  if (error) {
    console.error(error);
    return jsonNoStore({ error: 'Could not load enrollments' }, 500);
  }

  return jsonNoStore({
    enrollments: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
}
