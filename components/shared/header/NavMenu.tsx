'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

interface NavMenuProps {
  navItems: NavItem[];
  pathname: string;
  isTransparentPage: boolean;
  isScrolled: boolean;
  onOpenDropdown: () => void;
  onCloseDropdown: () => void;
}

export const NavMenu: React.FC<NavMenuProps> = ({
  navItems,
  pathname,
  isTransparentPage,
  isScrolled,
  onOpenDropdown,
  onCloseDropdown,
}) => {
  return (
    <nav className="hidden md:flex items-center gap-8 h-full">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const isProducts = item.hasDropdown;

        return (
          <div
            key={item.href}
            className="relative h-full flex items-center py-2"
            onMouseEnter={isProducts ? onOpenDropdown : undefined}
            onMouseLeave={isProducts ? onCloseDropdown : undefined}
          >
            <Link
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-[#FFD700] flex items-center gap-1 relative py-1',
                isActive
                  ? 'text-[#FFD700]'
                  : isTransparentPage && !isScrolled
                  ? 'text-[#E0E0E0]'
                  : 'text-white'
              )}
            >
              {item.label}
              {isProducts && <ChevronDown className="w-4 h-4 opacity-70" />}
              {isActive && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD700]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          </div>
        );
      })}
    </nav>
  );
};
