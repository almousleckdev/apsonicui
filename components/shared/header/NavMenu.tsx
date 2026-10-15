'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SiteNavItem } from '@/lib/navigation/site';
import { NavLink } from './NavLink';

interface NavMenuProps {
  navItems: SiteNavItem[];
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
        const isActive = item.href !== null && pathname === item.href;
        const isProducts = item.hasDropdown;
        const hasChildren = item.children.length > 0 && !isProducts;
        const linkClass = cn(
          'text-sm font-medium transition-colors hover:text-[#FFD700] flex items-center gap-1 relative py-1',
          isActive ? 'text-[#FFD700]' : isTransparentPage && !isScrolled ? 'text-[#E0E0E0]' : 'text-white'
        );
        const content = (
          <>
            {item.label}
            {(isProducts || hasChildren) && <ChevronDown className="w-4 h-4 opacity-70" aria-hidden />}
            {isActive && (
              <motion.span
                layoutId="activeNavIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD700]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </>
        );

        return (
          <div
            key={item.id}
            className="group/nav relative h-full flex items-center py-2"
            onMouseEnter={isProducts ? onOpenDropdown : undefined}
            onMouseLeave={isProducts ? onCloseDropdown : undefined}
          >
            {item.href !== null ? (
              <NavLink href={item.href} external={item.external} newTab={item.newTab} className={linkClass}>{content}</NavLink>
            ) : (
              <button type="button" aria-haspopup="menu" className={cn(linkClass, 'cursor-default')}>{content}</button>
            )}

            {hasChildren && (
              <div className="absolute left-0 top-full z-50 hidden pt-1 group-hover/nav:block group-focus-within/nav:block">
                <ul role="menu" className="min-w-56 rounded-xl bg-white py-2 text-zinc-800 shadow-xl ring-1 ring-black/5">
                  {item.children.map((child) => (
                    <li key={child.id} role="none">
                      {child.href !== null ? (
                        <NavLink href={child.href} external={child.external} newTab={child.newTab} role="menuitem"
                          className="block px-4 py-2 text-sm font-medium hover:bg-zinc-50 hover:text-brand-green">{child.label}</NavLink>
                      ) : (
                        <span className="block px-4 pt-2 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">{child.label}</span>
                      )}
                      {child.children.length > 0 && (
                        <ul role="none" className="pb-1">
                          {child.children.map((grand) => grand.href !== null && (
                            <li key={grand.id} role="none">
                              <NavLink href={grand.href} external={grand.external} newTab={grand.newTab} role="menuitem"
                                className="block py-1.5 pl-8 pr-4 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand-green">{grand.label}</NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
