import { NextRequest } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth/requireSuperAdmin';
import { jsonNoStore } from '@/lib/http/jsonNoStore';

export const runtime = 'nodejs';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ enrollmentId: string }> }
) {
  const gate = await requireSuperAdmin();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  const { enrollmentId } = await context.params;
  if (!enrollmentId || !UUID_RE.test(enrollmentId)) {
    return jsonNoStore({ error: 'Invalid enrollment' }, 400);
  }

  const { data: row, error } = await gate.admin
    .from('enrollments')
    .select('id, cv_storage_path')
    .eq('id', enrollmentId)
    .maybeSingle();

  if (error || !row?.cv_storage_path) {
    return jsonNoStore({ error: 'No uploaded CV for this application' }, 404);
  }

  const { data: signed, error: signErr } = await gate.admin.storage
    .from('enrollment-files')
    .createSignedUrl(row.cv_storage_path, 180);

  if (signErr || !signed?.signedUrl) {
    console.error(signErr);
    return jsonNoStore({ error: 'Could not create secure download link' }, 500);
  }

  return jsonNoStore({ url: signed.signedUrl });
}
