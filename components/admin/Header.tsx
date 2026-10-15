'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadContactCount } from '@/hooks/queries/useUnreadContactCount';
import { T } from './T';
import { AdminTextSwitch } from './AdminTextSwitch';
import { useAdminText } from '@/context/AdminTextContext';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

interface HeaderProps {
  onMenuClick: () => void;
  titleKey: AdminKey;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, titleKey }) => {
  const { t } = useAdminText();
  const { user } = useAuth();
  const { data: unreadCount = 0 } = useUnreadContactCount();

  const username = user?.username || 'Super Admin';
  const roleName = user?.roles?.[0] ? user.roles[0].replace('ROLE_', '') : 'Super Admin';
  const avatarUrl = user?.avatarUrl || '/images/logo/apsoniclogo.png';

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-xl px-4 md:px-8 font-sans">
      {/* Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 text-zinc-500 hover:text-zinc-900 rounded-lg lg:hidden"
          aria-label={t('nav.openMenu')}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-extrabold text-zinc-900 md:text-2xl tracking-tight"><T id={titleKey} layout="stack" /></h1>
      </div>

      {/* Right Controls: Search, Notifications, Profile */}
      <div className="flex items-center gap-5 relative">
        <AdminTextSwitch className="hidden sm:inline-flex" />
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-zinc-100 border border-transparent rounded-full px-4 py-2 w-64 focus-within:border-brand-green/50 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            className="bg-transparent border-none outline-none text-xs text-zinc-900 ml-2 w-full placeholder-zinc-400 font-medium"
          />
        </div>

        {/* Notifications Icon Link to /admin/notifications */}
        <Link href="/admin/notifications">
          <div className="relative p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer" title={t('header.notifications')}>
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-3xs font-black flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </Link>

        {/* Clickable User Profile Settings Link */}
        <Link href="/admin/profile">
          <div className="flex items-center gap-3 pl-3 border-l border-zinc-200 cursor-pointer group">
            <div className="hidden text-right md:block">
              <p className="text-xs font-bold text-zinc-900 group-hover:text-brand-green transition-colors">{username}</p>
              <p className="text-3xs font-extrabold text-brand-green uppercase tracking-wider">{roleName}</p>
            </div>
            <div className="h-10 w-10 relative rounded-full overflow-hidden border border-brand-green/30 shadow-sm bg-zinc-100 flex items-center justify-center font-bold text-brand-green group-hover:scale-105 transition-transform">
              <Image
                src={avatarUrl}
                alt={username}
                fill
                unoptimized
                sizes="40px"
                className="object-cover"
              />
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};
