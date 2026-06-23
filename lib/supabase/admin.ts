import { createClient } from '@supabase/supabase-js';
import { getSupabasePublicUrl, getSupabaseServiceRoleKey } from '@/lib/supabase/config';

export function createAdminClient() {
  const url = getSupabasePublicUrl();
  const key = getSupabaseServiceRoleKey();
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
