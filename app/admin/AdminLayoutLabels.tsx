'use client';

import AdminSubNav from '@/components/admin/AdminSubNav';
import { useTranslation } from '@/hooks/useTranslation';

export function AdminLayoutLabels({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <>
      <AdminSubNav
        email={email}
        labels={{
          dashboard: t('admin.navDashboard'),
          users: t('admin.navUsers'),
          enrollments: t('admin.navEnrollments'),
        }}
      />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">{children}</div>
    </>
  );
}
