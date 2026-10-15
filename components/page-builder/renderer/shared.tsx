'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';
import { localized } from '@/lib/page-builder/document';
import { colorWithAlpha, readableText, safeColor } from '@/lib/page-builder/colors';
import { resolveButton, resolveStyle, type ResolvedStyle } from '@/lib/page-builder/style';
import type { Locale, PageSection } from '@/lib/page-builder/types';

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
export const bool = (content: Record<string, unknown>, key: string, fallback: boolean): boolean =>
  typeof content[key] === 'boolean' ? (content[key] as boolean) : fallback;
export const list = (content: Record<string, unknown>, key: string): Array<Record<string, unknown>> =>
  Array.isArray(content[key]) ? (content[key] as Array<Record<string, unknown>>) : [];
/** A choice from a closed list, falling back to the first option when missing or unknown. */
export function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export const isDark = (style: PageSection['style']): boolean => resolveStyle(style).dark;
export const isVideoUrl = (value: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(value);

/** Classes and inline style that put a section's chosen colors and visibility on its outer element. */
export function styleProps(r: ResolvedStyle): { className: string; style: React.CSSProperties } {
  return {
    className: cn(r.backgroundClass, r.showOn, r.textColor ? 'pb-text' : r.dark ? 'text-white' : 'text-zinc-900'),
    style: { ...(r.backgroundColor ? { backgroundColor: r.backgroundColor } : {}), ...r.vars },
  };
}

/** A card (or panel) color with text that stays readable on it. */
export function cardProps(color: unknown): { className?: string; style?: React.CSSProperties } {
  const c = safeColor(color);
  return c ? { className: 'pb-text', style: { background: c, ['--pb-text' as string]: readableText(c) } as React.CSSProperties } : {};
}

/** A picture filling its container. Always an <img>, never a CSS url(), so an address can never leave its attribute. */
export function CoverImage({ src, alt = '', size = 'cover', position = 'center', fixed = false, priority = false, sizes = '100vw', className }: {
  src: string; alt?: string; size?: 'cover' | 'contain' | 'auto'; position?: string; fixed?: boolean; priority?: boolean; sizes?: string; className?: string;
}) {
  const fit = size === 'auto' ? 'none' : size;
  if (fixed) {
    // The picture stays put while the page scrolls: a viewport-sized image clipped to its section.
    return (
      <div className={cn('absolute inset-0 [clip-path:inset(0)]', className)} aria-hidden={!alt}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ position: 'fixed', inset: 0, width: '100%', height: '100vh', objectFit: fit, objectPosition: position }} />
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized priority={priority} className={className} style={{ objectFit: fit, objectPosition: position }} />;
}

/** A tint over a picture or color. {@code mode} "solid" is even; "bottom"/"top" fade toward that edge. */
export function Overlay({ color, strength, mode = 'solid' }: { color?: string; strength: number; mode?: 'solid' | 'bottom' | 'top' }) {
  if (strength <= 0) return null;
  const c = safeColor(color) ?? '#000000';
  const a = strength / 100;
  const style: React.CSSProperties = mode === 'solid'
    ? { background: c, opacity: a }
    : { background: `linear-gradient(to ${mode === 'bottom' ? 'top' : 'bottom'}, ${colorWithAlpha(c, a)} 0%, ${colorWithAlpha(c, a * 0.15)} 100%)` };
  return <div className="absolute inset-0" style={style} aria-hidden />;
}

/**
 * Background, spacing, width, optional picture with tint, and the section's colors. Every value comes from a closed
 * list or a validated color in the section style.
 */
export function SectionShell({ section, children, className }: { section: PageSection; children: React.ReactNode; className?: string }) {
  const r = resolveStyle(section.style);
  const own = styleProps(r);
  const image = r.backgroundImage;
  return (
    <section className={cn('relative isolate', own.className, r.padTop, r.padBottom)} style={own.style}>
      {image && (
        <>
          <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
            <CoverImage src={image.url} size={image.size} position={image.position} fixed={image.fixed} />
          </div>
          <div className="absolute inset-0 -z-10" aria-hidden><Overlay color={image.overlayColor} strength={image.overlay} /></div>
        </>
      )}
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', r.width, className)}>{children}</div>
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
      {eyebrow && <span className="pb-accent text-xs font-extrabold uppercase tracking-[0.25em]">{eyebrow}</span>}
      {title && <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight text-balance">{title}</h2>}
      {intro && <p className={cn('mt-4 text-base sm:text-lg leading-relaxed', dark ? 'text-white/80' : 'text-zinc-600')}>{intro}</p>}
    </div>
  );
}

/** Internal paths keep the visitor's language prefix; everything else is a plain anchor. */
export function CmsLink({ href, className, style, children, newTab }: { href: string; className?: string; style?: React.CSSProperties; children: React.ReactNode; newTab?: boolean }) {
  if (href.startsWith('/') && !href.startsWith('//')) {
    return <Link href={href} className={className} style={style} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</Link>;
  }
  const external = /^https?:\/\//i.test(href);
  return (
    <a href={href} className={className} style={style} {...(external || newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  );
}

/** The buttons of a section, each with its own colors, falling back to the section's button settings. */
export function Buttons({ items, section, ctx, onImage, className }: {
  items: Array<Record<string, unknown>>; section: PageSection; ctx: RenderContext; onImage?: boolean; className?: string;
}) {
  const r = resolveStyle(section.style);
  const shown = items.filter((b) => text(b, 'label', ctx.locale) && str(b, 'url'));
  if (shown.length === 0) return null;
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {shown.map((b, i) => {
        const btn = resolveButton(r, { variant: b.variant, color: b.color, textColor: b.textColor }, onImage);
        return <CmsLink key={i} href={str(b, 'url')} className={btn.className} style={btn.style} newTab={b.newTab === true}>{text(b, 'label', ctx.locale)}</CmsLink>;
      })}
    </div>
  );
}

/**
 * The buttons of a section. Content saved before buttons became a list kept a single label and link
 * (buttonLabel/buttonUrl, ctaLabel/ctaUrl); those still show until the section is next saved.
 */
export function buttonsOf(content: Record<string, unknown>): Array<Record<string, unknown>> {
  const buttons = list(content, 'ctas');
  if (buttons.length > 0) return buttons;
  for (const [label, url] of [['buttonLabel', 'buttonUrl'], ['ctaLabel', 'ctaUrl']] as const) {
    if (typeof content[url] === 'string' && content[url]) return [{ label: content[label], url: content[url], variant: 'primary' }];
  }
  return [];
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

/** Backwards-compatible alias for sections that still import the old name. */
export const CmsImage = CoverImage;
