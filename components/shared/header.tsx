"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Search, Globe, Menu, X, ChevronDown } from "lucide-react";
import { usePathname, useRouter, Link } from "@/lib/i18n/navigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Logo } from "./logo";
import { ProductsDropdown } from "../features/products-dropdown";
import { cn } from "@/lib/utils";

const DROPDOWN_CLOSE_DELAY = 150;

const LANGUAGE_OPTIONS = [
  { value: "zh", label: "中" },
  { value: "fr", label: "Fr" },
  { value: "en", label: "En" },
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = [
    { label: t("products"), href: "/products", hasDropdown: true },
    { label: t("services"), href: "/services" },
    { label: t("contact"), href: "/contact" },
  ];

  // Transparent header ONLY on homepage
  const isTransparentPage = pathname === "/";

  const { isScrolled, isVisible } = useScrollDirection({
    scrolledThreshold: 60,
    hideThreshold: 100,
    autoShowAfterIdleMs: 500,
  });

  const handleLanguageChange = (next: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("show-site-loader"));
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
          hidden: { y: "-100%" },
        }}
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center border-b border-transparent",
          isScrolled || isMobileMenuOpen || !isTransparentPage
            ? "bg-[#058B4F]/95 backdrop-blur-md border-[#058B4F]/10 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isProducts = item.hasDropdown;

              return (
                <div
                  key={item.href}
                  className="relative h-full flex items-center py-2"
                  onMouseEnter={isProducts ? openDropdown : undefined}
                  onMouseLeave={isProducts ? closeDropdown : undefined}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-[#FFD700] flex items-center gap-1 relative py-1",
                      isActive
                        ? "text-[#FFD700]"
                        : isTransparentPage && !isScrolled
                        ? "text-[#E0E0E0]"
                        : "text-white"
                    )}
                  >
                    {item.label}
                    {isProducts && <ChevronDown className="w-4 h-4 opacity-70" />}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD700]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "py-1.5 pl-9 pr-4 rounded-full text-xs transition-all duration-300 outline-none border focus:ring-2 focus:ring-brand-green/30 w-[160px] focus:w-[220px]",
                  isTransparentPage && !isScrolled
                    ? "bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/25 focus:border-white/40"
                    : "bg-[#046e3e] border-[#035932] text-white placeholder-[#E0E0E0] focus:bg-[#035932]"
                )}
              />
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </form>

            <div className="relative">
              <select
                value={locale}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={cn(
                  "appearance-none rounded-full outline-none border transition-all duration-200 text-center font-semibold text-xs px-5 h-9 cursor-pointer focus:ring-2 focus:ring-brand-green/30",
                  isTransparentPage && !isScrolled
                    ? "bg-white/10 border-white/20 text-white focus:bg-white/20 focus:border-white/40"
                    : "bg-[#046e3e] border-[#035932] text-white focus:bg-[#035932] focus:border-[#024627]"
                )}
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                }}
                aria-label={t("languageSelectorAriaLabel")}
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-[#058B4F] text-white text-left font-sans"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>


          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#E0E0E0] hover:text-white transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 top-20 z-40 bg-[#058B4F] overflow-y-auto px-4 py-8 flex flex-col gap-6"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 bg-[#046e3e] border border-[#035932] text-white placeholder-[#E0E0E0] rounded-full text-sm outline-none focus:ring-2 focus:ring-[#FFD700]/30"
              />
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
            </form>

            <nav className="flex flex-col gap-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                if (item.hasDropdown) {
                  return (
                    <div key={item.href} className="flex flex-col border-b border-[#046e3e]">
                      <button
                        type="button"
                        onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                        className={cn(
                          "flex items-center justify-between text-lg font-bold py-2 w-full text-left cursor-pointer transition-colors",
                          isActive ? "text-[#FFD700]" : "text-[#E0E0E0] hover:text-[#FFD700]"
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={cn("w-5 h-5 transition-transform duration-200 text-white/70", isMobileProductsOpen && "rotate-180")} />
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isMobileProductsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden flex flex-col pl-4 pb-4 gap-3 pt-2"
                          >
                            <Link
                              href="/products"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileProductsOpen(false);
                              }}
                              className="text-sm font-bold text-[#FFD700] hover:underline"
                            >
                              {locale === "zh" ? "查看全部车型 →" : "View All Models →"}
                            </Link>
                            
                            <div className="space-y-4 mt-2">
                              {/* Two-wheelers */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-extrabold tracking-wider text-white/50 uppercase">
                                  {locale === "zh" ? "两轮车" : locale === "fr" ? "Deux-roues" : "Two-wheeler"}
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                  <Link
                                    href="/products?category=standard"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsMobileProductsOpen(false);
                                    }}
                                    className="text-xs text-zinc-200 hover:text-[#FFD700]"
                                  >
                                    {locale === "zh" ? "骑士车" : "Knight"}
                                  </Link>
                                  <Link
                                    href="/products?category=street"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsMobileProductsOpen(false);
                                    }}
                                    className="text-xs text-zinc-200 hover:text-[#FFD700]"
                                  >
                                    {locale === "zh" ? "街车" : "Street"}
                                  </Link>
                                  <Link
                                    href="/products?category=offroad"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsMobileProductsOpen(false);
                                    }}
                                    className="text-xs text-zinc-200 hover:text-[#FFD700]"
                                  >
                                    {locale === "zh" ? "越野车" : locale === "fr" ? "Tout-Terrain" : "Off-Road"}
                                  </Link>
                                  <Link
                                    href="/products?category=underbone"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsMobileProductsOpen(false);
                                    }}
                                    className="text-xs text-zinc-200 hover:text-[#FFD700]"
                                  >
                                    {locale === "zh" ? "弯梁车" : "Underbone"}
                                  </Link>
                                  <Link
                                    href="/products?category=scooter"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsMobileProductsOpen(false);
                                    }}
                                    className="text-xs text-zinc-200 hover:text-[#FFD700]"
                                  >
                                    {locale === "zh" ? "踏板车" : "Scooter"}
                                  </Link>
                                </div>
                              </div>
                              
                              {/* Three-wheelers */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-extrabold tracking-wider text-white/50 uppercase">
                                  {locale === "zh" ? "三轮车" : locale === "fr" ? "Trois-roues" : "Three-wheeler"}
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                  <Link
                                    href="/products?category=tricycle&search=ZK"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsMobileProductsOpen(false);
                                    }}
                                    className="text-xs text-zinc-200 hover:text-[#FFD700]"
                                  >
                                    {locale === "zh" ? "载人三轮车" : locale === "fr" ? "Tricycle Passager" : "Passenger Tricycle"}
                                  </Link>
                                  <Link
                                    href="/products?category=tricycle&search=ZH"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsMobileProductsOpen(false);
                                    }}
                                    className="text-xs text-zinc-200 hover:text-[#FFD700]"
                                  >
                                    {locale === "zh" ? "载货三轮车" : locale === "fr" ? "Tricycle Cargo" : "Cargo Tricycle"}
                                  </Link>
                                </div>
                              </div>

                              {/* ATV */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-extrabold tracking-wider text-white/50 uppercase">
                                  {locale === "zh" ? "全地形" : locale === "fr" ? "Tout-terrain (ATV)" : "All-Terrain (ATV)"}
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                  <Link
                                    href="/products?category=atv"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsMobileProductsOpen(false);
                                    }}
                                    className="text-xs text-zinc-200 hover:text-[#FFD700]"
                                  >
                                    {locale === "zh" ? "全地形" : "ATV"}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-bold py-2 border-b border-[#046e3e] transition-colors",
                      isActive ? "text-[#FFD700]" : "text-[#E0E0E0] hover:text-[#FFD700]"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4 pt-8 border-t border-[#046e3e]">
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold block">
                Select Language
              </span>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      handleLanguageChange(opt.value);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "py-2.5 rounded-lg border text-xs font-semibold uppercase transition-all cursor-pointer",
                      locale === opt.value
                        ? "bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]"
                        : "bg-[#046e3e] border-[#035932] text-white hover:bg-[#035932]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
