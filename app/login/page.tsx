'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient, hasBrowserSupabaseConfig } from '@/lib/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';

function getAuthErrorMessage(err: unknown, t: (key: string) => string): string {
  if (err instanceof Error) {
    const message = err.message.toLowerCase();
    if (
      message === 'failed to fetch' ||
      message.includes('network') ||
      message.includes('fetch failed') ||
      err.name === 'AuthRetryableFetchError'
    ) {
      return t('auth.networkError');
    }
    return err.message;
  }
  return t('auth.errorGeneric');
}

function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/candidates';
  const accessDenied = searchParams.get('error') === 'forbidden';
  const passwordResetSuccess = searchParams.get('reset') === 'success';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [resetFlow, setResetFlow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<'error' | 'success'>('error');

  const configured = hasBrowserSupabaseConfig();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!configured) {
      setMessageTone('error');
      setMessage(t('auth.notConfigured'));
      return;
    }
    setLoading(true);
    const supabase = createClient();

    try {
      if (resetFlow) {
        const origin = window.location.origin;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent('/auth/reset-password')}`,
        });
        if (error) throw error;
        setMessageTone('success');
        setMessage(t('auth.resetEmailSent'));
        return;
      }

      if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.session) {
          await fetch('/api/auth/sync-profile', { method: 'POST', credentials: 'include', cache: 'no-store' }).catch(
            () => {}
          );
        }
        router.push(`/auth/check-email?email=${encodeURIComponent(email)}`);
        router.refresh();
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await fetch('/api/auth/sync-profile', { method: 'POST', credentials: 'include', cache: 'no-store' }).catch(
          () => {}
        );
        router.push(next.startsWith('/') ? next : '/candidates');
        router.refresh();
      }
    } catch (err: unknown) {
      setMessageTone('error');
      setMessage(getAuthErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200 bg-white p-8 shadow-soft"
      >
        <h1 className="mb-2 font-serif text-3xl font-bold text-dark">{t('auth.loginTitle')}</h1>
        <p className="mb-6 text-sm text-gray-600">{t('auth.subtitle')}</p>

        {passwordResetSuccess && (
          <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
            {t('auth.passwordUpdated')}
          </div>
        )}

        {accessDenied && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <p className="font-semibold">{t('admin.forbiddenTitle')}</p>
            <p className="mt-1">{t('admin.forbiddenBody')}</p>
          </div>
        )}

        {!configured && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{t('auth.notConfigured')}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {resetFlow ? (
            <>
              <p className="text-sm text-gray-600">{t('auth.resetPasswordIntro')}</p>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t('auth.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </>
          ) : (
            <>
              {mode === 'signup' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{t('forms.fullName')}</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={mode === 'signup'}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{t('auth.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <label className="block text-sm font-medium text-gray-700">{t('auth.password')}</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setResetFlow(true);
                        setMessage(null);
                      }}
                      className="text-sm font-medium text-accent hover:text-primary"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </>
          )}

          {message && (
            <p className={`text-sm ${messageTone === 'success' ? 'text-primary' : 'text-red-600'}`}>{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
          >
            {loading
              ? t('forms.submitting')
              : resetFlow
                ? t('auth.sendResetLink')
                : mode === 'signup'
                  ? t('auth.signUp')
                  : t('auth.signIn')}
          </button>
        </form>

        {resetFlow ? (
          <button
            type="button"
            onClick={() => {
              setResetFlow(false);
              setMessage(null);
            }}
            className="mt-4 w-full text-center text-sm text-accent hover:text-primary"
          >
            {t('auth.backToSignIn')}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setMessage(null);
            }}
            className="mt-4 w-full text-center text-sm text-accent hover:text-primary"
          >
            {mode === 'signin' ? t('auth.needAccount') : t('auth.haveAccount')}
          </button>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/candidates" className="text-primary hover:underline">
            {t('navigation.candidates')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-light pt-32" />}>
      <LoginForm />
    </Suspense>
  );
}
