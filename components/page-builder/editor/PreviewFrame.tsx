'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { defaultLocale } from '@/lib/i18n/locales';
import { BUILDER_TO_PREVIEW, PREVIEW_TO_BUILDER, type PreviewMessage } from '@/lib/page-builder/messages';
import type { Locale, PageDocument } from '@/lib/page-builder/types';

export type Device = 'desktop' | 'tablet' | 'mobile';
export const DEVICE_WIDTHS: Record<Device, number> = { desktop: 1280, tablet: 820, mobile: 390 };

interface Props {
  pageId: number;
  locale: Locale;
  device: Device;
  document: PageDocument;
  selectedId: string | null;
  labels: Record<string, string>;
  onSelect: (id: string | null) => void;
  onInsert: (index: number) => void;
  onAction: (id: string, action: Extract<PreviewMessage, { type: 'action' }>['action']) => void;
}

/**
 * The canvas: the real public page in a same-origin iframe. The frame has the device's true width, so Tailwind's
 * breakpoints apply exactly as on a visitor's screen; it is scaled down to fit the available space.
 * The unsaved document is pushed into the frame with postMessage, so edits show instantly.
 */
export function PreviewFrame({ pageId, locale, device, document, selectedId, labels, onSelect, onInsert, onAction }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [readyFor, setReadyFor] = useState<string | null>(null);

  const src = `${locale === defaultLocale ? '' : `/${locale}`}/preview/pages/${pageId}?embed=1`;
  const ready = readyFor === src;

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Messages coming back from the frame (clicks, toolbar actions).
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      const data = event.data as PreviewMessage | undefined;
      if (!data || data.source !== PREVIEW_TO_BUILDER) return;
      if (data.type === 'ready') setReadyFor(src);
      else if (data.type === 'select') onSelect(data.id);
      else if (data.type === 'insert') onInsert(data.index);
      else if (data.type === 'action') onAction(data.id, data.action);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [src, onSelect, onInsert, onAction]);

  // Push the current document whenever it (or the selection) changes.
  useEffect(() => {
    if (!ready) return;
    frame.current?.contentWindow?.postMessage(
      { source: BUILDER_TO_PREVIEW, type: 'state', document, selectedId, labels },
      window.location.origin,
    );
  }, [ready, document, selectedId, labels]);

  const deviceWidth = DEVICE_WIDTHS[device];
  const available = Math.max(0, size.width - 32);
  const scale = available > 0 ? Math.min(1, available / deviceWidth) : 1;
  const frameHeight = Math.max(0, size.height - 32);

  return (
    <div ref={area} className="relative h-full w-full overflow-hidden bg-zinc-200/70 p-4">
      <div className="mx-auto" style={{ width: deviceWidth * scale, height: frameHeight }}>
        <div
          className={cn('origin-top-left overflow-hidden bg-white shadow-xl ring-1 ring-black/10', device !== 'desktop' && 'rounded-[28px] ring-4 ring-zinc-800/80')}
          style={{ width: deviceWidth, height: scale > 0 ? frameHeight / scale : frameHeight, transform: `scale(${scale})` }}
        >
          <iframe
            key={src}
            ref={frame}
            src={src}
            title={`Page preview (${device})`}
            className="h-full w-full border-0"
          />
        </div>
      </div>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100/70" role="status">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-zinc-600 shadow">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading preview…
          </span>
        </div>
      )}
    </div>
  );
}
