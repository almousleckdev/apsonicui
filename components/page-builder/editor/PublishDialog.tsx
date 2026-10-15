'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { pagesService } from '@/services/pages';
import { getErrorMessage } from '@/lib/utils/errors';
import type { DocumentIssue, Locale, PageDetail, PageDocument, SectionDefinition, ValidationReport } from '@/lib/page-builder/types';
import { LOCALE_LABELS, LOCALES } from '@/lib/page-builder/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  doc: PageDocument;
  definitions: Map<string, SectionDefinition>;
  /** Saves any pending edits and returns the saved page (so the report covers exactly what will go live). */
  prepare: () => Promise<PageDetail>;
  /** Publishes the version just saved. */
  publish: (page: PageDetail) => Promise<void>;
  onSelectSection: (id: string) => void;
}

type Phase = 'checking' | 'ready' | 'publishing' | 'failed';

/** Turns a server path like sections[2].content.heading.en into words an editor understands. */
export function describeIssue(issue: DocumentIssue, doc: PageDocument, definitions: Map<string, SectionDefinition>): { where: string; sectionId?: string } {
  const match = /^sections\[(\d+)\]\.content\.(.+)$/.exec(issue.path);
  if (match) {
    const section = doc.sections[Number(match[1])];
    const definition = section ? definitions.get(section.type) : undefined;
    const fieldName = match[2].split(/[.[]/)[0];
    // Prefer the field's own label ("Button link") over its technical name ("buttonUrl").
    const field = definition?.fields.find((f) => f.name === fieldName)?.label ?? fieldName.replace(/([A-Z])/g, ' $1').toLowerCase();
    return { where: `Section ${Number(match[1]) + 1} (${definition?.label ?? section?.type ?? 'Section'}) › ${field}`, sectionId: section?.id };
  }
  if (issue.path.startsWith('meta.')) return { where: 'Page settings › title and search text' };
  if (issue.path.startsWith('seo.')) return { where: 'Page settings › search engines' };
  return { where: 'Page' };
}

export function PublishDialog(props: Props) {
  const { isOpen, onClose } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish this page" maxWidthClass="max-w-lg">
      {/* Mounted only while open, so every opening starts a fresh save-and-check. */}
      <PublishBody {...props} />
    </Modal>
  );
}

function PublishBody({ onClose, slug, doc, definitions, prepare, publish, onSelectSection }: Props) {
  const [phase, setPhase] = useState<Phase>('checking');
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [saved, setSaved] = useState<PageDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await prepare();
        const result = await pagesService.validate(page.id);
        if (cancelled) return;
        setSaved(page);
        setReport(result);
        setPhase('ready');
      } catch (e) {
        if (cancelled) return;
        setError(getErrorMessage(e, 'Could not check the page.'));
        setPhase('failed');
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blockers = report?.issues.filter((i) => i.severity === 'ERROR') ?? [];
  const doPublish = async () => {
    if (!saved) return;
    setPhase('publishing');
    try {
      await publish(saved);
      onClose();
    } catch (e) {
      setError(getErrorMessage(e, 'Publishing failed.'));
      setPhase('failed');
    }
  };

  return (
    <div className="space-y-5 font-sans">
        {phase === 'checking' && (
          <p className="flex items-center gap-2 text-sm font-medium text-zinc-600" role="status"><Loader2 className="h-4 w-4 animate-spin" /> Saving and checking the page…</p>
        )}

        {phase === 'failed' && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700"><XCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>
        )}

        {report && phase !== 'checking' && (
          <>
            {blockers.length > 0 ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="flex items-center gap-2 text-sm font-extrabold text-red-700"><XCircle className="h-4 w-4" /> Fix these before publishing</p>
                <ul className="mt-2 space-y-1.5">
                  {blockers.map((issue, i) => {
                    const d = describeIssue(issue, doc, definitions);
                    return (
                      <li key={i} className="text-xs text-red-800">
                        {d.sectionId
                          ? <button type="button" className="text-left font-bold underline underline-offset-2" onClick={() => { onSelectSection(d.sectionId!); onClose(); }}>{d.where}</button>
                          : <span className="font-bold">{d.where}</span>}
                        <span className="block text-red-700/90">{issue.message}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="flex items-center gap-2 rounded-xl bg-brand-green/10 p-3 text-sm font-bold text-brand-green"><CheckCircle2 className="h-4 w-4" /> Ready to publish.</p>
            )}

            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-zinc-400">Translations</p>
              <ul className="space-y-2">
                {LOCALES.map((l: Locale) => {
                  const c = report.completeness[l] ?? { filled: 0, total: 0 };
                  const pct = c.total === 0 ? 100 : Math.round((c.filled / c.total) * 100);
                  return (
                    <li key={l} className="flex items-center gap-3 text-xs">
                      <span className="w-16 font-bold text-zinc-700">{LOCALE_LABELS[l]}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100"><span className={cn('block h-full rounded-full', pct === 100 ? 'bg-brand-green' : 'bg-amber-500')} style={{ width: `${pct}%` }} /></span>
                      <span className="w-20 text-right tabular-nums text-zinc-500">{c.filled}/{c.total} texts</span>
                    </li>
                  );
                })}
              </ul>
              {LOCALES.some((l) => (report.completeness[l]?.filled ?? 0) < (report.completeness[l]?.total ?? 0)) && (
                <p className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-700"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Missing translations show the English text. You can still publish.</p>
              )}
            </div>

            <p className="text-xs text-zinc-500">It will be live at <span className="font-bold text-zinc-800">/{slug}</span> straight away.</p>
          </>
        )}

        <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
          <button type="button" onClick={onClose} disabled={phase === 'publishing'} className="rounded-lg px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100">Cancel</button>
          <button type="button" onClick={doPublish} disabled={phase !== 'ready' || blockers.length > 0}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-50">
            {phase === 'publishing' && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Publish now
          </button>
        </div>

    </div>
  );
}
