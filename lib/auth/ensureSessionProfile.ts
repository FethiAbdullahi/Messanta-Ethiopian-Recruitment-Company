import type { User } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';

const DEFAULT_OWNER = 'skillsforlifeethio@gmail.com';

export function ownerBootstrapEmail(): string {
  return (process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL ?? DEFAULT_OWNER).trim().toLowerCase();
}

/**
 * Ensures public.profiles has a row for this auth user (common gap: profiles deleted while auth.users remains).
 * Owner email gets super_admin; everyone else gets trainee on first insert.
 * Uses service role when available. Safe to call on every authenticated request.
 */
export async function ensureSessionProfile(user: User): Promise<{
  created: boolean;
  promotedToSuperAdmin: boolean;
  skipped: boolean;
}> {
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { created: false, promotedToSuperAdmin: false, skipped: true };
  }

  const email = user.email?.trim().toLowerCase() ?? '';
  const isOwner = email.length > 0 && email === ownerBootstrapEmail();

  const { data: row, error: selErr } = await admin.from('profiles').select('id, role').eq('id', user.id).maybeSingle();
  if (selErr) {
    console.error('[ensureSessionProfile] select', selErr);
    return { created: false, promotedToSuperAdmin: false, skipped: false };
  }

  if (!row) {
    const fullName =
      typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '';
    const role = isOwner ? 'super_admin' : 'trainee';
    const { error: insErr } = await admin.from('profiles').insert({
      id: user.id,
      full_name: fullName,
      role,
    });
    if (insErr) {
      if (insErr.code === '23505') {
        if (isOwner) {
          const { error: upErr } = await admin.from('profiles').update({ role: 'super_admin' }).eq('id', user.id);
          if (!upErr) return { created: false, promotedToSuperAdmin: true, skipped: false };
        }
        return { created: false, promotedToSuperAdmin: false, skipped: false };
      }
      console.error('[ensureSessionProfile] insert', insErr);
      return { created: false, promotedToSuperAdmin: false, skipped: false };
    }
    return { created: true, promotedToSuperAdmin: isOwner, skipped: false };
  }

  if (isOwner && row.role !== 'super_admin') {
    const { error: upErr } = await admin.from('profiles').update({ role: 'super_admin' }).eq('id', user.id);
    if (upErr) {
      console.error('[ensureSessionProfile] promote', upErr);
      return { created: false, promotedToSuperAdmin: false, skipped: false };
    }
    return { created: false, promotedToSuperAdmin: true, skipped: false };
  }

  return { created: false, promotedToSuperAdmin: false, skipped: false };
}
