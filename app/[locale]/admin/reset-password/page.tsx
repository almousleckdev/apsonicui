import type { Metadata } from 'next';
import { AdminAuthShell } from '@/components/admin/login/AdminAuthShell';
import { ResetPasswordForm } from '@/components/admin/login/ResetPasswordForm';

export const metadata: Metadata = {
  title: '设置密码 | APSONIC',
  // The address carries a secret one-time token: keep it out of search engines and out of the Referer header.
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  const value = Array.isArray(token) ? token[0] : token;

  return (
    <AdminAuthShell>
      <ResetPasswordForm token={value ?? ''} />
    </AdminAuthShell>
  );
}
