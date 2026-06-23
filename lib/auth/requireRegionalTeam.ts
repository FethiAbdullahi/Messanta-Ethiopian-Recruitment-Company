import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ensureSessionProfile } from '@/lib/auth/ensureSessionProfile';

export type RegionalTeamRole = 'staff' | 'admin' | 'super_admin';

export type RegionalTeamResult =
  | {
      ok: true;
      userId: string;
      email: string | undefined;
      role: RegionalTeamRole;
      admin: ReturnType<typeof createAdminClient>;
      /** Admins and super admins see every record; staff only their own. */
      seeAllRegionalTalents: boolean;
    }
  | { ok: false; status: 401 | 403 | 503; message: string };

const ALLOWED = new Set<string>(['staff', 'admin', 'super_admin']);

export async function requireRegionalTeam(): Promise<RegionalTeamResult> {
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

  if (profileError || !profile || !ALLOWED.has(profile.role)) {
    return { ok: false, status: 403, message: 'Staff, admin, or super admin access required' };
  }

  const role = profile.role as RegionalTeamRole;
  const seeAllRegionalTalents = role === 'admin' || role === 'super_admin';

  return {
    ok: true,
    userId: user.id,
    email: user.email,
    role,
    admin: createAdminClient(),
    seeAllRegionalTalents,
  };
}
