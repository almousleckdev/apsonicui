'use client';

import React, { useState } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import { InlineTextFormattingToolbar } from './InlineTextFormattingToolbar';

interface EditorSelectionBubbleMenuProps {
  editor: Editor | null;
}

export const EditorSelectionBubbleMenu: React.FC<EditorSelectionBubbleMenuProps> = ({ editor }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) return null;

  const isImageSelected = editor.isActive('imageBlock') || editor.isActive('image');

  const handleApplyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      let finalUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('/')) {
        finalUrl = `https://${finalUrl}`;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl, target: '_blank' }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const handleOpenLink = () => {
    const existingHref = editor.getAttributes('link').href || '';
    setLinkUrl(existingHref);
    setShowLinkInput(true);
  };

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: 'top',
      }}
      shouldShow={({ editor: curEditor, from, to }) => {
        const isImg = curEditor.isActive('imageBlock') || curEditor.isActive('image');
        const hasSelection = from !== to;
        return hasSelection || isImg;
      }}
    >
      <div className="flex items-center gap-1 bg-zinc-900/95 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-zinc-800 text-white z-50 font-sans">
        {isImageSelected ? (
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-xs font-semibold text-zinc-400">Image Selected</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteSelection().run()}
              className="rounded-xl text-xs gap-1 font-bold text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Image</span>
            </Button>
          </div>
        ) : showLinkInput ? (
          <div className="flex items-center gap-1.5 px-2 py-1">
            <input
              type="url"
              placeholder="Paste or type link URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyLink();
                }
              }}
              autoFocus
              className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-green w-60"
            />
            <button
              type="button"
              onClick={handleApplyLink}
              className="p-1.5 bg-brand-green text-white rounded-xl hover:bg-green-600 transition-all cursor-pointer"
              title="Apply Link"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowLinkInput(false)}
              className="p-1.5 bg-zinc-800 text-zinc-400 rounded-xl hover:text-white transition-all cursor-pointer"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <InlineTextFormattingToolbar
            editor={editor}
            onOpenLinkEditor={handleOpenLink}
          />
        )}
      </div>
    </BubbleMenu>
  );
};
