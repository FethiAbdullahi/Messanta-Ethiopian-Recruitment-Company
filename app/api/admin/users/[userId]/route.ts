import { NextRequest } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth/requireSuperAdmin';
import { jsonNoStore } from '@/lib/http/jsonNoStore';

export const runtime = 'nodejs';

const ROLES = new Set(['trainee', 'employer', 'staff', 'admin', 'super_admin']);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const gate = await requireSuperAdmin();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  const { userId } = await context.params;
  if (!userId) {
    return jsonNoStore({ error: 'Missing user id' }, 400);
  }

  let body: { role?: string; full_name?: string; banned?: boolean };
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: 'Invalid JSON' }, 400);
  }

  const profilePatch: { role?: string; full_name?: string } = {};

  if (body.role !== undefined) {
    if (!ROLES.has(body.role)) {
      return jsonNoStore({ error: 'Invalid role' }, 400);
    }
    if (userId === gate.userId && body.role !== 'super_admin') {
      return jsonNoStore({ error: 'You cannot remove your own super admin role here' }, 400);
    }
    profilePatch.role = body.role;
  }

  if (body.full_name !== undefined) {
    profilePatch.full_name = String(body.full_name).slice(0, 200);
  }

  if (Object.keys(profilePatch).length > 0) {
    const { data: existing } = await gate.admin.from('profiles').select('id').eq('id', userId).maybeSingle();
    if (!existing) {
      const { error: insErr } = await gate.admin.from('profiles').insert({
        id: userId,
        role: profilePatch.role ?? 'trainee',
        full_name: profilePatch.full_name ?? '',
      });
      if (insErr) {
        console.error(insErr);
        return jsonNoStore({ error: 'Could not create profile' }, 500);
      }
    } else {
      const { error: upErr } = await gate.admin.from('profiles').update(profilePatch).eq('id', userId);
      if (upErr) {
        console.error(upErr);
        return jsonNoStore({ error: 'Could not update profile' }, 500);
      }
    }
  }

  if (body.banned !== undefined) {
    if (userId === gate.userId) {
      return jsonNoStore({ error: 'You cannot ban yourself' }, 400);
    }
    const { error: banErr } = await gate.admin.auth.admin.updateUserById(userId, {
      ban_duration: body.banned ? '876000h' : 'none',
    });
    if (banErr) {
      console.error(banErr);
      return jsonNoStore({ error: 'Could not update ban status' }, 500);
    }
  }

  return jsonNoStore({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const gate = await requireSuperAdmin();
  if (!gate.ok) {
    return jsonNoStore({ error: gate.message }, gate.status);
  }

  const { userId } = await context.params;
  if (!userId || userId === gate.userId) {
    return jsonNoStore({ error: 'Cannot delete this account' }, 400);
  }

  let body: { confirmEmail?: string };
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: 'Invalid JSON' }, 400);
  }

  const { data: target, error: getErr } = await gate.admin.auth.admin.getUserById(userId);
  if (getErr || !target?.user?.email || target.user.email !== body.confirmEmail?.trim()) {
    return jsonNoStore({ error: 'Email confirmation does not match' }, 400);
  }

  const { error: delErr } = await gate.admin.auth.admin.deleteUser(userId);
  if (delErr) {
    console.error(delErr);
    return jsonNoStore({ error: 'Could not delete user' }, 500);
  }

  return jsonNoStore({ ok: true });
}
