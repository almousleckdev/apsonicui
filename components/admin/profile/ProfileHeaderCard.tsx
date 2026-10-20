'use client';

import React from 'react';
import Image from 'next/image';
import { Camera, Loader2, Shield } from 'lucide-react';
import type { UserProfileResponse } from '@/lib/types/auth';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

interface ProfileHeaderCardProps {
  avatarUrl: string;
  username: string;
  firstName: string;
  lastName: string;
  profile: UserProfileResponse | null;
  uploadingAvatar: boolean;
  onTriggerAvatarUpload: () => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  avatarUrl,
  username,
  firstName,
  lastName,
  profile,
  uploadingAvatar,
  onTriggerAvatarUpload,
}) => {
  const { t } = useAdminText();
  return (
    <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm flex flex-col sm:flex-row items-center gap-8 font-sans">
      <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-zinc-100 shrink-0 group">
        <Image
          src={avatarUrl || '/images/logo/apsoniclogo.png'}
          alt={username || t('profile.avatarAlt')}
          fill
          unoptimized
          className="object-cover"
        />
        <div
          onClick={onTriggerAvatarUpload}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
        >
          {uploadingAvatar ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-3xs font-bold"><T id="profile.change" /></span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 text-center sm:text-left">
        <h3 className="text-xl font-extrabold text-zinc-950">
          {firstName || lastName ? `${firstName} ${lastName}`.trim() : username}
        </h3>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            {profile?.roles?.[0]?.replace('ROLE_', '') || 'SUPER_ADMIN'}
          </span>
          <span className="text-xs text-zinc-400">ID #{profile?.id || 1}</span>
        </div>
        <p className="text-xs text-zinc-500 pt-1">
          <T id="profile.avatarHint" />
        </p>
      </div>
    </div>
  );
};
