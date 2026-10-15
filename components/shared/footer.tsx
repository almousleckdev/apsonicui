"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { SOCIAL_LINKS, getFooterSections, type FooterLink } from "@/lib/constants";
import { Logo } from "./logo";
import { NavLink } from "./header/NavLink";
import { useLocale } from "next-intl";
import { useSiteNavigation } from "@/hooks/useSiteNavigation";
import { toFooterColumns } from "@/lib/navigation/site";
import type { Locale } from "@/lib/page-builder/types";

// Custom inline SVG icons because trademarked social icons are excluded in this lucide-react build
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="1em"
    height="1em"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.14 2.27 1.89 3.71 2.11v3.97c-1.67-.03-3.29-.54-4.66-1.5-.23-.16-.45-.33-.66-.51v5.7c-.04 2.24-.91 4.41-2.47 6.01-1.8 1.88-4.39 2.92-7.05 2.87-2.62-.03-5.11-1.07-6.85-3.03-1.83-2.03-2.61-4.78-2.18-7.48.43-2.73 2.16-5.12 4.67-6.28 1.48-.68 3.12-.96 4.74-.82v4.03c-1.05-.17-2.14.07-2.98.75-.82.65-1.27 1.67-1.26 2.71 0 1.05.47 2.06 1.28 2.7.83.67 1.93.9 2.97.71 1.05-.2 1.93-.97 2.37-1.95.21-.49.29-1.01.27-1.54V.02h.01z" />
  </svg>
);

const SOCIAL_ICONS = [
  { name: "facebook", Icon: FacebookIcon, href: SOCIAL_LINKS.facebook },
  { name: "tiktok", Icon: TikTokIcon, href: SOCIAL_LINKS.tiktok },
  { name: "instagram", Icon: InstagramIcon, href: SOCIAL_LINKS.instagram },
  { name: "twitter", Icon: TwitterIcon, href: SOCIAL_LINKS.twitter },
  { name: "youtube", Icon: YoutubeIcon, href: SOCIAL_LINKS.youtube },
  { name: "linkedin", Icon: LinkedinIcon, href: SOCIAL_LINKS.linkedin },
];

/** A footer link; menus published in the CMS add the web-link flags. */
type FooterItem = FooterLink & { external?: boolean; newTab?: boolean };

export const Footer: React.FC = () => {
  const t = useTranslations("footer");
  const locale = useLocale() as Locale;
  const published = useSiteNavigation("footer").data;
  // A footer menu published in the CMS replaces the built-in link columns; until then the built-in ones stay.
  const footerSections: Array<{ title: string; items: FooterItem[] }> = published?.configured
    ? toFooterColumns(published.items, locale).map((column) => ({
        title: column.title,
        items: column.items.map((i) => ({ label: i.label, href: i.href ?? undefined, external: i.external, newTab: i.newTab })),
      }))
    : getFooterSections(t);

  return (
    <footer
      className="w-full text-white relative bg-zinc-950 border-t border-zinc-900"
      style={{
        backgroundImage:
          "linear-gradient(to top, rgba(9, 9, 11, 0.98), rgba(9, 9, 11, 0.9)), url('/videos/footerimage.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-zinc-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Logo showTagline={false} size="lg" className="w-fit" />
            <p className="text-zinc-400 text-xs leading-relaxed max-w-[200px]">
              High quality standard, off-road, and underbone motorcycles for West Africa.
            </p>
          </div>

          {/* Nav Sections */}
          {footerSections.map((section, idx) => {
            return (
              <div key={idx} className="flex flex-col gap-4">
                <span className="text-white text-xs font-bold uppercase tracking-wider">
                  {section.title}
                </span>
                <ul className="flex flex-col gap-2.5">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex flex-col gap-2">
                      {item.href ? (
                        <NavLink
                          href={item.href}
                          external={item.external}
                          newTab={item.newTab}
                          className="text-zinc-400 text-xs hover:text-white transition-colors block"
                        >
                          {item.label}
                        </NavLink>
                      ) : (
                        <span className="text-zinc-300 text-xs font-semibold block">
                          {item.label}
                        </span>
                      )}
                      {item.subItems && item.subItems.length > 0 && (
                        <ul className="pl-3 border-l border-zinc-800/80 flex flex-col gap-2">
                          {item.subItems.map((sub, subIdx) => (
                            <li key={subIdx}>
                              <Link
                                href={sub.href || "/products"}
                                className="text-zinc-500 text-xs hover:text-white transition-colors block"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12">
          {/* Social links */}
          <div className="flex items-center gap-3">
            {SOCIAL_ICONS.map(({ name, Icon, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 hover:scale-105 active:scale-95 transition-all duration-200"
                aria-label={name}
              >
                <Icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <span className="text-zinc-500 text-xs">
              &copy; {new Date().getFullYear()} {t("copyright")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
