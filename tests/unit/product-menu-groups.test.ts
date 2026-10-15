import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRODUCT_MENU_GROUPS,
  countByGroup,
  groupIdForCategory,
  groupLabel,
  moveGroup,
  sanitizeGroups,
  uniqueGroupId,
  validateGroups,
} from '@/lib/product-menu/groups';

const g = (id: string, labelEn = id) => ({ id, labelEn, labelFr: '', labelZh: '' });

describe('product menu groups', () => {
  it('ships the three original groups as defaults', () => {
    expect(DEFAULT_PRODUCT_MENU_GROUPS.map((x) => x.id)).toEqual(['two-wheeler', 'three-wheeler', 'atv']);
  });

  it('falls back to English, then to any language, then to the id', () => {
    expect(groupLabel({ id: 'a', labelEn: 'E', labelFr: 'F', labelZh: 'Z' }, 'fr')).toBe('F');
    expect(groupLabel({ id: 'a', labelEn: 'E', labelFr: '', labelZh: '' }, 'zh')).toBe('E');
    expect(groupLabel({ id: 'a', labelEn: '', labelFr: '', labelZh: '中' }, 'en')).toBe('中');
    expect(groupLabel({ id: 'a', labelEn: '', labelFr: '', labelZh: '' }, 'en')).toBe('a');
  });

  it('drops corrupt stored entries instead of breaking the menu', () => {
    const result = sanitizeGroups([g('ok'), g('ok'), g('Bad Id'), { id: 'x' }, null, 'str', g('second')]);
    expect(result.map((x) => x.id)).toEqual(['ok', 'second']);
    expect(sanitizeGroups('nope')).toEqual([]);
  });

  it('validates required name, id format, duplicates and at least one group', () => {
    expect(validateGroups([])).not.toHaveLength(0);
    expect(validateGroups([g('a', '')])).not.toHaveLength(0);
    expect(validateGroups([g('a'), g('a')])).not.toHaveLength(0);
    expect(validateGroups([g('a'), g('b')])).toEqual([]);
  });

  it('creates ids that do not collide', () => {
    expect(uniqueGroupId('Electric Bikes', [])).toBe('electric-bikes');
    expect(uniqueGroupId('atv', [g('atv')])).toBe('atv-2');
    expect(uniqueGroupId('三轮', [])).toBe('group');
  });

  it('moves groups within bounds', () => {
    const list = [g('a'), g('b'), g('c')];
    expect(moveGroup(list, 'b', -1).map((x) => x.id)).toEqual(['b', 'a', 'c']);
    expect(moveGroup(list, 'a', -1)).toBe(list);
  });

  it('counts categories per group and files orphans under the first group', () => {
    expect(countByGroup([{ parentType: 'atv' }, { parentType: 'ATV' }, {}])).toEqual({ atv: 2, 'two-wheeler': 1 });
    const groups = [g('one'), g('two')];
    expect(groupIdForCategory('two', groups)).toBe('two');
    expect(groupIdForCategory('removed', groups)).toBe('one');
    expect(groupIdForCategory(undefined, [g('two-wheeler')])).toBe('two-wheeler');
  });
});
