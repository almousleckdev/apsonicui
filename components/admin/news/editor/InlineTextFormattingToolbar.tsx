'use client';

import React from 'react';
import { useAdminText } from '@/context/AdminTextContext';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InlineTextFormattingToolbarProps {
  editor: Editor;
  onOpenLinkEditor: () => void;
}

export const InlineTextFormattingToolbar: React.FC<InlineTextFormattingToolbarProps> = ({
  editor,
  onOpenLinkEditor,
}) => {
  const { t } = useAdminText();
  return (
    <div className="flex items-center gap-1 font-sans">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('bold')
            ? 'bg-brand-green text-white font-black'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.bold')}
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('italic')
            ? 'bg-brand-green text-white font-black'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.italic')}
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('underline')
            ? 'bg-brand-green text-white font-black'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.underline')}
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-brand-green text-white font-black'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.h1')}
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-brand-green text-white font-black'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.h2')}
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-brand-green text-white font-black'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.h3')}
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign('left').run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive({ textAlign: 'left' })
            ? 'bg-brand-green text-white'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.alignLeft')}
      >
        <AlignLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign('center').run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive({ textAlign: 'center' })
            ? 'bg-brand-green text-white'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.alignCenter')}
      >
        <AlignCenter className="w-4 h-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().setTextAlign('right').run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive({ textAlign: 'right' })
            ? 'bg-brand-green text-white'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.alignRight')}
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('bulletList')
            ? 'bg-brand-green text-white'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.bullets')}
      >
        <List className="w-4 h-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('orderedList')
            ? 'bg-brand-green text-white'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.numbers')}
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('blockquote')
            ? 'bg-brand-green text-white'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.quote')}
      >
        <Quote className="w-4 h-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onOpenLinkEditor();
        }}
        className={`w-8 h-8 p-0 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
          editor.isActive('link')
            ? 'bg-brand-green text-white'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
        }`}
        title={t('news.rte.link')}
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
