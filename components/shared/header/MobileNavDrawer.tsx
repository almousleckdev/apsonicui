'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Search, ChevronDown, ChevronRight, PhoneCall, MapPin, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { productMenuService } from '@/services/product-menu-service';
import type { SiteNavItem } from '@/lib/navigation/site';
import { NavLink } from './NavLink';
import { DEFAULT_PRODUCT_MENU_GROUPS, groupLabel, type ProductMenuGroup } from '@/lib/product-menu/groups';


interface MobileNavDrawerProps {
  isOpen: boolean;
  navItems: SiteNavItem[];
  pathname: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isMobileProductsOpen: boolean;
  setIsMobileProductsOpen: (open: boolean) => void;
  locale: string;
  onLanguageChange: (lang: string) => void;
  onClose: () => void;
  t: (key: string) => string;
}

const LANGUAGE_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  navItems,
  pathname,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  isMobileProductsOpen,
  setIsMobileProductsOpen,
  locale,
  onLanguageChange,
  onClose,
  t,
}) => {
  const [menuGroups, setMenuGroups] = useState<ProductMenuGroup[]>(DEFAULT_PRODUCT_MENU_GROUPS);
  useEffect(() => {
    productMenuService.getGroups().then(setMenuGroups).catch(() => {});
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="md:hidden fixed inset-0 top-20 z-40 bg-[#058B4F] overflow-y-auto px-4 py-8 flex flex-col gap-6"
        >
          <form onSubmit={onSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 bg-[#046e3e] border border-[#035932] text-white placeholder-[#E0E0E0] rounded-full text-sm outline-none focus:ring-2 focus:ring-[#FFD700]/30"
            />
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
          </form>

          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = item.href !== null && pathname === item.href;
              if (item.hasDropdown) {
                return (
                  <div key={item.id} className="flex flex-col border-b border-[#046e3e]">
                    <button
                      type="button"
                      onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                      className={cn(
                        'flex items-center justify-between text-lg font-bold py-2 w-full text-left cursor-pointer transition-colors',
                        isActive ? 'text-[#FFD700]' : 'text-[#E0E0E0] hover:text-[#FFD700]'
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={cn('w-5 h-5 transition-transform duration-200 text-white/70', isMobileProductsOpen && 'rotate-180')} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isMobileProductsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden flex flex-col pl-4 pb-4 gap-3 pt-2"
                        >
                          <Link
                            href="/products"
                            onClick={onClose}
                            className="text-sm text-white font-medium flex items-center justify-between py-1 hover:text-[#FFD700]"
                          >
                            <span>{t('allProducts')}</span>
                            <ChevronRight className="w-4 h-4 opacity-50" />
                          </Link>
                          {menuGroups.map((group) => (
                            <Link
                              key={group.id}
                              href={`/products?category=${group.id}`}
                              onClick={onClose}
                              className="text-sm text-[#E0E0E0] flex items-center justify-between py-1 hover:text-[#FFD700]"
                            >
                              <span>{groupLabel(group, locale)}</span>
                              <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return <MobileNavEntry key={item.id} item={item} isActive={isActive} onClose={onClose} />;
            })}
          </nav>

          {/* Quick Access Services Links */}
          <div className="flex flex-col gap-3 pt-2 border-t border-[#046e3e]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#FFD700] opacity-90">
              {t('services')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/services/locations"
                onClick={onClose}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#046e3e] border border-[#035932] text-xs text-white hover:border-[#FFD700]"
              >
                <MapPin className="w-4 h-4 text-[#FFD700]" />
                <span className="font-semibold line-clamp-1">{t('locations')}</span>
              </Link>
              <Link
                href="/services/parts"
                onClick={onClose}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#046e3e] border border-[#035932] text-xs text-white hover:border-[#FFD700]"
              >
                <Wrench className="w-4 h-4 text-[#FFD700]" />
                <span className="font-semibold line-clamp-1">{t('parts')}</span>
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-4 border-t border-[#046e3e]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#E0E0E0] font-medium">Select Language:</span>
              <div className="flex items-center gap-2 bg-[#046e3e] p-1 rounded-full border border-[#035932]">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onLanguageChange(opt.value)}
                    className={cn(
                      'px-3 py-1 text-xs font-bold rounded-full transition-all',
                      locale === opt.value
                        ? 'bg-[#FFD700] text-[#058B4F] shadow-sm'
                        : 'text-[#E0E0E0] hover:text-white'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              onClick={onClose}
              className="w-full py-3 bg-[#FFD700] text-[#058B4F] font-bold text-center rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t('contactUs')}</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** A top-level entry: a plain link, or an expandable group when it has items under it. */
function MobileNavEntry({ item, isActive, onClose }: { item: SiteNavItem; isActive: boolean; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const rowClass = cn('text-lg font-bold py-2 transition-colors', isActive ? 'text-[#FFD700]' : 'text-[#E0E0E0] hover:text-[#FFD700]');

  if (item.children.length === 0) {
    return item.href !== null ? (
      <NavLink href={item.href} external={item.external} newTab={item.newTab} onClick={onClose} className={cn(rowClass, 'border-b border-[#046e3e]')}>{item.label}</NavLink>
    ) : null;
  }
  return (
    <div className="flex flex-col border-b border-[#046e3e]">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={cn(rowClass, 'flex w-full cursor-pointer items-center justify-between text-left')}>
        <span>{item.label}</span>
        <ChevronDown className={cn('w-5 h-5 transition-transform duration-200 text-white/70', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <ul className="flex flex-col gap-1 pl-4 pb-4 pt-1">
          {item.href !== null && (
            <li><NavLink href={item.href} external={item.external} newTab={item.newTab} onClick={onClose} className="block py-1.5 text-sm font-medium text-white hover:text-[#FFD700]">{item.label}</NavLink></li>
          )}
          {item.children.map((child) => (
            <li key={child.id}>
              {child.href !== null ? (
                <NavLink href={child.href} external={child.external} newTab={child.newTab} onClick={onClose} className="block py-1.5 text-sm text-[#E0E0E0] hover:text-[#FFD700]">{child.label}</NavLink>
              ) : (
                <span className="block pt-2 text-[11px] font-extrabold uppercase tracking-wider text-white/60">{child.label}</span>
              )}
              {child.children.length > 0 && (
                <ul className="pl-4">
                  {child.children.map((grand) => grand.href !== null && (
                    <li key={grand.id}><NavLink href={grand.href} external={grand.external} newTab={grand.newTab} onClick={onClose} className="block py-1 text-sm text-[#E0E0E0]/80 hover:text-[#FFD700]">{grand.label}</NavLink></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
