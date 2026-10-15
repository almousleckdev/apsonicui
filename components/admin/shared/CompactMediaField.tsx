'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Film, ImageIcon, Link2, Loader2, Upload, X } from 'lucide-react';
import { mediaService } from '@/services/media';
import { useToast } from '@/components/ui/Toast';

interface Props {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  /** Lets the editor type or paste an address (a site picture such as /images/x.jpg, or https://...) instead of uploading. */
  allowAddress?: boolean;
}

const isVideo = (v?: string) => !!v && /\.(mp4|webm|ogg|mov)$/i.test(v);
const isRenderable = (v?: string) => !!v && (v.startsWith('/') || v.startsWith('http')) && !v.startsWith('//');

/** One-line upload control: small thumbnail, file name and a button, instead of a large preview box. */
export function CompactMediaField({ label, value, onChange, accept = 'image/*', allowAddress = false }: Props) {
  const { toast } = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [address, setAddress] = useState('');

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

  const apply = () => {
    const next = address.trim();
    if (next) onChange(next);
    setTyping(false);
    setAddress('');
  };

  return (
    <div className="min-w-0">
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
          {label && <p className="text-2xs font-bold text-zinc-700">{label}</p>}
          <p className="text-2xs text-zinc-400 truncate" title={value}>{name}</p>
        </div>
        {value && (
          <button type="button" onClick={() => onChange('')} aria-label="Remove file" title="Remove"
            className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
        )}
        {allowAddress && (
          <button type="button" onClick={() => setTyping((t) => !t)} aria-label="Use an address instead" title="Use an address instead" aria-expanded={typing}
            className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"><Link2 className="w-3.5 h-3.5" /></button>
        )}
        <button
          type="button"
          disabled={uploading}
          onClick={() => input.current?.click()}
          className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-2xs font-bold text-zinc-700 disabled:opacity-60 cursor-pointer"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {value ? 'Replace' : 'Upload'}
        </button>
        <input ref={input} type="file" accept={accept} onChange={upload} className="hidden" />
      </div>
      {typing && (
        <div className="mt-2 flex gap-2">
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); apply(); } }}
            placeholder="/images/photo.jpg or https://…" aria-label="Picture address"
            className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20" />
          <button type="button" onClick={apply} className="shrink-0 rounded-lg bg-brand-green px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-green-hover cursor-pointer">Use</button>
        </div>
      )}
    </div>
  );
}
