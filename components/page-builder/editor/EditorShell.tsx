'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { ActionModal } from '@/components/admin/ActionModal';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { usePageEditor } from '@/hooks/page-builder/usePageEditor';
import { useSectionTypes } from '@/hooks/page-builder/useSectionTypes';
import { pagesService } from '@/services/pages';
import { getErrorMessage } from '@/lib/utils/errors';
import { readLocaleCookie, writeLocaleCookie } from '@/lib/page-builder/locale-cookie';
import { createSection, duplicateSection, insertSection, moveSection, newId, removeSection, setHidden } from '@/lib/page-builder/document';
import type { Locale, PageDetail } from '@/lib/page-builder/types';
import { SectionIcon } from '../renderer/registry';
import { AddSectionPanel } from './AddSectionPanel';
import { PageSettingsPanel } from './PageSettingsPanel';
import { Device, PreviewFrame } from './PreviewFrame';
import { describeIssue, PublishDialog } from './PublishDialog';
import { PropertiesPanel } from './PropertiesPanel';
import { RevisionsDrawer } from './RevisionsDrawer';
import { STRUCTURE_END_ID, StructureList } from './StructureList';
import { TopBar } from './TopBar';

type Confirm = 'unpublish' | 'archive' | { restore: number } | null;

/** The full-screen page editor: outline on the left, the real page in the middle, settings on the right. */
export function EditorShell({ initial }: { initial: PageDetail }) {
  const editor = usePageEditor(initial);
  const { page, doc, edit } = editor;
  const { definitions, byType, styleFields, isLoading: loadingTypes, isError: typesFailed } = useSectionTypes();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const can = useCallback((permission: string) => !!user?.permissions?.includes(permission), [user]);

  // The visitor's saved language, read before the editor changes it, and put back when the editor closes.
  const [originalLocale] = useState(readLocaleCookie);
  // The canvas frame follows the saved language cookie for English, so set it before the first frame loads.
  const [locale, setLocaleState] = useState<Locale>(() => { writeLocaleCookie('en'); return 'en'; });
  const setLocale = useCallback((next: Locale) => { writeLocaleCookie(next); setLocaleState(next); }, []);
  const [device, setDevice] = useState<Device>('desktop');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addIndex, setAddIndex] = useState<number | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [busy, setBusy] = useState(false);
  const [dragType, setDragType] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const sections = doc.sections;
  const selectedIndex = sections.findIndex((s) => s.id === selectedId);
  const selected = selectedIndex >= 0 ? sections[selectedIndex] : null;
  const issues = useMemo(() => new Map(editor.problems.map((p) => [p.path, p.message])), [editor.problems]);
  const labels = useMemo(() => Object.fromEntries(definitions.map((d) => [d.type, d.label])), [definitions]);

  // --- changing the page ---------------------------------------------------------------------------------------
  const insertAt = useCallback((type: string, index: number) => {
    const definition = byType.get(type);
    if (!definition) return;
    const section = createSection(definition);
    edit((d) => insertSection(d, section, index));
    setSelectedId(section.id);
    setAddIndex(null);
  }, [byType, edit]);

  const applyAction = useCallback((id: string, action: 'up' | 'down' | 'duplicate' | 'delete' | 'toggle-hidden') => {
    const index = doc.sections.findIndex((s) => s.id === id);
    if (index < 0) return;
    switch (action) {
      case 'up': edit((d) => moveSection(d, index, index - 1)); break;
      case 'down': edit((d) => moveSection(d, index, index + 1)); break;
      case 'duplicate': {
        const copyId = newId();
        edit((d) => duplicateSection(d, id, copyId));
        setSelectedId(copyId);
        break;
      }
      case 'delete':
        edit((d) => removeSection(d, id));
        setSelectedId((current) => (current === id ? null : current));
        toast.success('Section deleted. Press Ctrl/⌘ Z to undo.');
        break;
      case 'toggle-hidden': edit((d) => setHidden(d, id, !doc.sections[index].hidden)); break;
    }
  }, [doc.sections, edit, toast]);

  // --- drag and drop ---------------------------------------------------------------------------------------------
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const onDragStart = (e: DragStartEvent) => setDragType(e.active.data.current?.kind === 'library' ? String(e.active.data.current.type) : null);
  const onDragOver = (e: DragOverEvent) => setDropTargetId(e.over && e.over.id !== STRUCTURE_END_ID ? String(e.over.id) : null);
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setDragType(null);
    setDropTargetId(null);
    if (!over) return;
    const toIndex = over.id === STRUCTURE_END_ID ? sections.length : sections.findIndex((s) => s.id === over.id);
    if (active.data.current?.kind === 'library') {
      if (toIndex >= 0) insertAt(String(active.data.current.type), toIndex);
      return;
    }
    const from = sections.findIndex((s) => s.id === active.id);
    const to = over.id === STRUCTURE_END_ID ? sections.length - 1 : toIndex;
    if (from >= 0 && to >= 0 && from !== to) edit((d) => moveSection(d, from, to));
  };

  // Previewing another language makes the site remember that language for this browser. Put the editor's own
  // setting back when they leave, so working in French does not silently switch their later browsing.
  useEffect(() => () => writeLocaleCookie(originalLocale), [originalLocale]);

  // --- keyboard shortcuts --------------------------------------------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const inField = !!(e.target as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable="true"]');
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void editor.save().catch(() => undefined);
      } else if (mod && e.key.toLowerCase() === 'z' && !inField) {
        e.preventDefault();
        if (e.shiftKey) editor.redo(); else editor.undo();
      } else if (e.key === 'Escape' && !inField && addIndex === null) {
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editor, addIndex]);

  // --- lifecycle actions ---------------------------------------------------------------------------------------
  const openPreview = async () => {
    const tab = window.open('', '_blank');
    try {
      if (editor.dirty) await editor.save();
      const { token } = await pagesService.previewToken(page.id);
      const prefix = locale === 'en' ? '' : `/${locale}`;
      if (tab) tab.location.href = `${prefix}/preview/pages/${page.id}?token=${encodeURIComponent(token)}`;
    } catch (e) {
      tab?.close();
      toast.error(getErrorMessage(e, 'Could not open the preview.'));
    }
  };

  const duplicate = async () => {
    try {
      if (editor.dirty) await editor.save();
      const copy = await pagesService.duplicate(page.id);
      toast.success('Page duplicated. Opening the copy…');
      router.push(`/admin/pages/${copy.id}`);
    } catch (e) {
      toast.error(getErrorMessage(e, 'Could not duplicate the page.'));
    }
  };

  const runConfirmed = async () => {
    setBusy(true);
    try {
      const saved = editor.dirty ? await editor.save() : page;
      if (confirm !== null && typeof confirm === 'object') {
        const restored = await pagesService.rollback(saved.id, confirm.restore, saved.version);
        editor.adopt(restored);
        setSelectedId(null);
        toast.success(`Version #${confirm.restore} restored to your draft. It is not published.`);
        setHistoryOpen(false);
      } else if (confirm === 'unpublish') {
        editor.adopt(await pagesService.unpublish(saved.id, saved.version));
        toast.success('Page unpublished. It is no longer visible to visitors.');
      } else if (confirm === 'archive') {
        await pagesService.archive(saved.id, saved.version);
        toast.success('Page archived.');
        router.push('/admin/pages');
      }
      setConfirm(null);
    } catch (e) {
      toast.error(getErrorMessage(e, 'That did not work.'));
    } finally {
      setBusy(false);
    }
  };

  const publishLabel = page.status === 'PUBLISHED' ? (page.hasUnpublishedChanges || editor.dirty ? 'Publish changes' : 'Published') : 'Publish';
  const addPosition = addIndex ?? (selectedIndex >= 0 ? selectedIndex + 1 : sections.length);
  const positionLabel = addPosition === 0 ? 'at the top' : addPosition >= sections.length ? 'at the end' : `after “${byType.get(sections[addPosition - 1].type)?.label ?? 'the previous section'}”`;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-zinc-100 font-sans text-zinc-900">
      <TopBar
        title={doc.meta.en?.title || page.title} slug={editor.slug} status={page.status} hasUnpublishedChanges={page.hasUnpublishedChanges}
        saveLabel={editor.label} device={device} locale={locale} canUndo={editor.canUndo} canRedo={editor.canRedo}
        canPublish={can('PUBLISH_PAGES')} canManage={can('PUBLISH_PAGES') || can('DELETE_PAGES')}
        publishLabel={publishLabel} publishDisabled={publishLabel === 'Published' || page.status === 'ARCHIVED'}
        onDevice={setDevice} onLocale={setLocale} onUndo={editor.undo} onRedo={editor.redo}
        onSettings={() => setSelectedId(null)} onPreview={openPreview}
        onPublish={() => setPublishOpen(true)} onSaveNow={() => { void editor.save().catch(() => undefined); }}
        onDuplicate={duplicate} onUnpublish={() => setConfirm('unpublish')} onArchive={() => setConfirm('archive')} onHistory={() => setHistoryOpen(true)}
      />

      {editor.label === 'conflict' && (
        <Banner tone="error" icon={<AlertTriangle className="h-4 w-4" />}>
          <span>Someone else saved this page while you were editing. Your latest changes were <strong>not</strong> saved.</span>
          <button type="button" className="ml-3 inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-red-700 shadow-sm"
            onClick={() => { editor.reload().then(() => toast.success('Loaded the latest version.')).catch((e) => toast.error(getErrorMessage(e, 'Could not reload.'))); }}>
            <RefreshCw className="h-3.5 w-3.5" /> Load the latest version (discards my unsaved changes)
          </button>
        </Banner>
      )}
      {editor.label === 'error' && (
        <Banner tone="error" icon={<AlertTriangle className="h-4 w-4" />}>
          <span>Autosave is paused because some content is not valid: {editor.message}</span>
          <span className="ml-2 inline-flex flex-wrap gap-2">
            {editor.problems.slice(0, 3).map((p, i) => {
              const d = describeIssue({ path: p.path, code: '', message: p.message, severity: 'ERROR' }, doc, byType);
              return d.sectionId
                ? <button key={i} type="button" className="font-bold underline" onClick={() => setSelectedId(d.sectionId!)}>{d.where}</button>
                : <span key={i} className="font-bold">{d.where}</span>;
            })}
          </span>
        </Banner>
      )}
      {editor.label === 'offline' && <Banner tone="warn" icon={<AlertTriangle className="h-4 w-4" />}><span>{editor.message}</span></Banner>}
      {page.status === 'ARCHIVED' && <Banner tone="warn" icon={<AlertTriangle className="h-4 w-4" />}><span>This page is archived and read-only. Restore it from the pages list to edit.</span></Banner>}
      {typesFailed && <Banner tone="error" icon={<AlertTriangle className="h-4 w-4" />}><span>The section list could not be loaded. Reload the page.</span></Banner>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}
        onDragCancel={() => { setDragType(null); setDropTargetId(null); }}>
        <div className="relative flex min-h-0 flex-1">
          <aside className="w-[280px] shrink-0 border-r border-zinc-200 bg-white" aria-label="Page outline">
            <StructureList
              sections={sections} definitions={byType} selectedId={selectedId} dropTargetId={dropTargetId} dragging={dragType !== null}
              onSelect={setSelectedId} onToggleHidden={(id) => applyAction(id, 'toggle-hidden')}
              onDuplicate={(id) => applyAction(id, 'duplicate')} onDelete={(id) => applyAction(id, 'delete')}
              onAdd={() => setAddIndex(selectedIndex >= 0 ? selectedIndex + 1 : sections.length)}
            />
          </aside>

          <main className="relative min-w-0 flex-1" aria-label="Page preview">
            <PreviewFrame
              pageId={page.id} locale={locale} device={device} document={doc} selectedId={selectedId} labels={labels}
              onSelect={setSelectedId} onInsert={(index) => setAddIndex(index)} onAction={applyAction}
            />
            {loadingTypes && (
              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-zinc-500 shadow" role="status">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading sections…
              </div>
            )}
            {addIndex !== null && (
              <AddSectionPanel definitions={definitions} positionLabel={positionLabel} onPick={(type) => insertAt(type, addPosition)} onClose={() => setAddIndex(null)} />
            )}
          </main>

          {historyOpen && (
            <RevisionsDrawer pageId={page.id} definitions={byType} canRestore={can('RESTORE_PAGES') && page.status !== 'ARCHIVED'}
              restoreBlockedReason={page.status === 'ARCHIVED' ? 'Restore the page from the pages list first.' : 'You do not have permission to restore versions.'}
              onRestore={async (n) => setConfirm({ restore: n })} onClose={() => setHistoryOpen(false)} />
          )}

          <aside className="w-[340px] shrink-0 border-l border-zinc-200 bg-white" aria-label="Settings">
            {selected ? (
              <PropertiesPanel
                key={selected.id} section={selected} sectionIndex={selectedIndex} definition={byType.get(selected.type)} styleFields={styleFields}
                locale={locale} issues={issues} edit={edit}
                onDuplicate={() => applyAction(selected.id, 'duplicate')} onDelete={() => applyAction(selected.id, 'delete')}
              />
            ) : (
              <PageSettingsPanel
                pageId={page.id} doc={doc} slug={editor.slug} everPublished={page.status === 'PUBLISHED' || !!page.publishedAt}
                locale={locale} issues={issues} onSlugChange={editor.setSlug} edit={edit}
              />
            )}
          </aside>
        </div>

        <DragOverlay dropAnimation={null}>
          {dragType && (
            <div className="flex w-44 items-center gap-2 rounded-xl border border-brand-green bg-white p-3 text-xs font-extrabold shadow-xl">
              <SectionIcon type={dragType} className="h-4 w-4 text-brand-green" /> {labels[dragType] ?? dragType}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <PublishDialog
        isOpen={publishOpen} onClose={() => setPublishOpen(false)} slug={editor.slug} doc={doc} definitions={byType}
        prepare={editor.save}
        publish={async (saved) => {
          const live = await pagesService.publish(saved.id, saved.version);
          editor.adopt(live);
          toast.success(`Published. Live at /${live.slug}`);
        }}
        onSelectSection={setSelectedId}
      />

      <ActionModal
        isOpen={confirm !== null} onClose={() => setConfirm(null)} onConfirm={runConfirmed} isLoading={busy}
        variant={confirm === 'archive' ? 'danger' : 'warning'}
        title={isRestore(confirm) ? `Restore version #${confirm.restore}?` : confirm === 'archive' ? 'Archive this page?' : 'Unpublish this page?'}
        description={isRestore(confirm)
          ? 'Your current draft is replaced by this version. It is not published, and the version you are replacing stays in the history.'
          : confirm === 'archive'
            ? 'The page is taken offline and becomes read-only. You can restore it later from the pages list.'
            : 'Visitors will no longer be able to see this page. Your draft stays as it is and you can publish it again.'}
        confirmLabel={isRestore(confirm) ? 'Restore to draft' : confirm === 'archive' ? 'Archive' : 'Unpublish'}
      />
    </div>
  );
}

function isRestore(confirm: Confirm): confirm is { restore: number } {
  return confirm !== null && typeof confirm === 'object';
}

function Banner({ tone, icon, children }: { tone: 'error' | 'warn'; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div role="alert" className={tone === 'error' ? 'flex flex-wrap items-center gap-2 bg-red-600 px-4 py-2 text-xs font-semibold text-white' : 'flex flex-wrap items-center gap-2 bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900'}>
      {icon}{children}
    </div>
  );
}
