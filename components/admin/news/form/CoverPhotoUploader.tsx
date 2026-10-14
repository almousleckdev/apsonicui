'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, ImageIcon, Loader2 } from 'lucide-react';
import { uploadMediaFile } from '@/services/media';

interface CoverPhotoUploaderProps {
  coverImageUrl: string;
  setCoverImageUrl: (url: string) => void;
  uploadingCover: boolean;
  setUploadingCover: (loading: boolean) => void;
  setErrorMsg: (msg: string | null) => void;
}

export const CoverPhotoUploader: React.FC<CoverPhotoUploaderProps> = ({
  coverImageUrl,
  setCoverImageUrl,
  uploadingCover,
  setUploadingCover,
  setErrorMsg,
}) => {
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadMediaFile(file);
      if (url) setCoverImageUrl(url);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to upload cover image from computer.');
    } finally {
      setUploadingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  return (
    <div className="font-sans">
      <input
        type="file"
        ref={coverFileInputRef}
        accept="image/*"
        onChange={handleCoverUpload}
        className="hidden"
      />

      {coverImageUrl ? (
        <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-3xl overflow-hidden border border-zinc-200 shadow-sm group">
          <Image
            src={coverImageUrl}
            alt="Cover Banner"
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => coverFileInputRef.current?.click()}
              disabled={uploadingCover}
              className="px-4 py-2 bg-white text-zinc-900 font-bold text-xs rounded-xl shadow-lg hover:bg-zinc-100 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Change Cover Image</span>
            </button>
            <button
              type="button"
              onClick={() => setCoverImageUrl('')}
              className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-red-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => coverFileInputRef.current?.click()}
          className="w-full py-10 px-6 rounded-3xl border-2 border-dashed border-zinc-200 hover:border-brand-green bg-zinc-50/50 hover:bg-zinc-50 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer group"
        >
          {uploadingCover ? (
            <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
          ) : (
            <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-105 transition-transform">
              <ImageIcon className="w-6 h-6 text-brand-green" />
            </div>
          )}
          <span className="text-xs font-extrabold text-zinc-800">
            {uploadingCover ? 'Uploading Banner...' : 'Add Cover Image (Optional Header Banner)'}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            Upload article hero image directly from your computer
          </span>
        </div>
      )}
    </div>
  );
};
