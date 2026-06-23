'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight, Mail, Building2, UserCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const PAGE_SIZE = 40;

type Tab = 'contact' | 'employer' | 'shortlist';

type ContactRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
};

type EmployerRow = {
  id: string;
  created_at: string;
  company_name: string;
  country: string;
  contact_person: string;
  email: string;
  phone: string;
  roles_requested: string;
  number_of_workers: number;
  start_date: string;
  job_description: string;
  notes: string | null;
};

type ShortlistRow = {
  id: string;
  created_at: string;
  candidate_id: string;
  candidate_name: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  country: string;
  notes: string | null;
};

function apiPath(tab: Tab): string {
  if (tab === 'contact') return '/api/admin/contact-submissions';
  if (tab === 'employer') return '/api/admin/employer-requests';
  return '/api/admin/shortlist-requests';
}

function formatWhen(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleString(locale);
  } catch {
    return iso;
  }
}

export default function AdminMessagesPage() {
  const { t, currentLanguage } = useTranslation();
  const [tab, setTab] = useState<Tab>('contact');
  const [items, setItems] = useState<unknown[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (nextTab: Tab, nextOffset: number) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(nextOffset) });
        const res = await fetch(`${apiPath(nextTab)}?${qs}`, { credentials: 'include', cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t('admin.loadError'));
        setItems(data.items ?? []);
        setTotal(typeof data.total === 'number' ? data.total : 0);
        setOffset(nextOffset);
      } catch (e) {
        setError(e instanceof Error ? e.message : t('admin.loadError'));
        setItems([]);
        setTotal(0);
        setOffset(0);
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    load(tab, 0);
  }, [tab, load]);

  const hasPrev = offset > 0;
  const hasNext = offset + PAGE_SIZE < total;
  const start = total === 0 ? 0 : offset + 1;
  const end = offset + items.length;
  const loc = currentLanguage === 'am' ? 'am-ET' : currentLanguage === 'ar' ? 'ar' : undefined;

  const tabBtn = (id: Tab, label: string, Icon: typeof Mail) => (
    <button
      type="button"
      key={id}
      onClick={() => setTab(id)}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        tab === id ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 bg-white text-dark hover:border-primary/30'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="pb-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-dark md:text-4xl">
            {t('admin.messagesTitle')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
            {t('admin.messagesSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => load(tab, offset)}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark shadow-sm transition hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {t('admin.refresh')}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabBtn('contact', t('admin.messagesTabContact'), Mail)}
        {tabBtn('employer', t('admin.messagesTabEmployer'), Building2)}
        {tabBtn('shortlist', t('admin.messagesTabShortlist'), UserCircle)}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {!loading && total > 0 && (
        <p className="mb-4 text-sm text-gray-600">
          {t('admin.messagesPagination')
            .replace('{start}', String(start))
            .replace('{end}', String(end))
            .replace('{total}', String(total))}
        </p>
      )}

      {loading ? (
        <p className="py-16 text-center text-gray-500">{t('common.loading')}</p>
      ) : total === 0 ? (
        <p className="py-16 text-center text-gray-500">{t('admin.messagesEmpty')}</p>
      ) : tab === 'contact' ? (
        <ul className="space-y-4">
          {(items as ContactRow[]).map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-dark">{row.name}</p>
                  <p className="text-sm text-gray-600">
                    {row.email}
                    {row.phone ? ` · ${row.phone}` : ''}
                  </p>
                </div>
                <time className="whitespace-nowrap text-xs text-gray-500" dateTime={row.created_at}>
                  {formatWhen(row.created_at, loc ?? 'en-US')}
                </time>
              </div>
              <p className="text-sm font-medium text-primary">{row.subject}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{row.message}</p>
            </li>
          ))}
        </ul>
      ) : tab === 'employer' ? (
        <ul className="space-y-4">
          {(items as EmployerRow[]).map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-dark">{row.company_name}</p>
                  <p className="text-sm text-gray-600">
                    {row.country} · {row.number_of_workers} {t('admin.messagesWorkers')}
                  </p>
                </div>
                <time className="whitespace-nowrap text-xs text-gray-500" dateTime={row.created_at}>
                  {formatWhen(row.created_at, loc ?? 'en-US')}
                </time>
              </div>
              <p className="text-sm text-gray-700">
                {row.contact_person} · {row.email} · {row.phone}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium text-dark">{t('admin.messagesStart')}:</span>{' '}
                {row.start_date}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium text-dark">{t('forms.rolesRequested')}:</span> {row.roles_requested}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{row.job_description}</p>
              {row.notes ? (
                <p className="mt-2 whitespace-pre-wrap border-t border-gray-100 pt-2 text-sm text-gray-600">
                  {row.notes}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-4">
          {(items as ShortlistRow[]).map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-dark">{row.candidate_name}</p>
                  <p className="text-xs text-gray-500">ID: {row.candidate_id}</p>
                </div>
                <time className="whitespace-nowrap text-xs text-gray-500" dateTime={row.created_at}>
                  {formatWhen(row.created_at, loc ?? 'en-US')}
                </time>
              </div>
              <p className="text-sm text-gray-700">
                {row.company_name} · {row.country}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {row.contact_person} · {row.email} · {row.phone}
              </p>
              {row.notes ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{row.notes}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {!loading && total > PAGE_SIZE && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => load(tab, Math.max(0, offset - PAGE_SIZE))}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
            {t('admin.prevPage')}
          </button>
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => load(tab, offset + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('admin.nextPage')}
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
