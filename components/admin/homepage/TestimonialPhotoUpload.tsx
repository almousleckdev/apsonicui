'use client';

import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2, X } from 'lucide-react';
import { uploadMediaFile } from '@/services/media';
import { useToast } from '@/components/ui/Toast';
import { getErrorMessage } from '@/lib/utils/errors';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/gif';

interface TestimonialPhotoUploadProps {
  value: string;
  name: string;
  onChange: (url: string) => void;
}

/** Round photo picker. Upload only: the stored value is always a path on this site, never a typed-in address. */
export const TestimonialPhotoUpload: React.FC<TestimonialPhotoUploadProps> = ({ value, name, onChange }) => {
  const { toast } = useToast();
  const { t } = useAdminText();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error(t('home.photo.tooLarge'));
      return;
    }
    setUploading(true);
    try {
      onChange(await uploadMediaFile(file));
      toast.success(t('home.photo.uploaded'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('home.photo.failed')));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label={value ? t('home.photo.change', { name: name || t('home.photo.thisPerson') }) : t('home.photo.upload')}
          className="group relative h-16 w-16 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-green/40"
        >
          {value ? (
            <Image src={value} alt="" fill sizes="64px" unoptimized className="object-cover" />
          ) : (
            <Camera className="h-5 w-5 text-zinc-400" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </span>
          {uploading && !value && <Loader2 className="absolute h-5 w-5 animate-spin text-brand-green" />}
        </button>
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label={t('home.photo.remove')}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white shadow cursor-pointer hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <input ref={inputRef} type="file" accept={ACCEPTED_TYPES} onChange={handleFile} className="hidden" />
      </div>
      <div className="text-2xs leading-snug text-zinc-500">
        <p className="font-bold text-zinc-700"><T id="home.photo.label" /></p>
        <p><T id={value ? 'home.photo.hintChange' : 'home.photo.hintUpload'} /></p>
      </div>
    </div>
  );
};
