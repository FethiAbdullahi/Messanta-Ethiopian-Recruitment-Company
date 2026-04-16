import { NextRequest } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth/requireSuperAdmin';
import { jsonNoStore } from '@/lib/http/jsonNoStore';

export const runtime = 'nodejs';

const ROLES = ['trainee', 'employer', 'staff', 'admin', 'super_admin'] as const;

export async function GET(request: NextRequest) {
  const gate = await requireSuperAdmin();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1', 10));
  const perPage = Math.min(100, Math.max(10, parseInt(request.nextUrl.searchParams.get('perPage') || '50', 10)));

  const { data: list, error: listError } = await gate.admin.auth.admin.listUsers({
    page,
    perPage,
  });

  if (listError || !list) {
    console.error(listError);
    return jsonNoStore({ error: 'Could not list users' }, 500);
  }

  const { data: profiles, error: profError } = await gate.admin.from('profiles').select('id, full_name, role, created_at');

  if (profError) {
    console.error(profError);
    return jsonNoStore({ error: 'Could not load profiles' }, 500);
  }

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  const users = list.users.map((u) => {
    const p = byId.get(u.id);
    return {
      id: u.id,
      email: u.email ?? '',
      phone: u.phone ?? '',
      banned_until: u.banned_until ?? null,
      email_confirmed_at: u.email_confirmed_at ?? null,
      last_sign_in_at: u.last_sign_in_at ?? null,
      created_at: u.created_at,
      full_name: p?.full_name ?? '',
      role: (p?.role as (typeof ROLES)[number] | undefined) ?? 'trainee',
      profile_created_at: p?.created_at ?? null,
      missing_profile: !p,
    };
  });

  return jsonNoStore({
    users,
    page,
    perPage,
    total: list.users.length,
  });
}
