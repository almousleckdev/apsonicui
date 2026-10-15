import type { PageDocument } from './types';

/**
 * Undo/redo for the editor. {@code present} is always the current document. Rapid edits with the same
 * {@code groupKey} (typing in one field) collapse into a single undo step, so Ctrl+Z undoes a sentence, not a letter.
 */
export interface History {
  past: PageDocument[];
  present: PageDocument;
  future: PageDocument[];
  /** Key and time of the last commit, for grouping. */
  lastKey?: string;
  lastAt?: number;
}

export const HISTORY_LIMIT = 100;
export const GROUP_WINDOW_MS = 1000;

export function createHistory(initial: PageDocument): History {
  return { past: [], present: initial, future: [] };
}

export function commit(history: History, next: PageDocument, groupKey?: string, now: number = Date.now()): History {
  if (next === history.present) return history;
  const grouped = groupKey !== undefined && groupKey === history.lastKey && history.lastAt !== undefined && now - history.lastAt < GROUP_WINDOW_MS;
  const past = grouped ? history.past : [...history.past, history.present].slice(-HISTORY_LIMIT);
  return { past, present: next, future: [], lastKey: groupKey, lastAt: now };
}

export function canUndo(history: History): boolean {
  return history.past.length > 0;
}

export function canRedo(history: History): boolean {
  return history.future.length > 0;
}

export function undo(history: History): History {
  if (!canUndo(history)) return history;
  const previous = history.past[history.past.length - 1];
  return { past: history.past.slice(0, -1), present: previous, future: [history.present, ...history.future] };
}

export function redo(history: History): History {
  if (!canRedo(history)) return history;
  const [next, ...future] = history.future;
  return { past: [...history.past, history.present], present: next, future };
}

/** Replaces the document without recording history (e.g. after the server normalised it). */
export function replacePresent(history: History, next: PageDocument): History {
  return { ...history, present: next };
}
