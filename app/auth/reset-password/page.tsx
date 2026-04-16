'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient, hasBrowserSupabaseConfig } from '@/lib/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<'error' | 'success'>('error');

  const configured = hasBrowserSupabaseConfig();

  useEffect(() => {
    if (!configured) {
      setChecking(false);
      setSessionReady(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionReady(Boolean(session));
      setChecking(false);
    });
  }, [configured]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!configured) {
      setTone('error');
      setMessage(t('auth.notConfigured'));
      return;
    }
    if (password.length < 6) {
      setTone('error');
      setMessage(t('auth.passwordTooShort'));
      return;
    }
    if (password !== confirm) {
      setTone('error');
      setMessage(t('auth.passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
      window.location.href = '/login?reset=success';
    } catch (err: unknown) {
      setTone('error');
      setMessage(err instanceof Error ? err.message : t('auth.errorGeneric'));
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
        <h1 className="mb-2 font-serif text-3xl font-bold text-dark">{t('auth.resetPasswordTitle')}</h1>
        <p className="mb-6 text-sm text-gray-600">{t('auth.resetPasswordSubtitle')}</p>

        {!configured && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{t('auth.notConfigured')}</p>
        )}

        {checking ? (
          <p className="text-sm text-gray-600">{t('forms.submitting')}</p>
        ) : !sessionReady ? (
          <div className="space-y-4">
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
              {t('auth.resetSessionMissing')}
            </p>
            <Link href="/login" className="inline-block text-sm font-semibold text-accent hover:text-primary">
              {t('auth.backToSignIn')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('auth.confirmPassword')}</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            {message && (
              <p className={`text-sm ${tone === 'success' ? 'text-primary' : 'text-red-600'}`}>{message}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
            >
              {loading ? t('forms.submitting') : t('auth.updatePassword')}
            </button>
          </form>
        )}

        {!checking && sessionReady && (
          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/login" className="text-primary hover:underline">
              {t('auth.backToSignIn')}
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
