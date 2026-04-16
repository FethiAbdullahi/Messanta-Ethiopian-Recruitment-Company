import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ensureSessionProfile } from '@/lib/auth/ensureSessionProfile';
import { jsonNoStore } from '@/lib/http/jsonNoStore';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonNoStore({ user: null, profile: null, isSuperAdmin: false });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonNoStore({ user: null, profile: null, isSuperAdmin: false });
  }

  await ensureSessionProfile(user);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, created_at')
    .eq('id', user.id)
    .maybeSingle();

  return jsonNoStore({
    user: { id: user.id, email: user.email },
    profile,
    isSuperAdmin: profile?.role === 'super_admin',
  });
}
