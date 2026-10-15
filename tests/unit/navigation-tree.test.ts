import { describe, expect, it } from 'vitest';
import { canHaveChildren, countItems, find, flatten, height, indent, insertAfter, moveDown, moveTo, moveUp, newMenuItem, outdent, remove, treesEqual, update, warningsFor } from '@/lib/navigation/tree';
import type { MenuItem } from '@/lib/navigation/types';

const item = (id: string, children: MenuItem[] = [], extra: Partial<MenuItem> = {}): MenuItem =>
  ({ id, kind: 'GROUP', labels: { en: id }, visible: true, openInNewTab: false, children, ...extra });
const ids = (items: MenuItem[]) => flatten(items).map((f) => `${'-'.repeat(f.depth)}${f.item.id}`);

// A, B(B1, B2), C
const sample = () => [item('A'), item('B', [item('B1'), item('B2')]), item('C')];

describe('reading a tree', () => {
  it('flattens in display order with depth and parents', () => {
    expect(ids(sample())).toEqual(['A', 'B', '-B1', '-B2', 'C']);
    const flat = flatten(sample());
    expect(flat[2]).toMatchObject({ depth: 1, parentId: 'B', index: 0, siblings: 2 });
  });

  it('counts items and levels', () => {
    expect(countItems(sample())).toBe(5);
    expect(height(sample())).toBe(2);
    expect(height([])).toBe(0);
  });

  it('finds items at any depth', () => {
    expect(find(sample(), 'B2')?.id).toBe('B2');
    expect(find(sample(), 'nope')).toBeUndefined();
  });
});

describe('editing', () => {
  it('inserts after a sibling at any level, or at the end', () => {
    expect(ids(insertAfter(sample(), 'A', item('N')))).toEqual(['A', 'N', 'B', '-B1', '-B2', 'C']);
    expect(ids(insertAfter(sample(), 'B1', item('N')))).toEqual(['A', 'B', '-B1', '-N', '-B2', 'C']);
    expect(ids(insertAfter(sample(), null, item('N')))).toEqual(['A', 'B', '-B1', '-B2', 'C', 'N']);
  });

  it('updates and removes (removing a parent removes its dropdown)', () => {
    expect(find(update(sample(), 'B1', (i) => ({ ...i, visible: false })), 'B1')?.visible).toBe(false);
    expect(ids(remove(sample(), 'B'))).toEqual(['A', 'C']);
    expect(ids(remove(sample(), 'B1'))).toEqual(['A', 'B', '-B2', 'C']);
  });

  it('does not mutate its input', () => {
    const tree = sample();
    const copy = JSON.stringify(tree);
    moveUp(tree, 'C'); indent(tree, 'C', 3); remove(tree, 'B'); update(tree, 'A', (i) => ({ ...i, visible: false }));
    expect(JSON.stringify(tree)).toBe(copy);
  });
});

describe('moving between two items (the "About Us between Products and Services" case)', () => {
  it('moves up and down among siblings only', () => {
    expect(ids(moveUp(sample(), 'C'))).toEqual(['A', 'C', 'B', '-B1', '-B2']);
    expect(ids(moveDown(sample(), 'A'))).toEqual(['B', '-B1', '-B2', 'A', 'C']);
    expect(ids(moveUp(sample(), 'A'))).toEqual(ids(sample()));
    expect(ids(moveDown(sample(), 'C'))).toEqual(ids(sample()));
    expect(ids(moveDown(sample(), 'B1'))).toEqual(['A', 'B', '-B2', '-B1', 'C']);
  });

  it('drag and drop moves an item, with its dropdown, next to the target', () => {
    expect(ids(moveTo(sample(), 'C', 'A', 3))).toEqual(['C', 'A', 'B', '-B1', '-B2']);
    expect(ids(moveTo(sample(), 'A', 'C', 3))).toEqual(['B', '-B1', '-B2', 'C', 'A']);
    expect(ids(moveTo(sample(), 'B', 'C', 3))).toEqual(['A', 'C', 'B', '-B1', '-B2']);
    expect(ids(moveTo(sample(), 'A', 'B1', 3))).toEqual(['B', '-B1', '-A', '-B2', 'C']);
  });

  it('refuses drops that would create a cycle or exceed the depth', () => {
    const tree = sample();
    expect(moveTo(tree, 'B', 'B1', 3)).toBe(tree);
    expect(moveTo(tree, 'B', 'B', 3)).toBe(tree);
    expect(moveTo(tree, 'B', 'B1', 2)).toBe(tree);
    expect(moveTo(tree, 'A', 'missing', 3)).toBe(tree);
  });
});

describe('nesting', () => {
  it('indents under the item above and outdents back out', () => {
    expect(ids(indent(sample(), 'C', 3))).toEqual(['A', 'B', '-B1', '-B2', '-C']);
    expect(ids(indent(sample(), 'B2', 3))).toEqual(['A', 'B', '-B1', '--B2', 'C']);
    expect(ids(outdent(sample(), 'B1'))).toEqual(['A', 'B', '-B2', 'B1', 'C']);
    expect(ids(outdent(sample(), 'A'))).toEqual(ids(sample()));
  });

  it('does not indent the first item or beyond the allowed depth', () => {
    const tree = sample();
    expect(indent(tree, 'A', 3)).toBe(tree);
    // In a two-level menu: C may go under B (2 levels), but B2 under B1 or B under A would need a third level.
    expect(ids(indent(tree, 'C', 2))).toEqual(['A', 'B', '-B1', '-B2', '-C']);
    expect(indent(tree, 'B2', 2)).toBe(tree);
    expect(indent(tree, 'B', 2)).toBe(tree);
    expect(ids(indent(tree, 'B2', 3))).toEqual(['A', 'B', '-B1', '--B2', 'C']);
  });

  it('never nests under items that cannot have a dropdown', () => {
    const tree = [item('L', [], { kind: 'EXTERNAL', url: 'https://x.example' }), item('N')];
    expect(canHaveChildren(tree[0])).toBe(false);
    expect(indent(tree, 'N', 3)).toBe(tree);
    const products = [item('P', [], { kind: 'ROUTE', route: '/products' }), item('N')];
    expect(canHaveChildren(products[0])).toBe(false);
    expect(indent(products, 'N', 3)).toBe(products);
  });
});

describe('row hints and equality', () => {
  it('flags what is missing', () => {
    expect(warningsFor(newMenuItem('PAGE'))).toEqual(['Add an English label', 'Choose a page']);
    expect(warningsFor(newMenuItem('EXTERNAL', { labels: { en: 'x' }, url: 'javascript:alert(1)' }))).toEqual(['Enter a full web address (https://…)']);
    expect(warningsFor(newMenuItem('ROUTE', { labels: { en: 'x' }, route: '/news' }))).toEqual([]);
  });

  it('compares trees by content', () => {
    expect(treesEqual(sample(), sample())).toBe(true);
    expect(treesEqual(sample(), moveUp(sample(), 'C'))).toBe(false);
  });
});
