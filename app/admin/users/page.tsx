'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trash2, ShieldOff, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

type AdminUserRow = {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  banned_until: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  missing_profile?: boolean;
};

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const [deleteEmailInput, setDeleteEmailInput] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const roleLabel = (r: string) => {
    const m: Record<string, string> = {
      trainee: t('admin.roleTrainee'),
      employer: t('admin.roleEmployer'),
      staff: t('admin.roleStaff'),
      admin: t('admin.roleAdmin'),
      super_admin: t('admin.roleSuperAdmin'),
    };
    return m[r] ?? r;
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const meRes = await fetch('/api/admin/me', { credentials: 'include', cache: 'no-store' });
      const me = await meRes.json();
      if (me?.user?.id) setMyId(me.user.id);

      const res = await fetch(`/api/admin/users?page=${page}&perPage=50`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('admin.loadError'));
      setUsers(data.users ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('admin.loadError'));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, t]);

  useEffect(() => {
    load();
  }, [load]);

  const saveRow = async (row: AdminUserRow, role: string, full_name: string) => {
    setSavingId(row.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ role, full_name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('admin.saveError'));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('admin.saveError'));
    } finally {
      setSavingId(null);
    }
  };

  const toggleBan = async (row: AdminUserRow, banned: boolean) => {
    if (row.id === myId) return;
    setSavingId(row.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ banned }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('admin.saveError'));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('admin.saveError'));
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ confirmEmail: deleteEmailInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('admin.deleteError'));
      setDeleteTarget(null);
      setDeleteEmailInput('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('admin.deleteError'));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark">{t('admin.usersTitle')}</h1>
          <p className="text-gray-600">{t('admin.usersSubtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {t('admin.refresh')}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-accent/5 p-5 text-sm text-gray-700 shadow-soft">
        <h2 className="font-serif text-lg font-bold text-dark">{t('admin.roleHierarchyTitle')}</h2>
        <p className="mt-2 text-gray-600">{t('admin.roleHierarchyLead')}</p>
        <ol className="mt-3 list-decimal space-y-1.5 ps-5 text-gray-700">
          <li>{t('admin.roleHierarchyL1')}</li>
          <li>{t('admin.roleHierarchyL2')}</li>
          <li>{t('admin.roleHierarchyL3')}</li>
          <li>{t('admin.roleHierarchyL4')}</li>
          <li>{t('admin.roleHierarchyL5')}</li>
        </ol>
        <p className="mt-3 border-t border-primary/10 pt-3 text-xs text-gray-600">{t('admin.roleHierarchyNote')}</p>
      </div>

      {loading && users.length === 0 ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-soft">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 font-semibold text-dark">{t('admin.email')}</th>
                <th className="px-4 py-3 font-semibold text-dark">{t('admin.fullName')}</th>
                <th className="px-4 py-3 font-semibold text-dark">{t('admin.role')}</th>
                <th className="px-4 py-3 font-semibold text-dark">{t('admin.status')}</th>
                <th className="px-4 py-3 font-semibold text-dark">{t('admin.lastSignIn')}</th>
                <th className="px-4 py-3 font-semibold text-dark">{t('admin.created')}</th>
                <th className="px-4 py-3 font-semibold text-dark">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <UserRowEditor
                  key={row.id}
                  row={row}
                  myId={myId}
                  saving={savingId === row.id}
                  roleLabel={roleLabel}
                  onSave={(role, full_name) => saveRow(row, role, full_name)}
                  onBan={(b) => toggleBan(row, b)}
                  onDelete={() => {
                    setDeleteTarget(row);
                    setDeleteEmailInput('');
                  }}
                  t={t}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <span>
          {t('admin.page')} {page}
        </span>
        <button
          type="button"
          disabled={page <= 1 || loading}
          className="rounded border px-2 py-1 disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ‹
        </button>
        <button
          type="button"
          disabled={users.length < 50 || loading}
          className="rounded border px-2 py-1 disabled:opacity-40"
          onClick={() => setPage((p) => p + 1)}
        >
          ›
        </button>
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
            onClick={() => !deleteLoading && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-2 font-serif text-xl font-bold text-dark">{t('admin.deleteConfirmTitle')}</h3>
              <p className="mb-2 text-sm text-gray-600">{deleteTarget.email}</p>
              <p className="mb-3 text-sm text-gray-600">{t('admin.deleteConfirmHint')}</p>
              <input
                type="email"
                value={deleteEmailInput}
                onChange={(e) => setDeleteEmailInput(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder={deleteTarget.email}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={confirmDelete}
                  className="flex-1 rounded-full bg-red-600 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? t('forms.submitting') : t('admin.deleteConfirmButton')}
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserRowEditor({
  row,
  myId,
  saving,
  roleLabel,
  onSave,
  onBan,
  onDelete,
  t,
}: {
  row: AdminUserRow;
  myId: string | null;
  saving: boolean;
  roleLabel: (r: string) => string;
  onSave: (role: string, full_name: string) => void;
  onBan: (banned: boolean) => void;
  onDelete: () => void;
  t: (k: string) => string;
}) {
  const [role, setRole] = useState(row.role);
  const [fullName, setFullName] = useState(row.full_name);

  useEffect(() => {
    setRole(row.role);
    setFullName(row.full_name);
  }, [row.role, row.full_name, row.id]);

  const banned = Boolean(row.banned_until);
  const isSelf = row.id === myId;

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
      <td className="px-4 py-3 align-top">
        <div className="font-medium text-dark">{row.email}</div>
        {row.phone ? <div className="text-xs text-gray-500">{row.phone}</div> : null}
        {row.missing_profile ? (
          <div
            className="mt-2 inline-flex max-w-full flex-col gap-0.5 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-950"
            title={t('admin.missingProfileHint')}
          >
            <span className="font-semibold">{t('admin.missingProfileBadge')}</span>
            <span className="text-amber-900/90">{t('admin.missingProfileHint')}</span>
          </div>
        ) : null}
      </td>
      <td className="px-4 py-3 align-top">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full min-w-[8rem] rounded border border-gray-200 px-2 py-1 text-sm"
        />
      </td>
      <td className="px-4 py-3 align-top">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full min-w-[9rem] rounded border border-gray-200 px-2 py-1 text-sm"
        >
          {(['trainee', 'employer', 'staff', 'admin', 'super_admin'] as const).map((r) => (
            <option key={r} value={r}>
              {roleLabel(r)}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 align-top text-xs">
        <div>{row.email_confirmed_at ? t('admin.confirmed') : t('admin.unconfirmed')}</div>
        <div className={banned ? 'font-semibold text-red-600' : 'text-primary'}>
          {banned ? t('admin.banned') : t('admin.active')}
        </div>
      </td>
      <td className="px-4 py-3 align-top text-xs text-gray-600">
        {row.last_sign_in_at ? new Date(row.last_sign_in_at).toLocaleString() : '—'}
      </td>
      <td className="px-4 py-3 align-top text-xs text-gray-600">
        {new Date(row.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            disabled={saving || (role === row.role && fullName === row.full_name)}
            onClick={() => onSave(role, fullName)}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
          >
            {saving ? t('admin.saving') : t('admin.save')}
          </button>
          {!isSelf && (
            <button
              type="button"
              disabled={saving}
              onClick={() => onBan(!banned)}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-gray-300 px-2 py-1 text-xs font-semibold hover:bg-gray-50"
            >
              {banned ? <Shield size={14} /> : <ShieldOff size={14} />}
              {banned ? t('admin.unbanUser') : t('admin.banUser')}
            </button>
          )}
          {!isSelf && (
            <button
              type="button"
              disabled={saving}
              onClick={onDelete}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
            >
              <Trash2 size={14} />
              {t('admin.deleteUser')}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
