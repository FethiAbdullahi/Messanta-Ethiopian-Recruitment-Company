'use client';

import AdminSubNav from '@/components/admin/AdminSubNav';
import { useTranslation } from '@/hooks/useTranslation';

export function AdminLayoutLabels({
  email,
  role,
  children,
}: {
  email: string;
  role: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <>
      <AdminSubNav
        email={email}
        role={role}
        labels={{
          dashboard: t('admin.navDashboard'),
          users: t('admin.navUsers'),
          enrollments: t('admin.navEnrollments'),
          messages: t('admin.navMessages'),
        }}
      />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">{children}</div>
    </>
  );
}
