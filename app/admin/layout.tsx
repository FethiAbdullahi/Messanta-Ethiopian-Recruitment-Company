import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { AdminLayoutLabels } from './AdminLayoutLabels';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-40 pb-20">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h1 className="mb-2 font-serif text-xl font-bold">Admin unavailable</h1>
          <p className="text-sm">
            Add Supabase keys to <code className="rounded bg-white/80 px-1">.env.local</code> to use the admin panel.
          </p>
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
    redirect('/login?next=/admin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role ?? '';
  if (role === 'staff') {
    redirect('/desk');
  }
  const canAccess = role === 'admin' || role === 'super_admin';
  if (!profile || !canAccess) {
    redirect('/login?next=/admin&error=forbidden');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100/90 via-white to-slate-50 pb-20 pt-24">
      <AdminLayoutLabels email={user.email ?? ''} role={role}>
        {children}
      </AdminLayoutLabels>
    </div>
  );
}
