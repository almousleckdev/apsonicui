import type { CSSProperties } from 'react';
import { isDarkColor, readableText, safeColor } from './colors';
import type { SectionSize, SectionStyle } from './types';

/**
 * Turns a section's style object into what the renderer needs. Every value is mapped through a closed list or a
 * validated #rrggbb color, so nothing authored in the CMS can reach CSS as free text.
 */

export const BACKGROUND_CLASSES = { white: 'bg-white', light: 'bg-zinc-50', dark: 'bg-zinc-950', brand: 'bg-brand-green' } as const;
export const PAD_TOP: Record<SectionSize, string> = { none: 'pt-0', sm: 'pt-8', md: 'pt-14 sm:pt-16', lg: 'pt-20 sm:pt-24', xl: 'pt-28 sm:pt-32' };
export const PAD_BOTTOM: Record<SectionSize, string> = { none: 'pb-0', sm: 'pb-8', md: 'pb-14 sm:pb-16', lg: 'pb-20 sm:pb-24', xl: 'pb-28 sm:pb-32' };
export const WIDTHS = { narrow: 'max-w-3xl', normal: 'max-w-6xl', wide: 'max-w-[1360px]' } as const;
export const SHOW_ON = { all: '', desktop: 'hidden md:block', mobile: 'md:hidden' } as const;

const POSITIONS: Record<string, string> = {
  center: 'center', top: 'center top', bottom: 'center bottom', left: 'left center', right: 'right center',
  'top-left': 'left top', 'top-right': 'right top', 'bottom-left': 'left bottom', 'bottom-right': 'right bottom',
};
export const cssPosition = (value: unknown): string => POSITIONS[String(value)] ?? 'center';
export const cssSize = (value: unknown): 'cover' | 'contain' | 'auto' => (value === 'contain' || value === 'auto' ? value : 'cover');

export interface ResolvedStyle {
  /** Preset background class (empty for a custom color). */
  backgroundClass: string;
  backgroundColor?: string;
  /** True when the background is dark, so text and cards should be light. */
  dark: boolean;
  /** An explicit text color chosen by the editor, if any. */
  textColor?: string;
  accentColor?: string;
  backgroundImage?: { url: string; size: 'cover' | 'contain' | 'auto'; position: string; fixed: boolean; overlayColor: string; overlay: number };
  buttonColor?: string;
  buttonTextColor?: string;
  buttonShape: 'pill' | 'rounded' | 'square';
  padTop: string;
  padBottom: string;
  width: string;
  showOn: string;
  /** CSS custom properties read by the .pb-* utility classes in globals.css. */
  vars: CSSProperties;
}

export function resolveStyle(style: SectionStyle | undefined): ResolvedStyle {
  const s = style ?? {};
  const custom = s.background === 'custom' ? safeColor(s.backgroundColor) : undefined;
  const preset = s.background && s.background !== 'custom' && s.background in BACKGROUND_CLASSES ? s.background : 'white';
  const textColor = safeColor(s.textColor);
  const accentColor = safeColor(s.accentColor);
  const buttonColor = safeColor(s.buttonColor);
  const buttonTextColor = safeColor(s.buttonTextColor);
  const url = typeof s.backgroundImage === 'string' && s.backgroundImage ? s.backgroundImage : undefined;

  const vars: Record<string, string> = {};
  if (textColor) vars['--pb-text'] = textColor;
  if (accentColor) vars['--pb-accent'] = accentColor;

  return {
    backgroundClass: custom ? '' : BACKGROUND_CLASSES[preset as keyof typeof BACKGROUND_CLASSES],
    backgroundColor: custom,
    dark: custom ? isDarkColor(custom) : preset === 'dark' || preset === 'brand',
    textColor,
    accentColor,
    backgroundImage: url ? {
      url,
      size: cssSize(s.backgroundSize),
      position: cssPosition(s.backgroundPosition),
      fixed: s.backgroundFixed === true,
      overlayColor: safeColor(s.backgroundOverlayColor) ?? '#000000',
      overlay: clamp(Number(s.backgroundOverlay ?? 0), 0, 90),
    } : undefined,
    buttonColor,
    buttonTextColor,
    buttonShape: s.buttonShape === 'rounded' || s.buttonShape === 'square' ? s.buttonShape : 'pill',
    padTop: PAD_TOP[(s.paddingTop as SectionSize) in PAD_TOP ? (s.paddingTop as SectionSize) : 'md'],
    padBottom: PAD_BOTTOM[(s.paddingBottom as SectionSize) in PAD_BOTTOM ? (s.paddingBottom as SectionSize) : 'md'],
    width: WIDTHS[(s.width as keyof typeof WIDTHS) in WIDTHS ? (s.width as keyof typeof WIDTHS) : 'normal'],
    showOn: SHOW_ON[(s.showOn as keyof typeof SHOW_ON) in SHOW_ON ? (s.showOn as keyof typeof SHOW_ON) : 'all'],
    vars: vars as CSSProperties,
  };
}

export function clamp(n: number, min: number, max: number): number {
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}

const RADIUS = { pill: 'rounded-full', rounded: 'rounded-xl', square: 'rounded-none' } as const;

export interface ButtonSpec {
  variant?: unknown;
  color?: unknown;
  textColor?: unknown;
}

/**
 * Classes and inline style for one button. Colors come from the button itself, then from the section's button
 * settings, then from the Apsonic defaults (green, or white/dark on tinted backgrounds for the outline style).
 */
export function resolveButton(resolved: Pick<ResolvedStyle, 'buttonColor' | 'buttonTextColor' | 'buttonShape' | 'dark'>, spec: ButtonSpec = {}, onImage = false): { className: string; style: CSSProperties } {
  const color = safeColor(spec.color) ?? resolved.buttonColor;
  const text = safeColor(spec.textColor) ?? resolved.buttonTextColor;
  const outline = spec.variant === 'secondary';
  const onDark = resolved.dark || onImage;
  const base = 'pb-btn inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold uppercase tracking-wide transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';
  const className = `${base} ${RADIUS[resolved.buttonShape]}`;
  if (outline) {
    const edge = color ?? (onDark ? '#ffffff' : '#27272a');
    return { className, style: { border: `2px solid ${edge}`, color: text ?? edge, background: 'transparent' } };
  }
  // The Apsonic default is green with white text, as everywhere else on the site; a color the editor chooses gets
  // whichever of white or dark text reads better on it.
  if (!color) return { className, style: { background: '#00a651', color: text ?? '#ffffff' } };
  return { className, style: { background: color, color: text ?? readableText(color) } };
}
