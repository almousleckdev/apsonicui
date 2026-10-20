'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageRenderer, type SectionAction } from '@/components/page-builder/renderer/PageRenderer';
import { pagesService } from '@/services/pages';
import { defaultLocale, isSupportedLocale } from '@/lib/i18n/locales';
import { BUILDER_TO_PREVIEW, PREVIEW_TO_BUILDER, type BuilderMessage, type PreviewMessage } from '@/lib/page-builder/messages';
import type { Locale, PageDocument } from '@/lib/page-builder/types';

/**
 * Two ways in:
 *  - {@code ?embed=1}: inside the builder's canvas. The unsaved document arrives from the editor by postMessage
 *    (same origin only) and clicks are sent back, so the editor and the real page stay in step.
 *  - {@code ?token=...}: a signed, expiring link an editor can open or share to see the draft.
 */
export function PreviewClient({ pageId, locale }: { pageId: number; locale: string }) {
  const params = useSearchParams();
  const embed = params.get('embed') === '1';
  const token = params.get('token');
  const lang: Locale = isSupportedLocale(locale) ? locale : defaultLocale;

  const [document, setDocument] = useState<PageDocument | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [fetchError, setError] = useState<string | null>(null);
  const error = !embed && !token ? 'This preview link is incomplete.' : fetchError;

  // Token mode: fetch the draft once.
  useEffect(() => {
    if (embed || !token) return;
    let cancelled = false;
    pagesService.getPreview(pageId, token).then((page) => {
      if (cancelled) return;
      if (page) setDocument(page.document);
      else setError('This preview link has expired or is not valid. Ask for a new one from the page editor.');
    });
    return () => { cancelled = true; };
  }, [embed, token, pageId]);

  // Embed mode: take the document from the editor that opened this frame.
  useEffect(() => {
    if (!embed) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const data = event.data as BuilderMessage | undefined;
      if (!data || data.source !== BUILDER_TO_PREVIEW || data.type !== 'state') return;
      setDocument(data.document);
      setSelectedId(data.selectedId);
      setLabels(data.labels);
    };
    window.addEventListener('message', onMessage);
    send({ source: PREVIEW_TO_BUILDER, type: 'ready' });
    return () => window.removeEventListener('message', onMessage);
  }, [embed]);

  if (error) {
    return <div className="mx-auto max-w-md px-6 py-32 text-center text-sm font-medium text-zinc-600">{error}</div>;
  }
  if (!document) {
    return <div className="px-6 py-32 text-center text-sm text-zinc-400" role="status">Loading preview…</div>;
  }

  return (
    <main className="w-full">
      {!embed && (
        <p className="bg-amber-100 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-amber-900" role="note">
          Draft preview: this page is not published
        </p>
      )}
      <PageRenderer
        document={document}
        locale={lang}
        editing={embed}
        selectedId={selectedId}
        labelFor={(type) => labels[type] ?? type}
        onSelect={(id) => send({ source: PREVIEW_TO_BUILDER, type: 'select', id })}
        onInsert={(index) => send({ source: PREVIEW_TO_BUILDER, type: 'insert', index })}
        onAction={(id, action: SectionAction) => send({ source: PREVIEW_TO_BUILDER, type: 'action', id, action })}
      />
    </main>
  );
}

function send(message: PreviewMessage) {
  window.parent?.postMessage(message, window.location.origin);
}
