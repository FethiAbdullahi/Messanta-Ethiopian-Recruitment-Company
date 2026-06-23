import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabasePublicUrl, hasPublicSupabaseConfig } from '@/lib/supabase/config';

export function hasBrowserSupabaseConfig(): boolean {
  return hasPublicSupabaseConfig();
}

export function createClient() {
  const url = getSupabasePublicUrl();
  const anon = getSupabaseAnonKey();
  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createBrowserClient(url, anon);
}
