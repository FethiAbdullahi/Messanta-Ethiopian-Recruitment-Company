import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ensureSessionProfile } from '@/lib/auth/ensureSessionProfile';

export type SuperAdminResult =
  | { ok: true; userId: string; email: string | undefined; admin: ReturnType<typeof createAdminClient> }
  | { ok: false; status: 401 | 403 | 503; message: string };

export async function requireSuperAdmin(): Promise<SuperAdminResult> {
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

  if (profileError || !profile || profile.role !== 'super_admin') {
    return { ok: false, status: 403, message: 'Super admin access required' };
  }

  return {
    ok: true,
    userId: user.id,
    email: user.email,
    admin: createAdminClient(),
  };
}
