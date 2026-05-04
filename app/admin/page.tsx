'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Inbox } from 'lucide-react';
import jobsData from '@/data/jobs.json';
import { useTranslation } from '@/hooks/useTranslation';
import { createClient, hasBrowserSupabaseConfig } from '@/lib/supabase/client';

type LeadStats = {
  enrollments: number;
  contact: number;
  employer: number;
  shortlist: number;
  regionalTalents: number;
};

type Me = {
  profile?: { role?: string };
  isSuperAdmin?: boolean;
};

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [me, setMe] = useState<Me | null>(null);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const role = me?.profile?.role ?? '';
  const isSuper = role === 'super_admin';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await fetch('/api/admin/me', { credentials: 'include', cache: 'no-store' });
        const meData = (await meRes.json()) as Me;
        if (cancelled) return;
        setMe(meData);

        setStatsLoading(true);
        setStatsError(null);
        const res = await fetch('/api/admin/stats', { credentials: 'include', cache: 'no-store' });
        const data = (await res.json().catch(() => ({}))) as LeadStats & { error?: string };
        if (cancelled) return;
        if (!res.ok) {
          setStats(null);
          setStatsError(typeof data.error === 'string' ? data.error : t('admin.leadInboxLoadError'));
          return;
        }
        setStats({
          enrollments: Number(data.enrollments) || 0,
          contact: Number(data.contact) || 0,
          employer: Number(data.employer) || 0,
          shortlist: Number(data.shortlist) || 0,
          regionalTalents: Number(data.regionalTalents) || 0,
        });
      } catch {
        if (!cancelled) {
          setStats(null);
          setStatsError(t('admin.leadInboxLoadError'));
        }
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleSignOut = async () => {
    if (!hasBrowserSupabaseConfig()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark md:text-4xl">{t('admin.title')}</h1>
          <p className="mt-1 text-gray-600">{t('admin.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-dark hover:bg-gray-50"
          >
            <ExternalLink size={16} />
            {t('admin.backToSite')}
          </Link>
          {hasBrowserSupabaseConfig() && (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-dark hover:bg-gray-300"
            >
              {t('admin.signOut')}
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {isSuper && (
          <Link
            href="/admin/users"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-medium hover:opacity-95"
          >
            {t('admin.navUsers')} →
          </Link>
        )}
        {isSuper && (
          <Link
            href="/admin/enrollments"
            className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5"
          >
            {t('admin.navEnrollments')} →
          </Link>
        )}
        {isSuper && (
          <Link
            href="/admin/messages"
            className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5"
          >
            {t('admin.navMessages')} →
          </Link>
        )}
        <Link
          href="/desk"
          className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5"
        >
          {t('navigation.desk')} →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl font-bold text-dark">{t('admin.activeJobs')}</h2>
          <div className="space-y-3">
            {jobsData.map((job) => (
              <div key={job.id} className="border-b border-gray-100 pb-3 last:border-0">
                <h3 className="font-semibold text-dark">{job.title}</h3>
                <p className="text-sm text-gray-600">
                  {job.location} • {job.type}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {t('admin.total')}: {jobsData.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <>
            <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Inbox size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-xl font-bold text-dark">{t('admin.leadInboxCardTitle')}</h2>
                  <p className="mt-1 text-sm text-gray-600">{t('admin.leadInboxCardSubtitle')}</p>
                </div>
              </div>

              {statsError ? (
                <p className="py-4 text-center text-sm text-red-600">{statsError}</p>
              ) : statsLoading || !stats ? (
                <p className="py-8 text-center text-gray-500">{t('common.loading')}</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-100 bg-slate-50/80 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t('admin.dashboardStatContact')}
                      </p>
                      <p className="mt-1 font-serif text-2xl font-bold text-primary">{stats.contact}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-slate-50/80 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t('admin.dashboardStatEmployer')}
                      </p>
                      <p className="mt-1 font-serif text-2xl font-bold text-primary">{stats.employer}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-slate-50/80 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t('admin.dashboardStatShortlist')}
                      </p>
                      <p className="mt-1 font-serif text-2xl font-bold text-primary">{stats.shortlist}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-slate-50/80 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t('admin.dashboardStatEnrollments')}
                      </p>
                      <p className="mt-1 font-serif text-2xl font-bold text-dark">{stats.enrollments}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-slate-50/80 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t('admin.dashboardStatRegional')}
                      </p>
                      <p className="mt-1 font-serif text-2xl font-bold text-dark">{stats.regionalTalents}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/admin/messages"
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-medium hover:opacity-95"
                    >
                      {t('admin.viewAllMessages')}
                    </Link>
                    <Link
                      href="/desk"
                      className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5"
                    >
                      {t('admin.openRegionalRegistration')}
                    </Link>
                  </div>
                </>
              )}

              <p className="mt-4 text-sm text-gray-500">{t('admin.dashboardDataNote')}</p>
          </>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-serif text-xl font-bold text-dark">{t('admin.seedData')}</h2>
        <p className="text-gray-600">
          {t('admin.seedDataInfo')} <code className="rounded bg-gray-100 px-2 py-0.5">data/jobs.json</code>.{' '}
          {t('admin.seedDataNote')}
        </p>
      </div>
    </div>
  );
}
