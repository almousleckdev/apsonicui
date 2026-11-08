import type { Metadata } from 'next';
import { AdminAuthShell } from '@/components/admin/login/AdminAuthShell';
import { AdminLoginHero } from '@/components/admin/login/AdminLoginHero';
import { AdminLoginForm } from '@/components/admin/login/AdminLoginForm';
import { locales } from '@/lib/i18n/locales';

export const metadata: Metadata = {
  title: '管理员登录 Admin sign-in | APSONIC',
  description: 'APSONIC 企业 CMS 管理员登录门户 · APSONIC enterprise CMS administrator portal',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface AdminLoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminLoginPage({ params }: AdminLoginPageProps) {
  await params;

  return (
    <AdminAuthShell hero={<AdminLoginHero />}>
      <AdminLoginForm />
    </AdminAuthShell>
  );
}
