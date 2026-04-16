'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Calendar, MessageSquare, ExternalLink } from 'lucide-react';
import jobsData from '@/data/jobs.json';
import { useTranslation } from '@/hooks/useTranslation';
import { createClient, hasBrowserSupabaseConfig } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [inquiries, setInquiries] = useState<
    { name?: string; email?: string; subject?: string; message?: string; date?: string }[]
  >([]);

  useEffect(() => {
    const stored = localStorage.getItem('contact_inquiries');
    if (stored) {
      try {
        setInquiries(JSON.parse(stored));
      } catch {
        setInquiries([]);
      }
    }
  }, []);

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
        <Link
          href="/admin/users"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-medium hover:opacity-95"
        >
          {t('admin.navUsers')} →
        </Link>
        <Link
          href="/admin/enrollments"
          className="rounded-full border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5"
        >
          {t('admin.navEnrollments')} →
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
          <h2 className="mb-4 font-serif text-xl font-bold text-dark">{t('admin.contactInquiries')}</h2>
          {inquiries.length > 0 ? (
            <div className="max-h-[28rem] space-y-4 overflow-y-auto">
              {inquiries.map((inquiry, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="mb-2 flex items-start gap-3">
                    <Mail className="mt-1 shrink-0 text-accent" size={20} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-dark">{inquiry.name}</p>
                      <p className="text-sm text-gray-600">{inquiry.email}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      <Calendar size={14} className="me-1 inline" />
                      {new Date(inquiry.date || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <MessageSquare size={14} className="me-1 inline text-accent" />
                    {inquiry.subject}: {inquiry.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">{t('admin.noInquiries')}</p>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-serif text-xl font-bold text-dark">{t('admin.seedData')}</h2>
        <p className="text-gray-600">
          {t('admin.seedDataInfo')} <code className="rounded bg-gray-100 px-2 py-0.5">data/jobs.json</code>.{' '}
          {t('admin.seedDataNote')}
        </p>
        <p className="mt-2 text-sm text-gray-500">{t('admin.productionNote')}</p>
      </div>
    </div>
  );
}
