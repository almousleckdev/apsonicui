'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Film, ImageIcon, Loader2, Upload } from 'lucide-react';
import { mediaService } from '@/services/media';
import { useToast } from '@/components/ui/Toast';

interface Props {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
}

const isVideo = (v?: string) => !!v && /\.(mp4|webm|ogg|mov)$/i.test(v);
const isRenderable = (v?: string) => !!v && (v.startsWith('/') || v.startsWith('http')) && !v.startsWith('//');

/** One-line upload control: small thumbnail, file name and a button, instead of a large preview box. */
export function CompactMediaField({ label, value, onChange, accept = 'image/*' }: Props) {
  const { toast } = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const res = await mediaService.uploadFile(file);
      if (res?.fileUrl) {
        onChange(res.fileUrl);
        toast.success('Uploaded. Remember to save your changes.');
      }
    } catch (err) {
      toast.error('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploading(false);
    }
  };

  const name = value ? decodeURIComponent(value.split('/').pop() || value) : 'No file yet';

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 flex items-center justify-center">
        {value && isVideo(value) ? (
          <Film className="w-5 h-5 text-zinc-400" />
        ) : value && isRenderable(value) ? (
          <Image src={value} alt="" fill sizes="64px" unoptimized className="object-contain p-0.5" />
        ) : (
          <ImageIcon className="w-5 h-5 text-zinc-300" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {label && <p className="text-[11px] font-bold text-zinc-700">{label}</p>}
        <p className="text-[11px] text-zinc-400 truncate" title={value}>{name}</p>
      </div>
      <button
        type="button"
        disabled={uploading}
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[11px] font-bold text-zinc-700 disabled:opacity-60 cursor-pointer"
      >
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
        {value ? 'Replace' : 'Upload'}
      </button>
      <input ref={input} type="file" accept={accept} onChange={upload} className="hidden" />
    </div>
  );
}
