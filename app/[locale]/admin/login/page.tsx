import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { AdminLoginHero } from '@/components/admin/login/AdminLoginHero';
import { AdminLoginForm } from '@/components/admin/login/AdminLoginForm';
import { ADMIN_AUTH_CONSTANTS } from '@/lib/constants/auth';
import { locales } from '@/lib/i18n/locales';

export const metadata: Metadata = {
  title: '管理员登录 | APSONIC 企业管理门户',
  description: 'APSONIC 企业 CMS 管理员登录门户',
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
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white selection:bg-brand-green selection:text-white">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={ADMIN_AUTH_CONSTANTS.BACKGROUND_IMAGE_PATH}
          alt="Apsonic Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-75 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Page Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 min-h-screen flex flex-col justify-between">
        {/* Top Header Logo */}
        <header className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-36">
              <Image
                src={ADMIN_AUTH_CONSTANTS.LOGO_IMAGE_PATH}
                alt="APSONIC Logo"
                fill
                priority
                sizes="144px"
                className="object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        </header>

        {/* Hero & Login Card Grid forced to Chinese locale */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
            <AdminLoginHero />
            <AdminLoginForm />
          </div>
      </div>
    </main>
  );
}
