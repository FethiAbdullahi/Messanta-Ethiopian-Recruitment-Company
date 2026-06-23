'use client';

import Link from 'next/link';
import { createClient, hasBrowserSupabaseConfig } from '@/lib/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';

type Props = {
  email: string;
  showAdminLink: boolean;
};

export default function DeskChrome({ email, showAdminLink }: Props) {
  const { t } = useTranslation();

  const signOut = async () => {
    if (!hasBrowserSupabaseConfig()) return;
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch {
      /* ignore */
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link href="/" className="font-serif text-lg font-bold text-primary hover:opacity-90">
            {t('desk.backToSite')}
          </Link>
          <span className="hidden text-slate-300 sm:inline">|</span>
          <span className="rounded-lg bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/80 sm:text-sm" title={email}>
            {email}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSelector variant="dark" />
          {showAdminLink && (
            <Link
              href="/admin"
              className="rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              {t('navigation.admin')}
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-dark hover:bg-slate-200"
          >
            {t('navigation.signOut')}
          </button>
        </div>
      </div>
    </header>
  );
}
