'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';
import { localized } from '@/lib/page-builder/document';
import type { Locale, PageSection, SectionStyle } from '@/lib/page-builder/types';

/** Everything a section renderer needs besides its own content. */
export interface RenderContext {
  locale: Locale;
  /** True inside the builder: empty sections show a hint instead of nothing. */
  editing: boolean;
}

export interface SectionProps {
  section: PageSection;
  ctx: RenderContext;
}

/** Text of a translated content field in the visitor's language (English when missing). */
export const text = (content: Record<string, unknown>, key: string, locale: Locale): string => localized(content[key], locale);
export const str = (content: Record<string, unknown>, key: string): string => (typeof content[key] === 'string' ? (content[key] as string) : '');
export const num = (content: Record<string, unknown>, key: string, fallback: number): number =>
  typeof content[key] === 'number' ? (content[key] as number) : fallback;
export const list = (content: Record<string, unknown>, key: string): Array<Record<string, unknown>> =>
  Array.isArray(content[key]) ? (content[key] as Array<Record<string, unknown>>) : [];

const BACKGROUNDS: Record<NonNullable<SectionStyle['background']>, string> = {
  white: 'bg-white text-zinc-900',
  light: 'bg-zinc-50 text-zinc-900',
  dark: 'bg-zinc-950 text-white',
  brand: 'bg-brand-green text-white',
};
const PAD_TOP: Record<NonNullable<SectionStyle['paddingTop']>, string> = {
  none: 'pt-0', sm: 'pt-8', md: 'pt-14 sm:pt-16', lg: 'pt-20 sm:pt-24', xl: 'pt-28 sm:pt-32',
};
const PAD_BOTTOM: Record<NonNullable<SectionStyle['paddingBottom']>, string> = {
  none: 'pb-0', sm: 'pb-8', md: 'pb-14 sm:pb-16', lg: 'pb-20 sm:pb-24', xl: 'pb-28 sm:pb-32',
};
const WIDTHS: Record<NonNullable<SectionStyle['width']>, string> = {
  narrow: 'max-w-3xl', normal: 'max-w-6xl', wide: 'max-w-[1360px]',
};

export const isDark = (style: SectionStyle): boolean => style.background === 'dark' || style.background === 'brand';

/** Background, spacing and content width for a section; every value comes from a closed list in the section style. */
export function SectionShell({ section, children, className }: { section: PageSection; children: React.ReactNode; className?: string }) {
  const s = section.style;
  return (
    <section className={cn(BACKGROUNDS[s.background ?? 'white'], PAD_TOP[s.paddingTop ?? 'md'], PAD_BOTTOM[s.paddingBottom ?? 'md'])}>
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', WIDTHS[s.width ?? 'normal'], className)}>{children}</div>
    </section>
  );
}

/** Eyebrow, heading and introduction used by most sections. */
export function SectionHeading({
  eyebrow, title, intro, dark, align = 'center', className,
}: { eyebrow?: string; title?: string; intro?: string; dark?: boolean; align?: 'left' | 'center'; className?: string }) {
  if (!eyebrow && !title && !intro) return null;
  return (
    <div className={cn('mb-10 sm:mb-14', align === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-left', className)}>
      {eyebrow && (
        <span className={cn('font-extrabold text-xs uppercase tracking-[0.25em]', dark ? 'text-white/80' : 'text-brand-green')}>{eyebrow}</span>
      )}
      {title && <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight text-balance">{title}</h2>}
      {intro && <p className={cn('mt-4 text-base sm:text-lg leading-relaxed', dark ? 'text-white/80' : 'text-zinc-600')}>{intro}</p>}
    </div>
  );
}

/** Internal paths keep the visitor's language prefix; everything else is a plain anchor. */
export function CmsLink({ href, className, children, newTab }: { href: string; className?: string; children: React.ReactNode; newTab?: boolean }) {
  if (href.startsWith('/') && !href.startsWith('//')) {
    return <Link href={href} className={className}>{children}</Link>;
  }
  const external = /^https?:\/\//i.test(href);
  return (
    <a href={href} className={className} {...(external || newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  );
}

export const BUTTON_PRIMARY = 'inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-green-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';
export const BUTTON_SECONDARY_LIGHT = 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/70 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-zinc-900';
export const BUTTON_SECONDARY_DARK = 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-zinc-300 px-7 py-3 text-sm font-bold uppercase tracking-wide text-zinc-800 transition-colors hover:border-brand-green hover:text-brand-green';

export const isVideoUrl = (value: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(value);

/** CMS media: any validated image address. `unoptimized` keeps arbitrary hosts working without extra config. */
export function CmsImage({ src, alt, className, priority, sizes = '100vw' }: { src: string; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized priority={priority} className={className} />;
}

/** Shown in the builder where a section has no content yet. */
export function EmptyHint({ editing, children }: { editing: boolean; children: React.ReactNode }) {
  if (!editing) return null;
  return (
    <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 px-6 py-10 text-center text-sm font-medium text-zinc-500">
      {children}
    </div>
  );
}
