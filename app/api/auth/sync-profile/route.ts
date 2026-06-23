import { createClient } from '@/lib/supabase/server';
import { ensureSessionProfile } from '@/lib/auth/ensureSessionProfile';
import { jsonNoStore } from '@/lib/http/jsonNoStore';
import { hasPublicSupabaseConfig } from '@/lib/supabase/config';

/**
 * Creates a missing profiles row and/or promotes the configured owner to super_admin.
 * Call after sign-in (Nav) so RLS-backed reads and admin gates see up-to-date data.
 */
export async function POST() {
  if (!hasPublicSupabaseConfig()) {
    return jsonNoStore({ ok: false, error: 'not_configured' }, 503);
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return jsonNoStore({ ok: false, error: 'unauthorized' }, 401);
  }

  const result = await ensureSessionProfile(user);
  return jsonNoStore({ ok: true, ...result });
}
