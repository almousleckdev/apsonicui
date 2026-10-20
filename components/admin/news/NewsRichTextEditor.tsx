'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EditorContent } from '@tiptap/react';
import { useAdminText } from '@/context/AdminTextContext';
import { uploadMediaFile } from '@/services/media';
import { EditorFloatingPlusMenu } from './editor/EditorFloatingPlusMenu';
import { EditorSelectionBubbleMenu } from './editor/EditorSelectionBubbleMenu';
import { EditorVideoModal } from './editor/EditorVideoModal';
import { useRichTextEditor } from './editor/useRichTextEditor';

interface NewsRichTextEditorProps {
  contentHtml: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const NewsRichTextEditor: React.FC<NewsRichTextEditorProps> = ({
  contentHtml,
  onChange,
  placeholder,
}) => {
  const { t } = useAdminText();
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const editor = useRichTextEditor({
    contentHtml,
    onChange,
    placeholder: placeholder ?? t('news.rte.storyPlaceholder'),
    onPlusMenuClose: () => setPlusMenuOpen(false),
  });

  useEffect(() => {
    if (editor && contentHtml) {
      if (editor.getHTML() !== contentHtml) {
        queueMicrotask(() => {
          if (!editor.isDestroyed) {
            editor.commands.setContent(contentHtml, { emitUpdate: false });
          }
        });
      }
    }
  }, [contentHtml, editor]);

  const handleImageUploadFromComputer = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      const url = await uploadMediaFile(file);
      if (url) {
        editor.chain().focus().insertContent({ type: 'imageBlock', attrs: { src: url } }).run();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPlusMenuOpen(false);
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    }
  };

  const handleAddVideo = () => {
    if (!videoUrlInput.trim() || !editor) return;
    let embedUrl = videoUrlInput.trim();
    if (embedUrl.includes('youtube.com/watch?v=')) {
      const videoId = embedUrl.split('v=')[1]?.split('&')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (embedUrl.includes('youtu.be/')) {
      const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    editor
      .chain()
      .focus()
      .insertContent(
        `<div className="my-8"><iframe src="${embedUrl}" className="w-full aspect-video rounded-2xl border border-zinc-200" allowFullScreen></iframe></div>`
      )
      .run();
    setVideoModalOpen(false);
    setPlusMenuOpen(false);
    setVideoUrlInput('');
  };

  return (
    <div className="relative min-h-[350px] font-sans pb-12">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={imageFileInputRef}
        onChange={handleImageUploadFromComputer}
        accept="image/*"
        className="hidden"
      />

      {/* Tiptap Editor Content Area */}
      <div className="prose prose-zinc max-w-none focus:outline-none min-h-[300px]">
        <EditorContent editor={editor} />
      </div>

      {/* Medium-style Floating (+) Action Menu */}
      <EditorFloatingPlusMenu
        editor={editor}
        plusMenuOpen={plusMenuOpen}
        setPlusMenuOpen={setPlusMenuOpen}
        onOpenImageUpload={() => imageFileInputRef.current?.click()}
        onOpenVideoUpload={() => {}}
        onOpenVideoModal={() => setVideoModalOpen(true)}
      />

      {/* Medium-style Selection Bubble Menu for Formatting */}
      <EditorSelectionBubbleMenu editor={editor} />

      {/* Video URL Modal */}
      <EditorVideoModal
        isOpen={videoModalOpen}
        videoUrl={videoUrlInput}
        setVideoUrl={setVideoUrlInput}
        onClose={() => setVideoModalOpen(false)}
        onInsert={handleAddVideo}
      />
    </div>
  );
};
