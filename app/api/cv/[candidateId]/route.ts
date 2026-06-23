import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CV_AUTHORIZED_ROLES, isSupabaseConfigured } from '@/lib/supabase/config';
import { ensureSessionProfile } from '@/lib/auth/ensureSessionProfile';
import { jsonNoStore } from '@/lib/http/jsonNoStore';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ candidateId: string }> }
) {
  if (!isSupabaseConfigured()) {
    return jsonNoStore({ error: 'Not configured' }, 503);
  }

  const { candidateId } = await context.params;
  if (!candidateId) {
    return jsonNoStore({ error: 'Missing candidate' }, 400);
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return jsonNoStore({ error: 'Unauthorized' }, 401);
  }

  await ensureSessionProfile(user);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return jsonNoStore({ error: 'Profile not found' }, 403);
  }

  if (!CV_AUTHORIZED_ROLES.includes(profile.role as (typeof CV_AUTHORIZED_ROLES)[number])) {
    return jsonNoStore({ error: 'Forbidden' }, 403);
  }

  const admin = createAdminClient();
  const { data: row, error: rowError } = await admin
    .from('candidate_cv_files')
    .select('storage_path')
    .eq('candidate_id', candidateId)
    .maybeSingle();

  if (rowError || !row?.storage_path) {
    return jsonNoStore({ error: 'CV not available' }, 404);
  }

  const { data: signed, error: signError } = await admin.storage
    .from('candidate-cvs')
    .createSignedUrl(row.storage_path, 120);

  if (signError || !signed?.signedUrl) {
    console.error(signError);
    return jsonNoStore({ error: 'Could not create download link' }, 500);
  }

  return jsonNoStore({ url: signed.signedUrl });
}
