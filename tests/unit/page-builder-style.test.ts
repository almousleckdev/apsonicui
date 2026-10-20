import { describe, expect, it } from 'vitest';
import { contrastRatio, isDarkColor, luminance, PALETTE, readableText, safeColor } from '@/lib/page-builder/colors';
import { clamp, cssPosition, cssSize, resolveButton, resolveStyle, textStyle } from '@/lib/page-builder/style';

describe('safeColor', () => {
  it('accepts #rrggbb and normalises to lower case', () => {
    expect(safeColor('#00A651')).toBe('#00a651');
    expect(safeColor('#ffffff')).toBe('#ffffff');
  });

  it('rejects anything that could be CSS rather than a color', () => {
    for (const bad of ['red', '#fff', '#12345', '#1234567', 'rgb(0,0,0)', 'url(//evil.example)', '#00a651;background:red',
      'expression(alert(1))', 'javascript:x', '0a5c3b', '', undefined, null, 5, {}]) {
      expect(safeColor(bad as never)).toBeUndefined();
    }
  });
});

describe('contrast', () => {
  it('knows black from white', () => {
    expect(luminance('#000000')).toBeCloseTo(0, 3);
    expect(luminance('#ffffff')).toBeCloseTo(1, 3);
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('picks readable text for the Apsonic palette', () => {
    expect(readableText('#ffffff')).toBe('#18181b');
    expect(readableText('#f4f4f5')).toBe('#18181b');
    expect(readableText('#ffd700')).toBe('#18181b');
    expect(readableText('#09090b')).toBe('#ffffff');
    expect(readableText('#035932')).toBe('#ffffff');
    expect(isDarkColor('#09090b')).toBe(true);
    expect(isDarkColor('#f4f4f5')).toBe(false);
    // Always the better of the two options, even for mid-tone greens where neither reaches 4.5:1.
    for (const { hex } of PALETTE) {
      const chosen = readableText(hex);
      const other = chosen === '#ffffff' ? '#18181b' : '#ffffff';
      expect(contrastRatio(hex, chosen)).toBeGreaterThanOrEqual(contrastRatio(hex, other));
    }
  });
});

describe('resolveStyle', () => {
  it('maps presets and falls back to safe defaults', () => {
    expect(resolveStyle({}).backgroundClass).toBe('bg-white');
    expect(resolveStyle({ background: 'dark' })).toMatchObject({ backgroundClass: 'bg-zinc-950', dark: true });
    expect(resolveStyle({ background: 'brand' }).dark).toBe(true);
    expect(resolveStyle({ background: 'whatever' as never }).backgroundClass).toBe('bg-white');
    expect(resolveStyle(undefined).width).toContain('max-w');
  });

  it('uses a custom color only when chosen and valid, and decides light/dark from it', () => {
    const dark = resolveStyle({ background: 'custom', backgroundColor: '#0A5C3B' });
    expect(dark).toMatchObject({ backgroundColor: '#0a5c3b', backgroundClass: '', dark: true });
    expect(resolveStyle({ background: 'custom', backgroundColor: '#fafafa' }).dark).toBe(false);
    expect(resolveStyle({ background: 'custom', backgroundColor: 'red; x:y' }).backgroundColor).toBeUndefined();
    // A leftover color is ignored while a preset is selected.
    expect(resolveStyle({ background: 'white', backgroundColor: '#000000' }).backgroundColor).toBeUndefined();
  });

  it('exposes text and accent colors only as validated custom properties', () => {
    const r = resolveStyle({ textColor: '#112233', accentColor: '#FFD700' });
    expect(r.vars).toEqual({ '--pb-text': '#112233', '--pb-accent': '#ffd700' });
    expect(resolveStyle({ textColor: 'url(x)' }).vars).toEqual({});
  });

  it('describes a background picture with bounded values', () => {
    const r = resolveStyle({ backgroundImage: '/uploads/a.jpg', backgroundSize: 'contain', backgroundPosition: 'top-left', backgroundFixed: true, backgroundOverlayColor: '#102030', backgroundOverlay: 500 });
    expect(r.backgroundImage).toEqual({ url: '/uploads/a.jpg', size: 'contain', position: 'left top', fixed: true, overlayColor: '#102030', overlay: 90 });
    expect(resolveStyle({}).backgroundImage).toBeUndefined();
    expect(resolveStyle({ backgroundImage: '/x.jpg', backgroundPosition: '41% 12px', backgroundSize: 'calc(1)' as never }).backgroundImage).toMatchObject({ position: 'center', size: 'cover' });
  });

  it('keeps spacing and visibility within the closed lists', () => {
    expect(resolveStyle({ paddingTop: 'none', paddingBottom: 'xl' })).toMatchObject({ padTop: 'pt-0' });
    expect(resolveStyle({ paddingTop: 'huge' as never }).padTop).toContain('pt-');
    expect(resolveStyle({ showOn: 'mobile' }).showOn).toBe('md:hidden');
    expect(resolveStyle({ showOn: 'desktop' }).showOn).toBe('hidden md:block');
    expect(resolveStyle({ showOn: 'x' as never }).showOn).toBe('');
  });
});

describe('helpers', () => {
  it('clamps and maps picture settings', () => {
    expect(clamp(120, 0, 90)).toBe(90);
    expect(clamp(-5, 0, 90)).toBe(0);
    expect(clamp(NaN, 0, 90)).toBe(0);
    expect(cssPosition('bottom-right')).toBe('right bottom');
    expect(cssPosition('nonsense')).toBe('center');
    expect(cssSize('auto')).toBe('auto');
    expect(cssSize('x')).toBe('cover');
  });
});

describe('resolveButton', () => {
  const plain = resolveStyle({});
  it('defaults to a solid Apsonic green pill with readable text', () => {
    const b = resolveButton(plain);
    expect(b.style).toEqual({ background: '#00a651', color: '#ffffff' });
    // A green the editor picks themselves gets whichever text reads best.
    expect(resolveButton(resolveStyle({ buttonColor: '#00a651' })).style).toEqual({ background: '#00a651', color: '#18181b' });
    expect(b.className).toContain('rounded-full');
  });

  it('uses the section button colors, then the button\'s own', () => {
    const section = resolveStyle({ buttonColor: '#FFD700', buttonShape: 'square' });
    expect(resolveButton(section).style).toEqual({ background: '#ffd700', color: '#18181b' });
    expect(resolveButton(section).className).toContain('rounded-none');
    expect(resolveButton(section, { color: '#09090b', textColor: '#ffd700' }).style).toEqual({ background: '#09090b', color: '#ffd700' });
    expect(resolveButton(section, { color: 'red' }).style.background).toBe('#ffd700');
  });

  it('draws the outline style in a color that works on dark or light backgrounds', () => {
    expect(resolveButton(resolveStyle({ background: 'dark' }), { variant: 'secondary' }).style).toMatchObject({ border: '2px solid #ffffff', color: '#ffffff', background: 'transparent' });
    expect(resolveButton(plain, { variant: 'secondary' }).style).toMatchObject({ border: '2px solid #27272a' });
    expect(resolveButton(plain, { variant: 'secondary' }, true).style).toMatchObject({ border: '2px solid #ffffff' });
    expect(resolveButton(plain, { variant: 'secondary', color: '#00a651' }).style).toMatchObject({ border: '2px solid #00a651', color: '#00a651' });
  });
});

describe('text styles', () => {
  it('adds nothing at the default size, so existing sections look the same', () => {
    const t = textStyle(resolveStyle({}), 'heading', 'h2');
    expect(t.className).toBe('pb-t');
    expect(t.style).toEqual({});
  });

  it('scales from the base size of where the text sits and clamps absurd values', () => {
    const big = textStyle(resolveStyle({ headingSize: 150 }), 'heading', 'h1');
    expect(big.className).toContain('pb-base-h1');
    expect((big.style as Record<string, unknown>)['--pb-scale']).toBe(1.5);
    const huge = textStyle(resolveStyle({ headingSize: 9000 }), 'heading', 'h2');
    expect((huge.style as Record<string, unknown>)['--pb-scale']).toBe(3);
  });

  it('uses the text own color before the section text color, and ignores anything that is not a hex color', () => {
    const r = resolveStyle({ textColor: '#111111', headingColor: '#ff0000', subheadingColor: 'red; background:url(x)' });
    expect(textStyle(r, 'heading', 'h2').style.color).toBe('#ff0000');
    expect(textStyle(r, 'subheading', 'sub').style.color).toBe('#111111');
  });

  it('keeps the accent color for the small label unless it has its own', () => {
    expect(textStyle(resolveStyle({ textColor: '#111111' }), 'eyebrow', 'eyebrow').style.color).toBeUndefined();
    expect(textStyle(resolveStyle({ eyebrowColor: '#00a651' }), 'eyebrow', 'eyebrow').style.color).toBe('#00a651');
  });

  it('maps font names to bundled stacks and never passes unknown names through', () => {
    expect(textStyle(resolveStyle({ headingFont: 'serif' }), 'heading', 'h2').style.fontFamily).toContain('--font-playfair');
    expect(textStyle(resolveStyle({ headingFont: 'default' }), 'heading', 'h2').style.fontFamily).toBeUndefined();
    expect(() => textStyle(resolveStyle({ headingFont: 'evil' as never }), 'heading', 'h2')).not.toThrow();
  });
});
