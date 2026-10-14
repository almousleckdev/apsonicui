'use client';

import React, { useEffect } from 'react';
import { FloatingMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import { Plus, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingPlusMenuProps {
  editor: Editor | null;
  plusMenuOpen: boolean;
  setPlusMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenImageUpload: () => void;
  onOpenVideoUpload: () => void;
  onOpenVideoModal: () => void;
}

export const EditorFloatingPlusMenu: React.FC<FloatingPlusMenuProps> = ({
  editor,
  plusMenuOpen,
  setPlusMenuOpen,
  onOpenImageUpload,
  onOpenVideoModal,
}) => {
  useEffect(() => {
    if (!editor) return;
    const handleSelectionUpdate = () => {
      setPlusMenuOpen(false);
    };
    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, setPlusMenuOpen]);

  if (!editor) return null;

  return (
    <FloatingMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { $from } = state.selection;
        const currentLineText = $from.parent.textContent;
        return $from.parent.type.name === 'paragraph' && currentLineText === '';
      }}
    >
      <div className="flex items-center gap-2 -ml-12 sm:-ml-14 transition-all">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setPlusMenuOpen((prev) => !prev)}
          className={`w-9 h-9 p-0 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-md ${
            plusMenuOpen
              ? 'border-zinc-800 bg-zinc-900 text-white rotate-45'
              : 'border-zinc-300 bg-white text-zinc-700 hover:text-brand-green hover:border-brand-green hover:bg-zinc-50'
          }`}
          title="Add content"
        >
          <Plus className="w-5 h-5 transition-transform" />
        </Button>

        {plusMenuOpen && (
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-zinc-200 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={onOpenImageUpload}
              className="p-2 text-zinc-600 hover:text-brand-green hover:bg-zinc-100 rounded-full transition-all cursor-pointer"
              title="Add Image from Computer"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenVideoModal}
              className="p-2 text-zinc-600 hover:text-brand-green hover:bg-zinc-100 rounded-full transition-all cursor-pointer"
              title="Add Video Link"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </FloatingMenu>
  );
};
