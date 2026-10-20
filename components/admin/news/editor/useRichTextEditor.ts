'use client';

import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlignExtension from '@tiptap/extension-text-align';
import { ImageBlock } from '@/components/admin/news/ImageBlockExtension';
import { uploadMediaFile } from '@/services/media';

interface UseRichTextEditorProps {
  contentHtml: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onPlusMenuClose?: () => void;
}

export function useRichTextEditor({
  contentHtml,
  onChange,
  placeholder = 'Tell your story...',
  onPlusMenuClose,
}: UseRichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      UnderlineExtension,
      TextAlignExtension.configure({
        types: ['heading', 'paragraph'],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-green font-bold underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'is-editor-empty before:text-zinc-300 before:content-[attr(data-placeholder)] before:float-left before:pointer-events-none',
      }),
      ImageBlock,
    ],
    content: contentHtml,
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      onChange(html);
    },
    onSelectionUpdate: () => {
      if (onPlusMenuClose) {
        onPlusMenuClose();
      }
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-zinc max-w-none text-zinc-900 leading-relaxed font-serif text-xl sm:text-2xl focus:outline-none min-h-[400px] pb-24',
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.startsWith('image/'));
        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) {
            uploadMediaFile(file)
              .then((url) => {
                if (url && editor) {
                  editor.chain().focus().insertContent({ type: 'imageBlock', attrs: { src: url } }).run();
                }
              })
              .catch((err) => console.error('Pasted image upload error:', err));
          }
          return true;
        }
        return false;
      },
    },
  });

  return editor;
}
