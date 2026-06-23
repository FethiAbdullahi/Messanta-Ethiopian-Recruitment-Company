'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, ExternalLink, ChevronLeft, ChevronRight, FileText, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const PAGE_SIZE = 40;

type Enrollment = {
  id: string;
  created_at: string;
  full_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
  national_id: string;
  passport: string | null;
  program_id: string | null;
  program_title: string;
  experience: string | null;
  cv_storage_path: string | null;
  cv_link: string | null;
};

export default function AdminEnrollmentsPage() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Enrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvBusyId, setCvBusyId] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  const load = useCallback(async (nextOffset: number) => {
    setLoading(true);
    setError(null);
    setCvError(null);
    try {
      const qs = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(nextOffset) });
      const res = await fetch(`/api/admin/enrollments?${qs}`, { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('admin.loadError'));
      setRows(data.enrollments ?? []);
      setTotal(typeof data.total === 'number' ? data.total : 0);
      setOffset(nextOffset);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('admin.loadError'));
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load(0);
  }, [load]);

  const openSecureCv = async (id: string) => {
    setCvError(null);
    setCvBusyId(id);
    try {
      const res = await fetch(`/api/admin/enrollments/${encodeURIComponent(id)}/cv`, {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setCvError(data.error ?? t('admin.enrollmentCvError'));
        return;
      }
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch {
      setCvError(t('admin.enrollmentCvError'));
    } finally {
      setCvBusyId(null);
    }
  };

  const end = offset + rows.length;
  const hasPrev = offset > 0;
  const hasNext = offset + PAGE_SIZE < total;

  return (
    <div className="pb-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-dark md:text-4xl">
            {t('admin.enrollmentsTitle')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
            {t('admin.enrollmentsSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => load(offset)}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark shadow-sm transition hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {t('admin.refresh')}
        </button>
      </div>

      {!loading && total > 0 && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('admin.enrollmentStatTotal')}</p>
            <p className="mt-1 font-serif text-2xl font-bold text-primary">{total}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('admin.enrollmentStatWithFile')}</p>
            <p className="mt-1 font-serif text-2xl font-bold text-dark">
              {rows.filter((r) => r.cv_storage_path).length}
              <span className="text-sm font-normal text-gray-500"> {t('admin.enrollmentStatOnPage')}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('admin.enrollmentStatExternal')}</p>
            <p className="mt-1 font-serif text-2xl font-bold text-dark">
              {rows.filter((r) => r.cv_link && !r.cv_storage_path).length}
              <span className="text-sm font-normal text-gray-500"> {t('admin.enrollmentStatOnPage')}</span>
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}
      {cvError && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">
          {cvError}
        </div>
      )}

      {loading && rows.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-8 text-gray-600 shadow-sm">
          <RefreshCw size={22} className="animate-spin text-primary" />
          {t('common.loading')}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-12 text-center text-gray-600">
          {t('admin.noEnrollments')}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-slate-50/90 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3 font-semibold">{t('admin.enrolledAt')}</th>
                    <th className="px-4 py-3 font-semibold">{t('forms.fullName')}</th>
                    <th className="px-4 py-3 font-semibold">{t('forms.emailAddress')}</th>
                    <th className="px-4 py-3 font-semibold">{t('admin.phone')}</th>
                    <th className="px-4 py-3 font-semibold">{t('admin.program')}</th>
                    <th className="px-4 py-3 font-semibold">{t('forms.experience')}</th>
                    <th className="px-4 py-3 font-semibold">{t('forms.nationalId')}</th>
                    <th className="px-4 py-3 font-semibold">{t('admin.enrollmentCvColumn')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.map((r, i) => (
                    <tr
                      key={r.id}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-dark">{r.full_name}</td>
                      <td className="max-w-[180px] truncate px-4 py-3 text-gray-700" title={r.email}>
                        {r.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">{r.phone}</td>
                      <td className="max-w-[220px] px-4 py-3 text-gray-700" title={r.program_title}>
                        <span className="line-clamp-2">{r.program_title}</span>
                      </td>
                      <td className="max-w-[200px] px-4 py-3 text-xs text-gray-600" title={r.experience ?? ''}>
                        <span className="line-clamp-3">{r.experience?.trim() || '—'}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.national_id}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          {r.cv_storage_path ? (
                            <button
                              type="button"
                              disabled={cvBusyId === r.id}
                              onClick={() => openSecureCv(r.id)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
                            >
                              <Download size={14} />
                              {cvBusyId === r.id ? t('common.loading') : t('admin.downloadEnrollmentCv')}
                            </button>
                          ) : null}
                          {r.cv_link ? (
                            <a
                              href={r.cv_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
                            >
                              <ExternalLink size={14} />
                              {t('admin.openExternalCv')}
                            </a>
                          ) : null}
                          {!r.cv_storage_path && !r.cv_link ? (
                            <span className="text-xs text-gray-400">—</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              {t('admin.enrollmentPagination')
                .replace('{start}', String(total === 0 ? 0 : offset + 1))
                .replace('{end}', String(total === 0 ? 0 : end))
                .replace('{total}', String(total))}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!hasPrev || loading}
                onClick={() => load(Math.max(0, offset - PAGE_SIZE))}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-dark hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                {t('admin.prevPage')}
              </button>
              <button
                type="button"
                disabled={!hasNext || loading}
                onClick={() => load(offset + PAGE_SIZE)}
                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-dark hover:bg-gray-50 disabled:opacity-40"
              >
                {t('admin.nextPage')}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <p className="mt-6 flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 p-4 text-xs leading-relaxed text-gray-700">
            <FileText size={16} className="mt-0.5 shrink-0 text-primary" />
            {t('admin.enrollmentCvSecurityNote')}
          </p>
        </>
      )}
    </div>
  );
}
