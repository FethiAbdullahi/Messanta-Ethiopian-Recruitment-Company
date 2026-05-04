'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardList, Inbox } from 'lucide-react';

type Props = {
  email: string;
  role: string;
  labels: {
    dashboard: string;
    users: string;
    enrollments: string;
    messages: string;
  };
};

export default function AdminSubNav({ email, role, labels }: Props) {
  const pathname = usePathname();
  const showSuperOnlyNav = role === 'super_admin';

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClass = (href: string) =>
    `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
      isActive(href) ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'
    }`;

  return (
    <nav className="sticky top-24 z-30 border-b border-primary/10 bg-white/90 shadow-[0_8px_30px_-12px_rgba(15,118,110,0.15)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Link href="/admin" className={linkClass('/admin')}>
            <LayoutDashboard size={18} />
            {labels.dashboard}
          </Link>
          {showSuperOnlyNav && (
            <Link href="/admin/users" className={linkClass('/admin/users')}>
              <Users size={18} />
              {labels.users}
            </Link>
          )}
          {showSuperOnlyNav && (
            <Link href="/admin/enrollments" className={linkClass('/admin/enrollments')}>
              <ClipboardList size={18} />
              {labels.enrollments}
            </Link>
          )}
          {showSuperOnlyNav && (
            <Link href="/admin/messages" className={linkClass('/admin/messages')}>
              <Inbox size={18} />
              {labels.messages}
            </Link>
          )}
        </div>
        <p
          className="max-w-[16rem] truncate rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200/80 sm:text-sm"
          title={email}
        >
          {email}
        </p>
      </div>
    </nav>
  );
}
