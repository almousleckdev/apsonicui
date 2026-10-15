'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  /** One line shown next to the title while the card is closed, e.g. "3 items". */
  summary?: string;
  defaultOpen?: boolean;
  /** Controls kept in the header (language tabs, "Add" button). */
  actions?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
}

/** A section that can be folded away, so long admin pages stay short. */
export function CollapsibleCard({ title, summary, defaultOpen = true, actions, id, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-left cursor-pointer min-w-0"
        >
          <ChevronDown className={`w-4 h-4 shrink-0 text-zinc-400 transition-transform ${open ? '' : '-rotate-90'}`} />
          <h2 className="text-sm font-black text-zinc-900 truncate">{title}</h2>
          {summary && <span className="text-2xs font-medium text-zinc-400 truncate">{summary}</span>}
        </button>
        {open && actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {open && <div className="px-4 pb-4 border-t border-zinc-50 pt-3">{children}</div>}
    </section>
  );
}
