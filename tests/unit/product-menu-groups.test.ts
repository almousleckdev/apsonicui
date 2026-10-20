import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRODUCT_MENU_GROUPS,
  groupIdForCategory,
  groupLabel,
  moveGroup,
  partitionByGroup,
  removeGroup,
  sanitizeGroups,
  uniqueGroupId,
  upsertGroup,
  validateGroup,
  validateGroups,
} from '@/lib/product-menu/groups';

const g = (id: string, labelEn = id, image = '/uploads/x.png') => ({ id, labelEn, labelFr: '', labelZh: '', image });

describe('product menu groups', () => {
  it('ships the three original groups, each with a picture', () => {
    expect(DEFAULT_PRODUCT_MENU_GROUPS.map((x) => x.id)).toEqual(['two-wheeler', 'three-wheeler', 'atv']);
    for (const group of DEFAULT_PRODUCT_MENU_GROUPS) expect(group.image).toMatch(/^\/categories\//);
  });

  it('falls back to English, then to any language, then to the id', () => {
    expect(groupLabel({ ...g('a'), labelEn: 'E', labelFr: 'F', labelZh: 'Z' }, 'fr')).toBe('F');
    expect(groupLabel({ ...g('a'), labelEn: 'E' }, 'zh')).toBe('E');
    expect(groupLabel({ ...g('a'), labelEn: '', labelZh: '中' }, 'en')).toBe('中');
    expect(groupLabel({ ...g('a'), labelEn: '' }, 'en')).toBe('a');
  });

  describe('sanitizeGroups (value read from the server)', () => {
    it('drops corrupt entries instead of breaking the menu', () => {
      const result = sanitizeGroups([g('ok'), g('ok'), g('Bad Id'), { id: 'x' }, null, 'str', g('second')]);
      expect(result.map((x) => x.id)).toEqual(['ok', 'second']);
      expect(sanitizeGroups('nope')).toEqual([]);
    });

    it('gives menus saved before pictures existed the built-in picture, and unknown groups none', () => {
      const [known, custom] = sanitizeGroups([
        { id: 'atv', labelEn: 'ATV' },
        { id: 'quad', labelEn: 'Quad' },
      ]);
      expect(known.image).toBe(DEFAULT_PRODUCT_MENU_GROUPS[2].image);
      expect(custom.image).toBe('');
    });

    it('never lets an unsafe picture address through', () => {
      const [item] = sanitizeGroups([{ ...g('a'), image: 'javascript:alert(1)' }, ]);
      expect(item.image).toBe('');
      expect(sanitizeGroups([{ ...g('b'), image: '//evil.example/x.png' }])[0].image).toBe('');
    });
  });

  describe('validateGroup (one group in the admin form)', () => {
    it('requires an English name and a picture', () => {
      expect(validateGroup(g('a', '', '')).map((p) => p.key)).toEqual(['categories.problems.needEnglishName', 'categories.problems.needPicture']);
      expect(validateGroup(g('a'))).toEqual([]);
    });
    it('rejects a picture that is not a site path', () => {
      expect(validateGroup(g('a', 'A', 'https://evil.example/x.png')).map((p) => p.key)).toEqual(['categories.problems.pictureNotUploaded']);
    });
    it('limits name length in every language', () => {
      expect(validateGroup({ ...g('a'), labelZh: 'x'.repeat(41) })).toHaveLength(1);
    });
  });

  it('validates the list: not empty, unique valid ids, size limit', () => {
    expect(validateGroups([])).not.toHaveLength(0);
    expect(validateGroups([g('a'), g('a')])).not.toHaveLength(0);
    expect(validateGroups([g('Bad Id')])).not.toHaveLength(0);
    expect(validateGroups(Array.from({ length: 9 }, (_, i) => g(`g${i}`)))).not.toHaveLength(0);
    expect(validateGroups([g('a'), g('b')])).toEqual([]);
  });

  it('creates ids that do not collide', () => {
    expect(uniqueGroupId('Electric Bikes', [])).toBe('electric-bikes');
    expect(uniqueGroupId('atv', [g('atv')])).toBe('atv-2');
    expect(uniqueGroupId('三轮', [])).toBe('group');
  });

  it('upserts, removes and moves without mutating the input', () => {
    const list = [g('a'), g('b'), g('c')];
    const frozen = JSON.stringify(list);
    expect(upsertGroup(list, { ...g('b'), labelEn: 'B2' }).map((x) => x.labelEn)).toEqual(['a', 'B2', 'c']);
    expect(upsertGroup(list, g('d')).map((x) => x.id)).toEqual(['a', 'b', 'c', 'd']);
    expect(removeGroup(list, 'b').map((x) => x.id)).toEqual(['a', 'c']);
    expect(moveGroup(list, 'b', -1).map((x) => x.id)).toEqual(['b', 'a', 'c']);
    expect(moveGroup(list, 'a', -1)).toBe(list);
    expect(JSON.stringify(list)).toBe(frozen);
  });

  it('partitions categories by group and reports the ones whose group is gone', () => {
    const groups = [g('one'), g('two')];
    const items = [{ parentType: 'two' }, { parentType: 'ONE' }, { parentType: 'removed' }, {}];
    const { byGroup, orphans } = partitionByGroup(items, groups);
    expect(byGroup.one).toHaveLength(1);
    expect(byGroup.two).toHaveLength(1);
    expect(orphans).toHaveLength(2); // 'removed', and the one with no group (defaults to two-wheeler, which is not a group here)
  });

  it('files an orphaned category under the first group on the public menu', () => {
    const groups = [g('one'), g('two')];
    expect(groupIdForCategory('two', groups)).toBe('two');
    expect(groupIdForCategory('removed', groups)).toBe('one');
    expect(groupIdForCategory(undefined, [g('two-wheeler')])).toBe('two-wheeler');
  });
});
