'use client';

import React, { useState, useRef } from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Upload, Trash2, RefreshCw } from 'lucide-react';
import { uploadMediaFile } from '@/services/media';

type ImageBlockNodeViewProps = Pick<NodeViewProps, 'editor' | 'node' | 'updateAttributes' | 'selected' | 'getPos'>;

export const ImageBlockNodeView: React.FC<ImageBlockNodeViewProps> = ({
  editor,
  node,
  updateAttributes,
  selected,
  getPos,
}) => {
  const src = node.attrs.src;
  const caption = node.attrs.caption || '';
  const [captionValue, setCaptionValue] = useState(caption);
  const [replacing, setReplacing] = useState(false);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Follow the node attribute when it changes from outside (undo/redo, collaboration) - adjusted during render.
  const [syncedCaption, setSyncedCaption] = useState(caption);
  if (caption !== syncedCaption) {
    setSyncedCaption(caption);
    setCaptionValue(caption);
  }

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setCaptionValue(newVal);
    updateAttributes({ caption: newVal });
  };

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReplacing(true);
    try {
      const url = await uploadMediaFile(file);
      if (url) {
        updateAttributes({ src: url });
      }
    } catch (err) {
      console.error('Failed to replace image:', err);
    } finally {
      setReplacing(false);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = () => {
    if (editor) {
      const currentPos = typeof getPos === 'function' ? getPos() : null;
      if (currentPos !== null && currentPos !== undefined) {
        editor.chain().focus().deleteRange({ from: currentPos, to: currentPos + node.nodeSize }).run();
      } else {
        editor.chain().focus().deleteSelection().run();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      if (editor) {
        const currentPos = typeof getPos === 'function' ? getPos() : null;
        if (currentPos !== null && currentPos !== undefined) {
          const targetPos = currentPos + node.nodeSize;
          editor
            .chain()
            .insertContentAt(targetPos, { type: 'paragraph' })
            .setTextSelection(targetPos + 1)
            .focus()
            .run();
        } else {
          editor.chain().focus().run();
        }
      }
    }
  };

  return (
    <NodeViewWrapper className="my-3 text-center block max-w-2xl mx-auto group relative">
      <input
        type="file"
        ref={replaceFileInputRef}
        accept="image/*"
        onChange={handleReplaceImage}
        className="hidden"
      />

      <div className="relative inline-block w-full">
        {/* Floating Action Bar */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-lg border border-white/10">
          <button
            type="button"
            onClick={() => replaceFileInputRef.current?.click()}
            disabled={replacing}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-white hover:text-emerald-400 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Change / Replace Image"
          >
            {replacing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>{replacing ? 'Uploading...' : 'Change Image'}</span>
          </button>
          <div className="w-px h-3.5 bg-zinc-700" />
          <button
            type="button"
            onClick={handleDeleteImage}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer"
            title="Delete Image"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

        {/* Main Image */}
        {src && (
          <img
            src={src}
            alt={node.attrs.alt || 'Article Image'}
            className={`rounded-2xl max-w-2xl w-full mx-auto block object-cover my-0 mb-0 transition-all ${
              selected ? 'outline-2 outline-[#00A651] outline-offset-2 ring-2 ring-[#00A651]' : ''
            }`}
          />
        )}

        {/* Caption */}
        <div className="mt-1 text-center w-full">
          <input
            type="text"
            value={captionValue}
            onChange={handleCaptionChange}
            onKeyDown={handleKeyDown}
            placeholder="Type caption for image (optional)"
            className="w-full text-center text-xs sm:text-sm text-zinc-600 focus:text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal italic font-sans bg-transparent border-none outline-none focus:outline-none focus:ring-0 py-0.5"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
