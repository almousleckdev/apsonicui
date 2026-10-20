'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ChevronDown, FileText, Heading, Home, Link2, Loader2, Plus, RotateCcw } from 'lucide-react';
import { ActionModal } from '@/components/admin/ActionModal';
import { LanguageTabs, type AdminLang } from '@/components/admin/shared/LanguageTabs';
import { useToast } from '@/components/ui/Toast';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import type { AdminKey } from '@/lib/i18n/admin/catalog';
import { ApiError } from '@/services/api-client';
import { navigationService } from '@/services/navigation';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/utils/errors';
import { localized } from '@/lib/page-builder/document';
import { countItems, find, flatten, insertAfter, moveDown, moveTo, moveUp, newMenuItem, remove, treesEqual, update, warningsFor } from '@/lib/navigation/tree';
import { starterFooter } from '@/lib/navigation/starter';
import { BUILT_IN_ROUTES, MENU_MAX_DEPTH, type ItemKind, type MenuItem, type MenuKey, type MenuView } from '@/lib/navigation/types';
import { ItemForm } from './ItemForm';
import { MenuItemRow } from './MenuItemRow';
import { MenuPreview } from './MenuPreview';

const MENU_NAME: Record<MenuKey, AdminKey> = { header: 'navigation.menuName.header', footer: 'navigation.menuName.footer' };
const ADD_OPTIONS: Array<{ kind: ItemKind; label: AdminKey; hint: AdminKey; Icon: typeof FileText }> = [
  { kind: 'PAGE', label: 'navigation.add.page', hint: 'navigation.add.pageHint', Icon: FileText },
  { kind: 'ROUTE', label: 'navigation.add.route', hint: 'navigation.add.routeHint', Icon: Home },
  { kind: 'EXTERNAL', label: 'navigation.add.external', hint: 'navigation.add.externalHint', Icon: Link2 },
  { kind: 'GROUP', label: 'navigation.add.group', hint: 'navigation.add.groupHint', Icon: Heading },
];

interface Problem { path: string; message: string }

/** Loads one menu, then hands it to the editor. */
export function MenuEditor({ menu }: { menu: MenuKey }) {
  const { t } = useAdminText();
  const [view, setView] = useState<MenuView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    navigationService.get(menu)
      .then((v) => { if (!cancelled) setView(v); })
      .catch((e) => { if (!cancelled) setError(getErrorMessage(e, t('navigation.loadFailed'))); });
    return () => { cancelled = true; };
  }, [menu, t]);

  if (error) return <p role="alert" className="rounded-xl bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</p>;
  if (!view) return <div className="flex items-center justify-center gap-2 py-24 text-sm font-medium text-zinc-500" role="status"><Loader2 className="h-5 w-5 animate-spin" /> {t('navigation.loading', { menu: t(MENU_NAME[menu]) })}</div>;
  return <MenuEditorBody menu={menu} initial={view} />;
}

function MenuEditorBody({ menu, initial }: { menu: MenuKey; initial: MenuView }) {
  const { toast } = useToast();
  const { t } = useAdminText();
  const maxDepth = MENU_MAX_DEPTH[menu];
  const [server, setServer] = useState(initial);
  // A footer nobody has customised yet starts from the standard layout, so the team edits what they can see.
  const [items, setItems] = useState<MenuItem[]>(() => (menu === 'footer' && !initial.configured && initial.draft.length === 0 ? starterFooter() : initial.draft));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [locale, setLocale] = useState<AdminLang>('en');
  const [busy, setBusy] = useState<'save' | 'publish' | 'discard' | 'original' | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [conflict, setConflict] = useState(false);
  const [confirm, setConfirm] = useState<'publish' | 'discard' | 'original' | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const { data: pageOptions = [] } = useQuery({ queryKey: ['nav-page-options'], queryFn: () => navigationService.pageOptions() });
  const pagesById = useMemo(() => new Map(pageOptions.map((p) => [p.id, p])), [pageOptions]);

  const dirty = !treesEqual(items, server.draft);
  const flat = useMemo(() => flatten(items), [items]);
  const selected = selectedId ? find(items, selectedId) : undefined;
  const usedPageIds = useMemo(() => new Set(flat.flatMap((f) => (f.item.pageId ? [f.item.pageId] : []))), [flat]);
  const usedRoutes = useMemo(() => new Set(flat.flatMap((f) => (f.item.route ? [f.item.route] : []))), [flat]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const onDragEnd = (e: DragEndEvent) => { if (e.over) setItems((current) => moveTo(current, String(e.active.id), String(e.over!.id), maxDepth)); };

  const labelFor = useCallback((item: MenuItem) => localized(item.labels, locale) || t(item.kind === 'GROUP' ? 'navigation.labelFallback.group' : 'navigation.labelFallback.item'), [locale, t]);
  const subtitleFor = (item: MenuItem) => {
    if (item.kind === 'PAGE') { const p = item.pageId ? pagesById.get(item.pageId) : undefined; return p ? `/${p.slug}${p.status !== 'PUBLISHED' ? ` · ${t(p.status === 'DRAFT' ? 'common.draft' : 'common.archived')}` : ''}` : t('navigation.itemSubtitle.noPage'); }
    if (item.kind === 'ROUTE') { const route = BUILT_IN_ROUTES.find((r) => r.route === item.route); return item.route ? (route ? t(route.label) : item.route) : t('navigation.itemSubtitle.noPage'); }
    if (item.kind === 'EXTERNAL') return item.url || t('navigation.itemSubtitle.noAddress');
    return item.children.length > 0 ? t('navigation.itemSubtitle.headingItems', { count: item.children.length }) : t('navigation.itemSubtitle.headingEmpty');
  };

  /** Turns a server path like items[1].children[0].labels.en into the name of the item it refers to. */
  const describeProblem = (path: string): { who: string; id?: string } => {
    const steps = [...path.matchAll(/(?:items|children)\[(\d+)\]/g)].map((m) => Number(m[1]));
    let list = items;
    let target: MenuItem | undefined;
    for (const index of steps) { target = list[index]; if (!target) break; list = target.children; }
    return target ? { who: localized(target.labels, 'en') || t('navigation.untitledItem'), id: target.id } : { who: t('navigation.menuWord') };
  };

  const adopt = (view: MenuView) => { setServer(view); setItems(view.draft); setProblems([]); setConflict(false); };

  const run = async (kind: 'save' | 'publish' | 'discard' | 'original', action: () => Promise<MenuView>, success: string): Promise<boolean> => {
    setBusy(kind);
    try {
      adopt(await action());
      toast.success(success);
      return true;
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) setConflict(true);
      else if (e instanceof ApiError && e.details?.errors?.length) setProblems(e.details.errors.map((x) => ({ path: x.field, message: x.message })));
      else toast.error(getErrorMessage(e, t('navigation.done.failed')));
      return false;
    } finally {
      setBusy(null);
    }
  };

  const publish = async () => {
    setConfirm(null);
    if (dirty) {
      setBusy('save');
      try {
        const saved = await navigationService.saveDraft(menu, server.version, items);
        setServer(saved);
        setBusy(null);
        await run('publish', () => navigationService.publish(menu, saved.version), t('navigation.done.live', { menu: t(MENU_NAME[menu]) }));
      } catch (e) {
        setBusy(null);
        if (e instanceof ApiError && e.status === 409) setConflict(true);
        else if (e instanceof ApiError && e.details?.errors?.length) setProblems(e.details.errors.map((x) => ({ path: x.field, message: x.message })));
        else toast.error(getErrorMessage(e, t('navigation.done.failed')));
      }
      return;
    }
    await run('publish', () => navigationService.publish(menu, server.version), t('navigation.done.live', { menu: t(MENU_NAME[menu]) }));
  };
  const discard = async () => { setConfirm(null); await run('discard', () => navigationService.discard(menu, server.version), t('navigation.done.backToPublished')); };
  const useOriginal = async () => { setConfirm(null); await run('original', () => navigationService.resetToOriginal(menu, server.version), t('navigation.originalBack')); };
  const reload = async () => { try { adopt(await navigationService.get(menu)); toast.success(t('navigation.done.loadedLatest')); } catch (e) { toast.error(getErrorMessage(e, t('navigation.done.reloadFailed'))); } };

  const removeSelected = async () => {
    if (!selected) return;
    setRemoving(true);
    try {
      const saved = await navigationService.trashItem(menu, selected, localized(selected.labels, 'en') || t('navigation.untitledItem'));
      // The server already dropped the item from the saved draft; keep any other edits made on this screen.
      setServer(saved);
      setItems((c) => remove(c, selected.id));
      setSelectedId(null);
      setConfirmRemove(false);
    } catch (e) {
      toast.error(getErrorMessage(e, t('navigation.form.removeFailed')));
    } finally {
      setRemoving(false);
    }
  };

  const add = (kind: ItemKind) => {
    const item = newMenuItem(kind);
    // With a section title selected, a new link goes inside that section.
    if (selected?.kind === 'GROUP' && kind !== 'GROUP') setItems((current) => update(current, selected.id, (g) => ({ ...g, children: [...g.children, item] })));
    else setItems((current) => insertAfter(current, selected ? selected.id : null, item));
    setSelectedId(item.id);
    setAddOpen(false);
  };

  const total = countItems(items);
  const publishDisabled = busy !== null || (!dirty && !server.hasUnpublishedChanges && server.configured);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <StatusChip server={server} dirty={dirty} />
          <p className="text-xs text-zinc-500">{t('navigation.count', { count: total })}{!server.configured && menu === 'footer' ? ` · ${t('navigation.replacesFooter')}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {(dirty || server.hasUnpublishedChanges) && server.configured && (
            <button type="button" onClick={() => (dirty ? setItems(server.draft) : setConfirm('discard'))} disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 disabled:opacity-50">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> <T id={dirty ? 'navigation.undoChanges' : 'navigation.backToPublished'} />
            </button>
          )}
          {menu === 'footer' && server.configured && (
            <button type="button" onClick={() => setConfirm('original')} disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 disabled:opacity-50">
              <T id="navigation.useOriginal" />
            </button>
          )}
          <button type="button" onClick={() => setConfirm('publish')} disabled={publishDisabled}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-50">
            {(busy === 'publish') && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />} <T id="navigation.publish" />
          </button>
        </div>
      </div>

      {conflict && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white">
          <AlertTriangle className="h-4 w-4" aria-hidden /> <T id="navigation.conflict" />
          <button type="button" onClick={reload} className="rounded-md bg-white px-2.5 py-1 font-bold text-red-700"><T id="navigation.loadLatest" /></button>
        </div>
      )}
      {problems.length > 0 && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-extrabold text-red-700"><AlertTriangle className="h-4 w-4" aria-hidden /> <T id="navigation.fixFirst" /></p>
          <ul className="mt-1.5 space-y-1">
            {problems.map((p, i) => { const d = describeProblem(p.path); return (
              <li key={i} className="text-xs text-red-800">
                {d.id ? <button type="button" onClick={() => setSelectedId(d.id!)} className="font-bold underline underline-offset-2">{d.who}</button> : <span className="font-bold">{d.who}</span>}
                <span className="ml-1.5">{p.message}</span>
              </li>); })}
          </ul>
        </div>
      )}

      <section aria-labelledby="preview-heading" className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 id="preview-heading" className="text-2xs font-extrabold uppercase tracking-[0.15em] text-zinc-400"><T id="navigation.previewTitle" /></h2>
          <LanguageTabs value={locale} onChange={setLocale} />
        </div>
        <MenuPreview menu={menu} items={items} locale={locale} pages={pagesById} />
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section aria-label={t('navigation.itemsTitle')} className="rounded-2xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-extrabold text-zinc-900"><T id="navigation.itemsTitle" /></h2>
              <p className="text-2xs text-zinc-500"><T id="navigation.itemsHint" /></p>
            </div>
            <div className="relative">
              <button type="button" onClick={() => setAddOpen((o) => !o)} aria-haspopup="menu" aria-expanded={addOpen}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-3.5 py-2 text-xs font-extrabold text-white hover:bg-brand-green-hover">
                <Plus className="h-4 w-4" aria-hidden /> <T id="navigation.addItem" /> <ChevronDown className="h-3.5 w-3.5 opacity-80" aria-hidden />
              </button>
              {addOpen && (
                <div role="menu" className="absolute right-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-xl">
                  {ADD_OPTIONS.map(({ kind, label, hint, Icon }) => (
                    <button key={kind} type="button" role="menuitem" onClick={() => add(kind)} className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-zinc-50">
                      <Icon className="mt-0.5 h-4 w-4 text-brand-green" aria-hidden />
                      <span><span className="block text-xs font-bold text-zinc-800"><T id={label} /></span><span className="block text-2xs text-zinc-500"><T id={hint} /></span></span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="p-3">
            {flat.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500"><T id="navigation.empty" /></p>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={flat.map((f) => f.item.id)} strategy={verticalListSortingStrategy}>
                  <ul className="space-y-1.5">
                    {flat.map((f) => {
                      return (
                        <MenuItemRow key={f.item.id} item={f.item} depth={f.depth} label={labelFor(f.item)} subtitle={subtitleFor(f.item)} selected={f.item.id === selectedId}
                          warnings={warningsFor(f.item)} canMoveUp={f.index > 0} canMoveDown={f.index < f.siblings - 1}
                          onSelect={() => setSelectedId(f.item.id)}
                          onUp={() => setItems((c) => moveUp(c, f.item.id))} onDown={() => setItems((c) => moveDown(c, f.item.id))}
                          />
                      );
                    })}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </section>

        <aside aria-label={t('navigation.settingsTitle')} className="self-start rounded-2xl border border-zinc-200 bg-white lg:sticky lg:top-4">
          <div className="border-b border-zinc-100 px-4 py-3">
            <h2 className="text-sm font-extrabold text-zinc-900"><T id={selected ? 'navigation.settingsTitle' : 'navigation.noSelection'} /></h2>
          </div>
          <div className="p-4">
            {selected ? (
              <ItemForm key={selected.id} item={selected} pages={pageOptions} usedPageIds={usedPageIds} usedRoutes={usedRoutes}
                issues={problems.filter((p) => describeProblem(p.path).id === selected.id).map((p) => p.message)}
                onChange={(change) => setItems((c) => update(c, selected.id, change))}
                onRemove={() => setConfirmRemove(true)} />
            ) : (
              <p className="text-xs text-zinc-500"><T id="navigation.selectHint" /></p>
            )}
          </div>
        </aside>
      </div>

      <ActionModal
        isOpen={confirm === 'publish'} onClose={() => setConfirm(null)} onConfirm={publish} variant="brand"
        title={t('navigation.confirmPublish', { menu: t(MENU_NAME[menu]) })}
        description={`${t('navigation.confirmPublishText')}${menu === 'footer' ? ` ${t('navigation.confirmPublishFooter')}` : ''}`}
        confirmLabel={<T id="navigation.publish" />} />
      <ActionModal
        isOpen={confirmRemove && !!selected} onClose={() => setConfirmRemove(false)} onConfirm={removeSelected} variant="danger" isLoading={removing}
        title={t('navigation.form.confirmTitle')}
        description={selected ? t(selected.children.length > 0 ? 'navigation.form.confirmTextWithDropdown' : 'navigation.form.confirmText', { name: labelFor(selected) }) : ''}
        confirmLabel={<T id="navigation.form.remove" />} />
      <ActionModal
        isOpen={confirm === 'original'} onClose={() => setConfirm(null)} onConfirm={useOriginal} variant="warning"
        title={t('navigation.confirmOriginal')} description={t('navigation.confirmOriginalText')} confirmLabel={<T id="navigation.useOriginal" />} />
      <ActionModal
        isOpen={confirm === 'discard'} onClose={() => setConfirm(null)} onConfirm={discard} variant="warning"
        title={t('navigation.confirmDiscard')} description={t('navigation.confirmDiscardText')} confirmLabel={<T id="navigation.discardDraft" />} />
    </div>
  );
}

function StatusChip({ server, dirty }: { server: MenuView; dirty: boolean }) {
  const text: AdminKey = dirty ? 'navigation.status.unsaved' : server.hasUnpublishedChanges ? 'navigation.status.draftNotPublished' : server.configured ? 'navigation.status.published' : 'navigation.status.notPublishedYet';
  const tone = dirty ? 'bg-amber-100 text-amber-800' : server.hasUnpublishedChanges || !server.configured ? 'bg-zinc-100 text-zinc-600' : 'bg-brand-green/10 text-brand-green';
  return <span className={cn('rounded-full px-3 py-1 text-2xs font-extrabold uppercase tracking-wider', tone)}><T id={text} /></span>;
}
