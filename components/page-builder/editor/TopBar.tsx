'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Archive, Check, CloudOff, Copy, ExternalLink, Loader2, MoreHorizontal, Monitor, Redo2, Smartphone, Tablet, Undo2, Undo, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageTabs, type AdminLang } from '@/components/admin/shared/LanguageTabs';
import type { SaveLabel } from '@/hooks/page-builder/usePageEditor';
import type { PageStatus } from '@/lib/page-builder/types';
import type { Device } from './PreviewFrame';

const STATUS_STYLES: Record<PageStatus, string> = {
  DRAFT: 'bg-amber-100 text-amber-800',
  PUBLISHED: 'bg-brand-green/10 text-brand-green',
  ARCHIVED: 'bg-zinc-200 text-zinc-600',
};

interface Props {
  title: string;
  slug: string;
  status: PageStatus;
  hasUnpublishedChanges: boolean;
  saveLabel: SaveLabel;
  device: Device;
  locale: AdminLang;
  canUndo: boolean;
  canRedo: boolean;
  canPublish: boolean;
  canManage: boolean;
  publishLabel: string;
  publishDisabled: boolean;
  onDevice: (d: Device) => void;
  onLocale: (l: AdminLang) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSettings: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onSaveNow: () => void;
  onDuplicate: () => void;
  onUnpublish: () => void;
  onArchive: () => void;
}

const DEVICES: Array<{ id: Device; label: string; Icon: typeof Monitor }> = [
  { id: 'desktop', label: 'Desktop', Icon: Monitor },
  { id: 'tablet', label: 'Tablet', Icon: Tablet },
  { id: 'mobile', label: 'Mobile', Icon: Smartphone },
];

export function TopBar(p: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3">
      <Link href="/admin/pages" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Pages
      </Link>
      <div className="h-6 w-px bg-zinc-200" aria-hidden />

      <button type="button" onClick={p.onSettings} className="group flex min-w-0 max-w-[260px] flex-col items-start rounded-lg px-2 py-1 text-left hover:bg-zinc-100" title="Page settings">
        <span className="flex w-full items-center gap-1.5">
          <span className="truncate text-sm font-extrabold text-zinc-900">{p.title || 'Untitled page'}</span>
          <Settings2 className="h-3.5 w-3.5 shrink-0 text-zinc-400 group-hover:text-zinc-700" aria-hidden />
        </span>
        <span className="truncate text-[11px] text-zinc-500">/{p.slug}</span>
      </button>

      <span className={cn('hidden rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider sm:inline', STATUS_STYLES[p.status])}>
        {p.status === 'PUBLISHED' && p.hasUnpublishedChanges ? 'Published · changes not live' : p.status}
      </span>

      <div className="mx-auto flex items-center gap-3">
        <div role="radiogroup" aria-label="Preview size" className="inline-flex rounded-xl bg-zinc-100 p-0.5">
          {DEVICES.map(({ id, label, Icon }) => (
            <button key={id} type="button" role="radio" aria-checked={p.device === id} aria-label={label} title={label} onClick={() => p.onDevice(id)}
              className={cn('rounded-lg p-1.5 transition-colors', p.device === id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800')}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <LanguageTabs value={p.locale} onChange={p.onLocale} />
      </div>

      <SaveChip label={p.saveLabel} onSaveNow={p.onSaveNow} />

      <div className="flex items-center">
        <BarButton label="Undo (Ctrl/⌘ Z)" disabled={!p.canUndo} onClick={p.onUndo}><Undo2 className="h-4 w-4" /></BarButton>
        <BarButton label="Redo (Ctrl/⌘ Shift Z)" disabled={!p.canRedo} onClick={p.onRedo}><Redo2 className="h-4 w-4" /></BarButton>
      </div>

      <button type="button" onClick={p.onPreview}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50">
        <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Preview
      </button>

      <button type="button" onClick={p.onPublish} disabled={!p.canPublish || p.publishDisabled}
        title={p.canPublish ? undefined : 'You do not have permission to publish pages'}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-50">
        {p.publishLabel}
      </button>

      <MoreMenu {...p} />
    </header>
  );
}

function BarButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled}
      className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-30">
      {children}
    </button>
  );
}

function SaveChip({ label, onSaveNow }: { label: SaveLabel; onSaveNow: () => void }) {
  const config: Record<SaveLabel, { text: string; icon: React.ReactNode; tone: string }> = {
    saved: { text: 'All changes saved', icon: <Check className="h-3.5 w-3.5" />, tone: 'text-zinc-500' },
    unsaved: { text: 'Unsaved changes', icon: <span className="h-2 w-2 rounded-full bg-amber-500" />, tone: 'text-amber-700' },
    saving: { text: 'Saving…', icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, tone: 'text-zinc-500' },
    error: { text: 'Could not save', icon: <AlertTriangle className="h-3.5 w-3.5" />, tone: 'text-red-600' },
    conflict: { text: 'Changed by someone else', icon: <AlertTriangle className="h-3.5 w-3.5" />, tone: 'text-red-600' },
    offline: { text: 'Offline, will retry', icon: <CloudOff className="h-3.5 w-3.5" />, tone: 'text-amber-700' },
  };
  const c = config[label];
  return (
    <button type="button" onClick={onSaveNow} disabled={label === 'saved' || label === 'saving' || label === 'conflict'} aria-live="polite" title="Save now (Ctrl/⌘ S)"
      className={cn('hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold lg:inline-flex', c.tone, label === 'unsaved' && 'hover:bg-amber-50')}>
      {c.icon}{c.text}
    </button>
  );
}

function MoreMenu(p: Props) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!wrapper.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const item = (label: string, Icon: typeof Copy, action: () => void, danger = false) => (
    <button type="button" role="menuitem" onClick={() => { setOpen(false); action(); }}
      className={cn('flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-bold', danger ? 'text-red-600 hover:bg-red-50' : 'text-zinc-700 hover:bg-zinc-50')}>
      <Icon className="h-4 w-4" aria-hidden /> {label}
    </button>
  );

  return (
    <div ref={wrapper} className="relative">
      <BarButton label="More actions" onClick={() => setOpen((o) => !o)}><MoreHorizontal className="h-4 w-4" /></BarButton>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-xl">
          {item('Duplicate page', Copy, p.onDuplicate)}
          {p.canManage && p.status === 'PUBLISHED' && item('Unpublish', Undo, p.onUnpublish)}
          {p.canManage && p.status !== 'ARCHIVED' && item('Archive page', Archive, p.onArchive, true)}
        </div>
      )}
    </div>
  );
}
