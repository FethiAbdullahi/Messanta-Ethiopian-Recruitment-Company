function trimEnv(value: string | undefined): string {
  return value?.replace(/\r/g, '').trim() ?? '';
}

export function getSupabasePublicUrl(): string {
  return trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string {
  return trimEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseServiceRoleKey(): string {
  return trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasPublicSupabaseConfig(): boolean {
  return Boolean(getSupabasePublicUrl() && getSupabaseAnonKey());
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    getSupabasePublicUrl() &&
      getSupabaseAnonKey() &&
      getSupabaseServiceRoleKey()
  );
}

export const CV_AUTHORIZED_ROLES = ['employer', 'staff', 'admin', 'super_admin'] as const;
export type CvAuthorizedRole = (typeof CV_AUTHORIZED_ROLES)[number];
