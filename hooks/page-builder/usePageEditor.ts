'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ApiError } from '@/services/api-client';
import { pagesService } from '@/services/pages';
import { canRedo, canUndo, commit, createHistory, redo as redoHistory, replacePresent, undo as undoHistory, type History } from '@/lib/page-builder/history';
import { documentsEqual } from '@/lib/page-builder/document';
import type { PageDetail, PageDocument } from '@/lib/page-builder/types';

export type SaveStatus = 'idle' | 'saving' | 'error' | 'conflict' | 'offline';
export interface ServerProblem { path: string; message: string }

export const AUTOSAVE_DELAY_MS = 2500;
const OFFLINE_RETRY_MS = 8000;

/** What the editor shows in its save chip. */
export type SaveLabel = 'saved' | 'unsaved' | 'saving' | 'error' | 'conflict' | 'offline';

/**
 * Editing state for one page: the document with undo/redo, the version last received from the server, and autosave.
 * Autosave only ever saves the draft; publishing is a separate, explicit call.
 */
export function usePageEditor(initial: PageDetail) {
  const [server, setServer] = useState<PageDetail>(initial);
  const [history, setHistory] = useState<History>(() => createHistory(initial.document));
  const [slug, setSlugState] = useState(initial.slug);
  const [rawStatus, setStatus] = useState<SaveStatus>('idle');
  // The document that failed validation; a later edit makes the failure stale so autosave may try again.
  const [failedAt, setFailedAt] = useState<{ doc: PageDocument; slug: string } | null>(null);
  const [problems, setProblems] = useState<ServerProblem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const doc = history.present;
  const status: SaveStatus = rawStatus === 'error' && failedAt && failedAt.doc === doc && failedAt.slug === slug ? 'error' : rawStatus === 'error' ? 'idle' : rawStatus;
  const dirty = useMemo(() => slug !== server.slug || !documentsEqual(doc, server.document), [doc, slug, server]);

  // Refs let the long-lived save function always read the latest values without being recreated on every keystroke.
  const latest = useRef({ doc, slug, server, dirty });
  useLayoutEffect(() => {
    latest.current = { doc, slug, server, dirty };
  });
  const saving = useRef<Promise<PageDetail> | null>(null);

  const edit = useCallback((change: (doc: PageDocument) => PageDocument, groupKey?: string) => {
    setHistory((h) => commit(h, change(h.present), groupKey));
  }, []);
  const undo = useCallback(() => setHistory((h) => undoHistory(h)), []);
  const redo = useCallback(() => setHistory((h) => redoHistory(h)), []);
  const setSlug = useCallback((value: string) => setSlugState(value.toLowerCase()), []);

  const save = useCallback(async (): Promise<PageDetail> => {
    if (saving.current) {
      await saving.current.catch(() => undefined);
    }
    const { doc: sentDoc, slug: sentSlug, server: base, dirty: isDirty } = latest.current;
    if (!isDirty) return base;

    setStatus('saving');
    const request = pagesService.saveDraft(base.id, {
      expectedVersion: base.version,
      document: sentDoc,
      slug: sentSlug !== base.slug ? sentSlug : undefined,
    });
    saving.current = request;
    try {
      const saved = await request;
      setServer(saved);
      setProblems([]);
      setMessage(null);
      setStatus('idle');
      // If nothing changed while saving, adopt the server's normalised copy; otherwise keep the newer local edits.
      setHistory((h) => (h.present === sentDoc ? replacePresent(h, saved.document) : h));
      setSlugState((s) => (s === sentSlug ? saved.slug : s));
      return saved;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setStatus('conflict');
          setMessage(error.message);
        } else {
          setStatus('error');
          setFailedAt({ doc: sentDoc, slug: sentSlug });
          setMessage(error.message);
          setProblems((error.details?.errors ?? []).map((e) => ({ path: e.field, message: e.message })));
        }
      } else {
        setStatus('offline');
        setMessage('You appear to be offline. Changes will be saved when the connection returns.');
      }
      throw error;
    } finally {
      saving.current = null;
    }
  }, []);

  // Autosave: a pause after the last edit, never while another save runs, and not after a conflict.
  useEffect(() => {
    if (!dirty || status === 'saving' || status === 'conflict' || status === 'error') return;
    const delay = status === 'offline' ? OFFLINE_RETRY_MS : AUTOSAVE_DELAY_MS;
    const timer = setTimeout(() => { void save().catch(() => undefined); }, delay);
    return () => clearTimeout(timer);
  }, [doc, slug, dirty, status, save]);

  // Leaving with unsaved work asks first.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (latest.current.dirty || saving.current) e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  /** Throws away local changes and loads the latest saved version (used after a conflict). */
  const reload = useCallback(async () => {
    const fresh = await pagesService.get(latest.current.server.id);
    setServer(fresh);
    setHistory(createHistory(fresh.document));
    setSlugState(fresh.slug);
    setStatus('idle');
    setProblems([]);
    setMessage(null);
    return fresh;
  }, []);

  /** Applies the result of a lifecycle call (publish, unpublish, restore...) to the editor. */
  const adopt = useCallback((page: PageDetail) => {
    setServer(page);
    setHistory((h) => replacePresent(h, page.document));
    setSlugState(page.slug);
    setStatus('idle');
  }, []);

  const label: SaveLabel =
    status === 'saving' ? 'saving'
      : status === 'conflict' ? 'conflict'
        : status === 'offline' ? 'offline'
          : status === 'error' ? 'error'
            : dirty ? 'unsaved' : 'saved';

  return {
    page: server, doc, slug, setSlug, edit, undo, redo,
    canUndo: canUndo(history), canRedo: canRedo(history),
    dirty, status, label, problems: status === 'error' ? problems : [], message, save, reload, adopt,
  };
}

export type PageEditor = ReturnType<typeof usePageEditor>;
