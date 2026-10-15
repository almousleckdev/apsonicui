/** Colors in the page builder are always #rrggbb: the backend refuses anything else, and so does the renderer. */
const HEX = /^#[0-9a-f]{6}$/i;

/** The value itself when it is a valid #rrggbb color, otherwise undefined (never passes anything else to CSS). */
export function safeColor(value: unknown): string | undefined {
  return typeof value === 'string' && HEX.test(value) ? value.toLowerCase() : undefined;
}

function channel(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function luminance(hex: string): number {
  const c = safeColor(hex);
  if (!c) return 1;
  const r = parseInt(c.slice(1, 3), 16);
  const g = parseInt(c.slice(3, 5), 16);
  const b = parseInt(c.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** True when white text reads better than dark text on this background. */
export function isDarkColor(hex: string): boolean {
  return contrastRatio(hex, '#ffffff') >= contrastRatio(hex, '#18181b');
}

/** Whichever of white or near-black is easier to read on the given background. */
export function readableText(background: string): string {
  return isDarkColor(background) ? '#ffffff' : '#18181b';
}

/** The Apsonic palette offered next to the free color picker. */
export const PALETTE: Array<{ name: string; hex: string }> = [
  { name: 'Apsonic green', hex: '#00a651' },
  { name: 'Deep green', hex: '#058b4f' },
  { name: 'Dark green', hex: '#035932' },
  { name: 'Gold', hex: '#ffd700' },
  { name: 'Black', hex: '#09090b' },
  { name: 'Charcoal', hex: '#27272a' },
  { name: 'Grey', hex: '#71717a' },
  { name: 'Light grey', hex: '#f4f4f5' },
  { name: 'White', hex: '#ffffff' },
];

/** rgba() string for a #rrggbb color; used for gradients over pictures. */
export function colorWithAlpha(hex: string, alpha: number): string {
  const c = safeColor(hex) ?? '#000000';
  const a = Math.min(1, Math.max(0, alpha));
  return `rgba(${parseInt(c.slice(1, 3), 16)}, ${parseInt(c.slice(3, 5), 16)}, ${parseInt(c.slice(5, 7), 16)}, ${a})`;
}
