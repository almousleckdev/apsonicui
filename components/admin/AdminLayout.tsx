'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ActionModal } from './ActionModal';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { T } from './T';
import { useAdminText } from '@/context/AdminTextContext';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

/** The heading shown in the top bar for the page being viewed, by the last part of its address. */
const PAGE_TITLES: Record<string, AdminKey> = {
  dashboard: 'nav.dashboard',
  pages: 'nav.pages',
  navigation: 'nav.navigation',
  'home-page': 'nav.homePage',
  products: 'nav.products',
  categories: 'nav.categories',
  news: 'nav.news',
  users: 'nav.users',
  trash: 'nav.trash',
  notifications: 'nav.notifications',
  profile: 'nav.profile',
  new: 'titles.new',
  edit: 'titles.edit',
};

function pageTitleKey(path: string): AdminKey {
  const last = path.split('/').filter(Boolean).pop() ?? '';
  return PAGE_TITLES[last] ?? 'nav.dashboard';
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { t } = useAdminText();

  // Protect administrative routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const titleKey = pageTitleKey(pathname);

  // The page editor is a full-screen workspace with its own top bar; it still sits behind the sign-in check.
  const isImmersive = /\/admin\/pages\/\d+\/?$/.test(pathname);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
          <p className="text-xs font-semibold text-zinc-500"><T id="session.verifying" /></p>
        </div>
      </div>
    );
  }

  if (isImmersive) {
    return <div className="min-h-screen bg-zinc-100 text-zinc-900">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-brand-green/30 selection:text-brand-green">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => setIsLogoutDialogOpen(true)}
      />

      <div className="lg:ml-56 flex flex-col min-h-screen">
        <Header onMenuClick={() => setIsSidebarOpen(true)} titleKey={titleKey} />
        <main className="flex-grow p-4 md:p-8">{children}</main>
      </div>

      <ActionModal
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        variant="danger"
        title={t('session.signOutTitle')}
        description={t('session.signOutText')}
        confirmLabel={t('session.signOut')}
        cancelLabel={t('common.cancel')}
        isLoading={isLoggingOut}
      />
    </div>
  );
};
