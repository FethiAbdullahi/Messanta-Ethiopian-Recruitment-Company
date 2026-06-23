import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ensureSessionProfile } from '@/lib/auth/ensureSessionProfile';

export type AdminOrSuperResult =
  | { ok: true; userId: string; email: string | undefined; isSuperAdmin: boolean; admin: ReturnType<typeof createAdminClient> }
  | { ok: false; status: 401 | 403 | 503; message: string };

export async function requireAdminOrSuper(): Promise<AdminOrSuperResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, status: 503, message: 'Supabase is not configured' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, status: 401, message: 'Not signed in' };
  }

  await ensureSessionProfile(user);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { ok: false, status: 403, message: 'Access denied' };
  }

  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
    return { ok: false, status: 403, message: 'Admin access required' };
  }

  return {
    ok: true,
    userId: user.id,
    email: user.email,
    isSuperAdmin: profile.role === 'super_admin',
    admin: createAdminClient(),
  };
}
