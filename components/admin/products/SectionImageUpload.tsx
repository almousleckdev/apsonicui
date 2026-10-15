import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { mediaService } from '@/services/media';
import { useToast } from '@/components/ui/Toast';

interface SectionImageUploadProps {
  label: string;
  description?: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
}

export const SectionImageUpload: React.FC<SectionImageUploadProps> = ({
  label,
  description,
  value,
  onChange,
  accept = 'image/*,video/*',
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isVideo = value?.match(/\.(mp4|webm|ogg|mov)$/i) || value?.startsWith('data:video');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await mediaService.uploadFile(file);
      if (res?.fileUrl) {
        onChange(res.fileUrl);
        toast.success('Media uploaded. Please remember to save your changes.');
      }
    } catch (err) {
      toast.error('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 transition-all">
      <div className="flex items-center justify-between gap-3">
        <div>
          <label className="block text-zinc-900 font-bold text-xs">{label}</label>
          {description && <p className="text-2xs text-zinc-500">{description}</p>}
        </div>
        <button 
          type="button" 
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer bg-brand-green hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-2xs font-bold shadow-sm transition-all shrink-0"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
        </button>
        <input 
          type="file" 
          accept={accept} 
          onChange={handleUpload} 
          disabled={uploading} 
          className="hidden" 
          ref={fileInputRef} 
        />
      </div>

      {/* Visual Live Preview Box */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-950/5 flex items-center justify-center min-h-[140px] max-h-[260px] group">
          {isVideo ? (
            <video
              src={value}
              controls
              className="w-full h-full max-h-[260px] object-contain rounded-xl"
            />
          ) : (
            <div className="relative w-full h-48 bg-zinc-100 flex items-center justify-center">
              <Image
                src={value}
                alt={label}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-opacity opacity-80 hover:opacity-100 shadow-md cursor-pointer"
            title="Remove media"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Direct URL or Relative Path Input */}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        placeholder="Image/video path or uploaded URL (/uploads/... or https://...)"
        className="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
      />
    </div>
  );
};
