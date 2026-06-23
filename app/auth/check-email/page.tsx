'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';
import { createClient, hasBrowserSupabaseConfig } from '@/lib/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';

function CheckEmailContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email')?.trim() ?? '';
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    if (!hasBrowserSupabaseConfig()) {
      setHasSession(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(Boolean(session));
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/15 via-light to-accent/10 px-4 pt-28 pb-20">
      <div
        className="pointer-events-none absolute -start-32 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-24 bottom-32 h-80 w-80 rounded-full bg-accent/25 blur-3xl"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mx-auto max-w-lg"
      >
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
            {hasSession === true ? <Sparkles size={32} strokeWidth={2} /> : <Mail size={32} strokeWidth={2} />}
          </div>

          <h1 className="text-center font-serif text-2xl font-bold text-dark sm:text-3xl">
            {hasSession === true ? t('auth.checkEmailInstantTitle') : t('auth.checkEmailTitle')}
          </h1>

          <p className="mt-3 text-center text-sm leading-relaxed text-gray-600 sm:text-base">
            {hasSession === true
              ? t('auth.checkEmailInstantBody')
              : t('auth.checkEmailBody')}
          </p>

          {emailParam && hasSession === false && (
            <p className="mt-5 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-center text-sm font-medium text-dark">
              <span className="text-gray-500">{t('auth.checkEmailSentTo')} </span>
              <span className="break-all text-primary">{emailParam}</span>
            </p>
          )}

          {hasSession === null && (
            <p className="mt-6 text-center text-sm text-gray-400">{t('common.loading')}</p>
          )}
          {hasSession === false && (
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="mt-0.5 font-bold text-accent">1.</span>
                {t('auth.checkEmailStep1')}
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 font-bold text-accent">2.</span>
                {t('auth.checkEmailStep2')}
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 font-bold text-accent">3.</span>
                {t('auth.checkEmailStep3')}
              </li>
            </ul>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {hasSession === true ? (
              <>
                <Link
                  href="/candidates"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-medium transition hover:opacity-95"
                >
                  {t('auth.checkEmailContinue')}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border-2 border-primary/30 bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                >
                  {t('auth.backToSignIn')}
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-medium transition hover:opacity-95"
              >
                {t('auth.backToSignIn')}
                <ArrowRight size={18} />
              </Link>
            )}
          </div>

          {hasSession === false && (
            <p className="mt-8 text-center text-xs text-gray-400">{t('auth.checkEmailSpamHint')}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gradient-to-br from-primary/10 to-light pt-32" />}
    >
      <CheckEmailContent />
    </Suspense>
  );
}
