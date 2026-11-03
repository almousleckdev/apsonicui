import type { Metadata } from 'next';
import { AdminAuthShell } from '@/components/admin/login/AdminAuthShell';
import { ForgotPasswordForm } from '@/components/admin/login/ForgotPasswordForm';

export const metadata: Metadata = {
  title: '忘记密码 | APSONIC',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AdminAuthShell>
      <ForgotPasswordForm />
    </AdminAuthShell>
  );
}
