'use client';

import React from 'react';
import { Video, X } from 'lucide-react';
import { T } from '@/components/admin/T';

interface EditorVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  onInsert: () => void;
}

export const EditorVideoModal: React.FC<EditorVideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  setVideoUrl,
  onInsert,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-zinc-100 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
            <Video className="w-4 h-4 text-brand-green" />
            <span><T id="news.rte.embedVideo" /></span>
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-zinc-500 font-medium">
          <T id="news.rte.embedHint" />
        </p>
        <input
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-brand-green font-medium"
        />
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100"
          >
            <T id="common.cancel" />
          </button>
          <button
            type="button"
            onClick={onInsert}
            className="px-4 py-2 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-green-700 shadow-md shadow-brand-green/20"
          >
            <T id="news.rte.embedButton" />
          </button>
        </div>
      </div>
    </div>
  );
};
