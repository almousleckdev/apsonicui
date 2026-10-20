import { describe, expect, it } from 'vitest';
import { groupFields, isFieldVisible, optionLabel } from '@/lib/page-builder/fields';
import type { FieldDef } from '@/lib/page-builder/types';

const height: FieldDef = { name: 'height', kind: 'ENUM', label: 'Height', options: ['md', 'custom'], defaultValue: 'md' };
const minHeight: FieldDef = { name: 'minHeight', kind: 'NUMBER', label: 'px', showWhenField: 'height', showWhenValues: ['custom'] };
const image: FieldDef = { name: 'image', kind: 'MEDIA', label: 'Picture' };
const tint: FieldDef = { name: 'tint', kind: 'COLOR', label: 'Tint', showWhenField: 'image', showWhenValues: ['*'] };
const flag: FieldDef = { name: 'line', kind: 'BOOLEAN', label: 'Line', defaultValue: false };
const lineColor: FieldDef = { name: 'lineColor', kind: 'COLOR', label: 'Line color', showWhenField: 'line', showWhenValues: ['true'] };
const all = [height, minHeight, image, tint, flag, lineColor];

describe('isFieldVisible', () => {
  it('shows fields that have no condition', () => {
    expect(isFieldVisible(height, {}, all)).toBe(true);
  });

  it('follows the value of the controlling field', () => {
    expect(isFieldVisible(minHeight, { height: 'custom' }, all)).toBe(true);
    expect(isFieldVisible(minHeight, { height: 'md' }, all)).toBe(false);
  });

  it('treats a missing controlling value as its default', () => {
    expect(isFieldVisible(minHeight, {}, all)).toBe(false);
    expect(isFieldVisible(lineColor, {}, all)).toBe(false);
    expect(isFieldVisible(lineColor, { line: true }, all)).toBe(true);
  });

  it('"*" means any non-empty value', () => {
    expect(isFieldVisible(tint, {}, all)).toBe(false);
    expect(isFieldVisible(tint, { image: '' }, all)).toBe(false);
    expect(isFieldVisible(tint, { image: '/uploads/a.jpg' }, all)).toBe(true);
  });
});

describe('groupFields', () => {
  it('collects fields under their group in order of first appearance', () => {
    const groups = groupFields([
      { ...image, group: 'Picture' }, { ...height, group: 'Size' }, { ...tint, group: 'Picture' }, { ...flag },
    ]);
    expect(groups.map((g) => g.title)).toEqual(['Picture', 'Size', 'Settings']);
    expect(groups[0].fields.map((f) => f.name)).toEqual(['image', 'tint']);
  });
});

describe('optionLabel', () => {
  it('prefers the server\'s friendly names', () => {
    const f: FieldDef = { name: 'v', kind: 'ENUM', label: 'v', options: ['primary', 'secondary'], optionLabels: ['Solid', 'Outline'] };
    expect(optionLabel(f, 'primary', 0)).toBe('Solid');
    expect(optionLabel(f, 'secondary', 1)).toBe('Outline');
  });
  it('makes raw values readable otherwise', () => {
    const f: FieldDef = { name: 'p', kind: 'ENUM', label: 'p', options: ['top-left'] };
    expect(optionLabel(f, 'top-left', 0)).toBe('Top left');
  });
});
