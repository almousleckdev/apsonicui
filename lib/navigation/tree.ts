import type { AdminKey } from '@/lib/i18n/admin/catalog';
import type { ItemKind, MenuItem } from './types';

/**
 * Pure operations on a menu tree. Each returns a new tree and leaves its input alone, so the editor can keep an
 * undoable draft and compare it with the saved one. The backend re-validates everything (depth, duplicates, links).
 */

export function newMenuItem(kind: ItemKind, init: Partial<MenuItem> = {}): MenuItem {
  return { id: crypto.randomUUID(), kind, labels: {}, visible: true, openInNewTab: false, children: [], ...init };
}

/** Whether an item may have a dropdown under it (external links and the Products mega menu may not). */
export function canHaveChildren(item: MenuItem): boolean {
  return item.kind !== 'EXTERNAL' && !(item.kind === 'ROUTE' && item.route === '/products');
}

export interface FlatItem {
  item: MenuItem;
  depth: number;
  parentId: string | null;
  index: number;
  siblings: number;
}

/** The tree as a list in display order (each item followed by its descendants). */
export function flatten(items: MenuItem[], depth = 0, parentId: string | null = null): FlatItem[] {
  return items.flatMap((item, index) => [
    { item, depth, parentId, index, siblings: items.length },
    ...flatten(item.children, depth + 1, item.id),
  ]);
}

export function countItems(items: MenuItem[]): number {
  return items.reduce((n, i) => n + 1 + countItems(i.children), 0);
}

/** Levels in the tree below (and including) this list: 0 for an empty list. */
export function height(items: MenuItem[]): number {
  return items.length === 0 ? 0 : 1 + Math.max(...items.map((i) => height(i.children)));
}

export function find(items: MenuItem[], id: string): MenuItem | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    const inside = find(item.children, id);
    if (inside) return inside;
  }
  return undefined;
}

export function update(items: MenuItem[], id: string, change: (item: MenuItem) => MenuItem): MenuItem[] {
  return items.map((item) => (item.id === id ? change(item) : { ...item, children: update(item.children, id, change) }));
}

export function remove(items: MenuItem[], id: string): MenuItem[] {
  return items.filter((i) => i.id !== id).map((i) => ({ ...i, children: remove(i.children, id) }));
}

/** Adds an item as the next sibling of {@code afterId}, or at the end of the top level when there is none. */
export function insertAfter(items: MenuItem[], afterId: string | null, item: MenuItem): MenuItem[] {
  if (afterId === null) return [...items, item];
  const index = items.findIndex((i) => i.id === afterId);
  if (index >= 0) return [...items.slice(0, index + 1), item, ...items.slice(index + 1)];
  return items.map((i) => ({ ...i, children: insertAfter(i.children, afterId, item) }));
}

function withSiblings(items: MenuItem[], id: string, change: (siblings: MenuItem[], index: number) => MenuItem[]): MenuItem[] {
  const index = items.findIndex((i) => i.id === id);
  if (index >= 0) return change(items, index);
  return items.map((i) => ({ ...i, children: withSiblings(i.children, id, change) }));
}

export function moveUp(items: MenuItem[], id: string): MenuItem[] {
  return withSiblings(items, id, (list, i) => {
    if (i === 0) return list;
    const next = [...list];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    return next;
  });
}

export function moveDown(items: MenuItem[], id: string): MenuItem[] {
  return withSiblings(items, id, (list, i) => {
    if (i === list.length - 1) return list;
    const next = [...list];
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    return next;
  });
}

/** Makes the item the last child of the sibling above it, if that sibling may have children and depth allows. */
export function indent(items: MenuItem[], id: string, maxDepth: number): MenuItem[] {
  const flat = flatten(items);
  const entry = flat.find((f) => f.item.id === id);
  if (!entry || entry.index === 0) return items;
  const previous = flatten(items).find((f) => f.parentId === entry.parentId && f.index === entry.index - 1)!.item;
  if (!canHaveChildren(previous)) return items;
  // After indenting, the item sits one level deeper and brings its own dropdown levels with it.
  if (entry.depth + 1 + height([entry.item]) > maxDepth) return items;
  const moving = entry.item;
  return update(remove(items, id), previous.id, (p) => ({ ...p, children: [...p.children, moving] }));
}

/** Moves the item out of its dropdown, to sit right after its former parent. */
export function outdent(items: MenuItem[], id: string): MenuItem[] {
  const entry = flatten(items).find((f) => f.item.id === id);
  if (!entry || entry.parentId === null) return items;
  return insertAfter(remove(items, id), entry.parentId, entry.item);
}

/** Whether {@code candidate} is {@code id} itself or inside its subtree (a drop there would create a cycle). */
export function isInside(items: MenuItem[], id: string, candidate: string): boolean {
  const root = find(items, id);
  return !!root && (root.id === candidate || find(root.children, candidate) !== undefined);
}

/**
 * Drag and drop: moves an item (with everything under it) to sit right after {@code overId}, at the same level as it.
 * Dropping onto itself or into its own subtree, or beyond the allowed depth, changes nothing.
 */
export function moveTo(items: MenuItem[], id: string, overId: string, maxDepth: number): MenuItem[] {
  if (id === overId || isInside(items, id, overId)) return items;
  const moving = find(items, id);
  const over = flatten(items).find((f) => f.item.id === overId);
  if (!moving || !over) return items;
  if (over.depth + height([moving]) > maxDepth) return items;
  const without = remove(items, id);
  const target = flatten(without).find((f) => f.item.id === overId)!;
  // Moving down within a list lands after the target; moving up lands before it.
  const from = flatten(items).findIndex((f) => f.item.id === id);
  const to = flatten(items).findIndex((f) => f.item.id === overId);
  if (to < from) {
    return insertBefore(without, target.item.id, moving);
  }
  return insertAfter(without, target.item.id, moving);
}

function insertBefore(items: MenuItem[], beforeId: string, item: MenuItem): MenuItem[] {
  const index = items.findIndex((i) => i.id === beforeId);
  if (index >= 0) return [...items.slice(0, index), item, ...items.slice(index)];
  return items.map((i) => ({ ...i, children: insertBefore(i.children, beforeId, item) }));
}

export interface ItemWarning { message: string }

/** Quick hints shown on a row before the backend has the last word. */
export function warningsFor(item: MenuItem): AdminKey[] {
  const warnings: AdminKey[] = [];
  if (!item.labels.en?.trim()) warnings.push('navigation.warn.label');
  if (item.kind === 'PAGE' && !item.pageId) warnings.push('navigation.warn.page');
  if (item.kind === 'ROUTE' && !item.route) warnings.push('navigation.warn.page');
  if (item.kind === 'EXTERNAL' && !/^(https?:\/\/|mailto:|tel:)/i.test(item.url ?? '')) warnings.push('navigation.warn.address');
  return warnings;
}

export function treesEqual(a: MenuItem[], b: MenuItem[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
