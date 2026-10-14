'use client';

import React from 'react';

interface ArticleMetadataFieldsProps {
  title: string;
  setTitle: (v: string) => void;
  summary: string;
  setSummary: (v: string) => void;
}

export const ArticleMetadataFields: React.FC<ArticleMetadataFieldsProps> = ({
  title,
  setTitle,
  summary,
  setSummary,
}) => {
  return (
    <div className="space-y-4 font-serif">
      <div>
        <input
          type="text"
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl sm:text-5xl font-serif text-zinc-950 placeholder:text-zinc-300 focus:outline-none border-none leading-tight bg-transparent"
        />
      </div>

      <div>
        <textarea
          rows={1}
          placeholder="Subtitle / Summary..."
          value={summary}
          onChange={(e) => {
            setSummary(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onFocus={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full text-xl font-serif text-zinc-500 placeholder:text-zinc-300 focus:outline-none border-none leading-relaxed resize-none overflow-hidden bg-transparent"
        />
      </div>
    </div>
  );
};
