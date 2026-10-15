'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Search, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Logo } from './logo';
import { ProductsDropdown } from '../features/products-dropdown';
import { NavMenu } from './header/NavMenu';
import { LanguageSelector } from './header/LanguageSelector';
import { MobileNavDrawer } from './header/MobileNavDrawer';
import { useSiteNavigation } from '@/hooks/useSiteNavigation';
import { toSiteItems, type SiteNavItem } from '@/lib/navigation/site';
import type { Locale } from '@/lib/page-builder/types';
import { cn } from '@/lib/utils';

const DROPDOWN_CLOSE_DELAY = 150;

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // The menu administrators publish in the CMS; until one is published (or if it cannot be loaded) the built-in menu stays.
  const published = useSiteNavigation('header').data;
  const builtIn: SiteNavItem[] = [
    { id: 'products', label: t('products'), href: '/products', hasDropdown: true, newTab: false, external: false, children: [] },
    { id: 'services', label: t('services'), href: '/services', newTab: false, external: false, children: [] },
    { id: 'contact', label: t('contact'), href: '/contact', newTab: false, external: false, children: [] },
  ];
  const navItems = published?.configured ? toSiteItems(published.items, locale as Locale) : builtIn;

  const isTransparentPage = pathname === '/';

  const { isScrolled, isVisible } = useScrollDirection({
    scrolledThreshold: 60,
    hideThreshold: 100,
    autoShowAfterIdleMs: 500,
  });

  const handleLanguageChange = (next: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('show-site-loader'));
    }
    router.replace(pathname, { locale: next });
  };

  const openDropdown = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsProductsDropdownOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, DROPDOWN_CLOSE_DELAY);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        animate={isVisible ? 'visible' : 'hidden'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center border-b border-transparent',
          isScrolled || isMobileMenuOpen || !isTransparentPage
            ? 'bg-[#058B4F]/95 backdrop-blur-md border-[#058B4F]/10 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <Logo size="md" />

          {/* Desktop Navigation */}
          <NavMenu
            navItems={navItems}
            pathname={pathname}
            isTransparentPage={isTransparentPage}
            isScrolled={isScrolled}
            onOpenDropdown={openDropdown}
            onCloseDropdown={closeDropdown}
          />

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'py-1.5 pl-9 pr-4 rounded-full text-xs transition-all duration-300 outline-none border focus:ring-2 focus:ring-brand-green/30 w-[160px] focus:w-[220px]',
                  isTransparentPage && !isScrolled
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/25 focus:border-white/40'
                    : 'bg-[#046e3e] border-[#035932] text-white placeholder-[#E0E0E0] focus:bg-[#035932]'
                )}
              />
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </form>

            <LanguageSelector
              locale={locale}
              onLanguageChange={handleLanguageChange}
              isTransparentPage={isTransparentPage}
              isScrolled={isScrolled}
              ariaLabel={t('languageSelectorAriaLabel')}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#E0E0E0] hover:text-white transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? t('closeMenu') : t('openMenu')}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Products Dropdown */}
        <AnimatePresence>
          {isProductsDropdownOpen && (
            <ProductsDropdown
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
              onClose={() => setIsProductsDropdownOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        pathname={pathname}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        isMobileProductsOpen={isMobileProductsOpen}
        setIsMobileProductsOpen={setIsMobileProductsOpen}
        locale={locale}
        onLanguageChange={handleLanguageChange}
        onClose={() => setIsMobileMenuOpen(false)}
        t={t}
      />
    </>
  );
};
