import React from 'react';
import { cookies } from 'next/headers';
import { AdminProviders } from '@/components/admin/AdminProviders';
import { ADMIN_TEXT_COOKIE, normalizeAdminTextMode } from '@/lib/i18n/admin/text';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const mode = normalizeAdminTextMode((await cookies()).get(ADMIN_TEXT_COOKIE)?.value);
  return <AdminProviders initialMode={mode}>{children}</AdminProviders>;
}
