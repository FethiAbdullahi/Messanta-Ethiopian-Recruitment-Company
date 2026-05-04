import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import DeskChrome from '@/components/desk/DeskChrome';

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-40 pb-20">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h1 className="mb-2 font-serif text-xl font-bold">Desk unavailable</h1>
          <p className="text-sm">Add Supabase keys to <code className="rounded bg-white/80 px-1">.env.local</code>.</p>
          <Link href="/" className="mt-4 inline-block text-sm font-semibold text-primary underline">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/desk');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();

  const role = profile?.role ?? '';
  const allowed = role === 'staff' || role === 'admin' || role === 'super_admin';
  if (!profile || !allowed) {
    redirect('/login?next=/desk&error=forbidden');
  }

  const showAdminLink = role === 'admin' || role === 'super_admin';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100/90 via-white to-slate-50 pb-20 pt-24">
      <DeskChrome email={user.email ?? ''} showAdminLink={showAdminLink} />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
