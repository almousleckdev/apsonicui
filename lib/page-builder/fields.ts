import type { FieldDef } from './types';

/**
 * Whether a field should be shown, given the values of its siblings. A field can depend on another field of the same
 * object ("show the custom height only when Height is 'custom'"). A controlling field that was never set counts as
 * having its default value, so sections saved before a field existed still behave.
 */
export function isFieldVisible(field: FieldDef, values: Record<string, unknown>, siblings: FieldDef[]): boolean {
  if (!field.showWhenField) return true;
  const controller = siblings.find((f) => f.name === field.showWhenField);
  const raw = values[field.showWhenField] ?? controller?.defaultValue;
  const wanted = field.showWhenValues ?? [];
  if (wanted.includes('*')) return raw !== undefined && raw !== null && raw !== '' && raw !== false;
  return wanted.includes(String(raw ?? ''));
}

export interface FieldGroup {
  title: string;
  fields: FieldDef[];
}

/** Fields in order, collected under their group titles (groups in order of first appearance). */
export function groupFields(fields: FieldDef[], fallbackTitle = 'Settings'): FieldGroup[] {
  const groups: FieldGroup[] = [];
  for (const field of fields) {
    const title = field.group ?? fallbackTitle;
    const existing = groups.find((g) => g.title === title);
    if (existing) existing.fields.push(field);
    else groups.push({ title, fields: [field] });
  }
  return groups;
}

/** Shown text for an option: its friendly name when the server provides one, otherwise the value made readable. */
export function optionLabel(field: FieldDef, option: string, index: number): string {
  return field.optionLabels?.[index] ?? option.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
}
