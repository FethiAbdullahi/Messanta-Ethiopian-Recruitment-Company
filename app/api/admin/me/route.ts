import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ensureSessionProfile } from '@/lib/auth/ensureSessionProfile';
import { jsonNoStore } from '@/lib/http/jsonNoStore';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonNoStore({
      user: null,
      profile: null,
      isSuperAdmin: false,
      isAdmin: false,
      isStaff: false,
      canOpenAdminShell: false,
      canOpenDesk: false,
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonNoStore({
      user: null,
      profile: null,
      isSuperAdmin: false,
      isAdmin: false,
      isStaff: false,
      canOpenAdminShell: false,
      canOpenDesk: false,
    });
  }

  await ensureSessionProfile(user);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, created_at, default_region')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role ?? '';
  const canOpenAdminShell = role === 'admin' || role === 'super_admin';
  const canOpenDesk = role === 'staff' || role === 'admin' || role === 'super_admin';

  return jsonNoStore({
    user: { id: user.id, email: user.email },
    profile,
    isSuperAdmin: role === 'super_admin',
    isAdmin: role === 'admin',
    isStaff: role === 'staff',
    canOpenAdminShell,
    canOpenDesk,
  });
}
