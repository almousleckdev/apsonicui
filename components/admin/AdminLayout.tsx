'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ActionModal } from './ActionModal';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

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

  // Protect administrative routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const getPageTitles = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];

    if (!lastPart || lastPart === 'dashboard') {
      return { zh: '仪表板概览', en: 'Dashboard' };
    }

    const titles: Record<string, { zh: string; en: string }> = {
      pages: { zh: '页面管理', en: 'Pages' },
      navigation: { zh: '导航管理', en: 'Navigation' },
      'home-page': { zh: '主页内容管理', en: 'Home Page' },
      products: { zh: '产品管理', en: 'Products' },
      categories: { zh: '产品分类', en: 'Categories' },
      news: { zh: '新闻管理', en: 'News & Media' },
      users: { zh: '用户管理', en: 'Users' },
      notifications: { zh: '通知中心', en: 'Notifications' },
      new: { zh: '新建', en: 'New Item' },
      edit: { zh: '编辑', en: 'Edit Item' },
    };

    return (
      titles[lastPart] || {
        zh: lastPart.charAt(0).toUpperCase() + lastPart.slice(1),
        en: lastPart.charAt(0).toUpperCase() + lastPart.slice(1),
      }
    );
  };

  const { zh: titleZh, en: titleEn } = getPageTitles(pathname);
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
          <p className="text-xs font-semibold text-zinc-500">正在验证权限... Verifying Permissions...</p>
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
        <Header onMenuClick={() => setIsSidebarOpen(true)} title={titleZh} titleEn={titleEn} />
        <main className="flex-grow p-4 md:p-8">{children}</main>
      </div>

      <ActionModal
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        variant="danger"
        title="Confirm Sign Out / 确认登出系统"
        description="Are you sure you want to end your current admin session? You will need to sign in again to access the portal."
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        isLoading={isLoggingOut}
      />
    </div>
  );
};
