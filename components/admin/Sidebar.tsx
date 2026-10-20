'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  Users,
  Sparkles,
  Newspaper,
  Trash2,
  LogOut,
  X,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { cn } from '@/lib/utils';
import { T } from './T';
import { AdminTextSwitch } from './AdminTextSwitch';
import { useAdminText } from '@/context/AdminTextContext';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: AdminKey;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ href, icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <Link href={href} onClick={onClick}>
    <div
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 group relative cursor-pointer font-medium text-xs',
        active
          ? 'bg-brand-green text-white shadow-md shadow-brand-green/20 font-bold'
          : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
      )}
    >
      <Icon className={cn('w-4 h-4 transition-transform duration-200 group-hover:scale-110 flex-shrink-0', active ? 'text-white' : 'text-zinc-400 group-hover:text-brand-green')} />
      <T id={label} layout="stack" className="text-left font-bold leading-tight" />
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute -left-1 w-1 h-5 bg-brand-green rounded-r-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  </Link>
);

export const Sidebar = ({
  isOpen,
  onClose,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isSuperAdmin = user?.roles?.some((r) => r === 'ROLE_SUPER_ADMIN' || r === 'SUPER_ADMIN');

  const { t } = useAdminText();

  const menuItems: Array<{ href: string; icon: React.ElementType; label: AdminKey }> = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
    { href: '/admin/pages', icon: FileText, label: 'nav.pages' },
    { href: '/admin/navigation', icon: FolderTree, label: 'nav.navigation' },
    { href: '/admin/home-page', icon: Sparkles, label: 'nav.homePage' },
    { href: '/admin/products', icon: Layers, label: 'nav.products' },
    { href: '/admin/categories', icon: FolderTree, label: 'nav.categories' },
    { href: '/admin/news', icon: Newspaper, label: 'nav.news' },
    { href: '/admin/trash', icon: Trash2, label: 'nav.trash' },
    ...(isSuperAdmin
      ? [{ href: '/admin/users', icon: Users, label: 'nav.users' as const }]
      : []),
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-56 bg-white border-r border-zinc-100 z-50 transition-transform duration-300 lg:translate-x-0 shadow-sm flex flex-col justify-between',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 px-1">
              <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                <BrandLogo size={24} />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-black text-zinc-900 tracking-tight leading-tight">
                    APSONIC <span className="text-brand-green">ADMIN</span>
                  </span>
                  <span className="text-4xs font-bold uppercase tracking-widest text-zinc-400">
                    <T id="nav.portal" />
                  </span>
                </div>
              </Link>
              <button
                onClick={onClose}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg lg:hidden"
                aria-label={t('nav.closeMenu')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  {...item}
                  active={pathname === item.href || pathname.endsWith(item.href) || (item.href !== '/admin/dashboard' && pathname.includes(item.href))}
                  onClick={onClose}
                />
              ))}
            </nav>
          </div>

          <div className="space-y-2 pt-3 border-t border-zinc-100">
            <AdminTextSwitch className="flex w-full sm:hidden [&>button]:flex-1" />
            <button
              onClick={onLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group font-bold text-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-600 group-hover:scale-110 transition-transform flex-shrink-0" />
              <T id="nav.logout" layout="stack" className="text-left leading-tight" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
