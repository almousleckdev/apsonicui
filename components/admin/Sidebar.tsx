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

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  labelEn: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ href, icon: Icon, label, labelEn, active, onClick }: SidebarItemProps) => (
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
      <div className="flex flex-col text-left">
        <span className="leading-tight text-xs font-bold">{label}</span>
        <span className={cn('text-[8.5px] font-semibold tracking-wider uppercase leading-tight', active ? 'text-white/80' : 'text-zinc-400 group-hover:text-zinc-600')}>
          {labelEn}
        </span>
      </div>
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

  const menuItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: '仪表板', labelEn: 'Dashboard' },
    { href: '/admin/pages', icon: FileText, label: '页面管理', labelEn: 'Pages' },
    { href: '/admin/navigation', icon: FolderTree, label: '导航管理', labelEn: 'Navigation' },
    { href: '/admin/home-page', icon: Sparkles, label: '主页内容管理', labelEn: 'Home Page' },
    { href: '/admin/products', icon: Layers, label: '产品管理', labelEn: 'Products' },
    { href: '/admin/categories', icon: FolderTree, label: '产品分类', labelEn: 'Categories' },
    { href: '/admin/news', icon: Newspaper, label: '新闻管理', labelEn: 'News & Media' },
    { href: '/admin/trash', icon: Trash2, label: '回收站', labelEn: 'Trash' },
    ...(isSuperAdmin
      ? [{ href: '/admin/users', icon: Users, label: '用户管理', labelEn: 'Users' }]
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
                  <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                    Enterprise Portal
                  </span>
                </div>
              </Link>
              <button
                onClick={onClose}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg lg:hidden"
                aria-label="Close menu"
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

          <div className="pt-3 border-t border-zinc-100">
            <button
              onClick={onLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group font-bold text-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-600 group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="flex flex-col text-left">
                <span className="leading-tight">登出系统</span>
                <span className="text-[8.5px] font-semibold tracking-wider uppercase text-zinc-400 group-hover:text-red-500">
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
