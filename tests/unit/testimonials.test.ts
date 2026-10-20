import { describe, expect, it } from 'vitest';
import {
  TESTIMONIAL_LIMITS,
  addTestimonial,
  createEmptyTestimonial,
  isSafeImagePath,
  moveTestimonial,
  patchTestimonial,
  removeTestimonial,
  resolveTestimonial,
  resolveTestimonials,
  validateTestimonials,
} from '@/lib/homepage/testimonials';
import { DEFAULT_HOMEPAGE_CONFIG, type HomeTestimonialItem } from '@/lib/types/homepage';

const full: HomeTestimonialItem = {
  id: 'a',
  name: 'Kwame Mensah',
  image: '/uploads/kwame.jpg',
  roleEn: 'Logistics Entrepreneur, Ghana',
  roleFr: 'Entrepreneur en Logistique, Ghana',
  roleZh: '物流企业家，加纳',
  quoteEn: 'English quote',
  quoteFr: 'Citation française',
  quoteZh: '中文引文',
};

describe('resolveTestimonial', () => {
  it('shows the visitor language', () => {
    expect(resolveTestimonial(full, 'en')).toMatchObject({ quote: 'English quote', role: 'Logistics Entrepreneur, Ghana' });
    expect(resolveTestimonial(full, 'fr')).toMatchObject({ quote: 'Citation française', role: 'Entrepreneur en Logistique, Ghana' });
    expect(resolveTestimonial(full, 'zh')).toMatchObject({ quote: '中文引文', role: '物流企业家，加纳' });
  });

  it('falls back to English when a translation is missing or blank', () => {
    const partial = { ...full, quoteFr: '   ', roleFr: undefined };
    expect(resolveTestimonial(partial, 'fr')).toMatchObject({ quote: 'English quote', role: 'Logistics Entrepreneur, Ghana' });
  });

  it('falls back to English for an unsupported language', () => {
    expect(resolveTestimonial(full, 'de')?.quote).toBe('English quote');
  });

  it('uses another language if English is empty rather than hiding the testimonial', () => {
    expect(resolveTestimonial({ ...full, quoteEn: '' }, 'en')?.quote).toBe('Citation française');
  });

  it('hides entries that cannot be shown: no name or no quote in any language', () => {
    expect(resolveTestimonial({ ...full, name: '  ' }, 'en')).toBeNull();
    expect(resolveTestimonial({ ...full, quoteEn: '', quoteFr: '', quoteZh: '' }, 'en')).toBeNull();
  });

  it('trims text', () => {
    expect(resolveTestimonial({ ...full, name: '  Kwame  ', quoteEn: ' hi ' }, 'en')).toMatchObject({ name: 'Kwame', quote: 'hi' });
  });

  it('keeps a testimonial with no role', () => {
    expect(resolveTestimonial({ ...full, roleEn: '', roleFr: '', roleZh: '' }, 'en')?.role).toBe('');
  });
});

describe('isSafeImagePath: only site-relative paths become photos', () => {
  it.each(['/uploads/a.jpg', '/images/about/envato-labs-image-edit (1)E.png'])('accepts %s', (p) => expect(isSafeImagePath(p)).toBe(true));
  it.each(['', '   ', 'https://evil.example/x.jpg', '//evil.example/x.jpg', 'javascript:alert(1)', 'data:image/png;base64,AAAA', '/uploads/../../etc/passwd', '/a"onerror="x'])(
    'rejects %s',
    (p) => expect(isSafeImagePath(p)).toBe(false)
  );

  it('an unsafe photo does not hide the testimonial; the photo is just dropped', () => {
    expect(resolveTestimonial({ ...full, image: 'https://evil.example/x.jpg' }, 'en')).toMatchObject({ image: '', name: 'Kwame Mensah' });
  });
});

describe('resolveTestimonials', () => {
  it('drops unusable entries, keeps order, tolerates undefined', () => {
    const list = [full, { ...full, id: 'b', name: '' }, { ...full, id: 'c' }];
    expect(resolveTestimonials(list, 'en').map((t) => t.id)).toEqual(['a', 'c']);
    expect(resolveTestimonials(undefined, 'en')).toEqual([]);
  });
});

describe('validateTestimonials', () => {
  it('accepts a complete entry and the shipped defaults', () => {
    expect(validateTestimonials([full])).toEqual({});
    expect(validateTestimonials(DEFAULT_HOMEPAGE_CONFIG.testimonials)).toEqual({});
  });

  it('requires a name and an English quote', () => {
    const errors = validateTestimonials([createEmptyTestimonial()]);
    const only = Object.values(errors)[0];
    expect(only.name).toBeDefined();
    expect(only.quoteEn).toBeDefined();
  });

  it('enforces length limits per language', () => {
    const long = 'x'.repeat(TESTIMONIAL_LIMITS.quote + 1);
    const errors = validateTestimonials([{ ...full, quoteFr: long, roleZh: 'y'.repeat(TESTIMONIAL_LIMITS.role + 1), name: 'n'.repeat(TESTIMONIAL_LIMITS.name + 1) }])['a'];
    expect(errors.quoteFr).toBeDefined();
    expect(errors.roleZh).toBeDefined();
    expect(errors.name).toBeDefined();
    expect(errors.quoteEn).toBeUndefined();
  });

  it('rejects a photo that is not an uploaded, site-relative path', () => {
    expect(validateTestimonials([{ ...full, image: 'https://evil.example/x.jpg' }])['a'].image).toBeDefined();
    expect(validateTestimonials([{ ...full, image: '' }])).toEqual({}); // no photo is allowed
  });

  it('reports each problem entry by id', () => {
    const result = validateTestimonials([full, { ...full, id: 'bad', name: '' }]);
    expect(Object.keys(result)).toEqual(['bad']);
  });
});

describe('createEmptyTestimonial', () => {
  it('creates unique ids', () => {
    expect(createEmptyTestimonial().id).not.toBe(createEmptyTestimonial().id);
  });
});

describe('defaults', () => {
  it('ship the two testimonials that used to be hardcoded, in all three languages', () => {
    const items = DEFAULT_HOMEPAGE_CONFIG.testimonials;
    expect(items).toHaveLength(2);
    for (const item of items) {
      for (const locale of ['en', 'fr', 'zh']) {
        const r = resolveTestimonial(item, locale);
        expect(r?.quote).toBeTruthy();
        expect(r?.role).toBeTruthy();
        expect(r?.image).toMatch(/^\//);
      }
    }
  });
});

describe('list edits address rows by id and use the latest list', () => {
  const a: HomeTestimonialItem = { ...createEmptyTestimonial(), id: 'a', name: 'A', quoteEn: 'qa' };
  const b: HomeTestimonialItem = { ...createEmptyTestimonial(), id: 'b', name: 'B', quoteEn: 'qb' };
  const c: HomeTestimonialItem = { ...createEmptyTestimonial(), id: 'c', name: 'C', quoteEn: 'qc' };

  it('a late photo update keeps text typed in the meantime, even after a reorder', async () => {
    // A photo upload starts for row "b" ...
    let list = [a, b, c];
    // ... the admin keeps editing and moves the row while it uploads ...
    list = patchTestimonial(list, 'b', { quoteEn: 'typed while uploading' });
    list = moveTestimonial(list, 'b', -1);
    // ... then the upload finishes and is applied to the CURRENT list, by id.
    list = patchTestimonial(list, 'b', { image: '/uploads/new.png' });
    expect(list.map((t) => t.id)).toEqual(['b', 'a', 'c']);
    expect(list[0]).toMatchObject({ quoteEn: 'typed while uploading', image: '/uploads/new.png' });
  });

  it('a late update for a row that was removed is ignored', () => {
    const list = patchTestimonial(removeTestimonial([a, b], 'b'), 'b', { image: '/uploads/x.png' });
    expect(list).toEqual([a]);
  });

  it('move stays inside the list and never mutates the input', () => {
    const original = [a, b, c];
    expect(moveTestimonial(original, 'a', -1)).toBe(original);
    expect(moveTestimonial(original, 'c', 1)).toBe(original);
    expect(moveTestimonial(original, 'a', 1).map((t) => t.id)).toEqual(['b', 'a', 'c']);
    expect(original.map((t) => t.id)).toEqual(['a', 'b', 'c']);
  });

  it('adds up to the limit and no further', () => {
    let list: HomeTestimonialItem[] = [];
    for (let i = 0; i < TESTIMONIAL_LIMITS.maxItems + 3; i++) list = addTestimonial(list);
    expect(list).toHaveLength(TESTIMONIAL_LIMITS.maxItems);
    expect(new Set(list.map((t) => t.id)).size).toBe(TESTIMONIAL_LIMITS.maxItems);
  });
});
