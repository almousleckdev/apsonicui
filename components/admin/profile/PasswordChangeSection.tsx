'use client';

import React from 'react';
import { Key } from 'lucide-react';

interface PasswordChangeSectionProps {
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
}

export const PasswordChangeSection: React.FC<PasswordChangeSectionProps> = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6 font-sans">
      <h4 className="text-base font-bold text-zinc-950 flex items-center gap-2 border-b border-zinc-100 pb-3">
        <Key className="w-4 h-4 text-brand-green" /> Security & Password
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-2">Current Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-2">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>
  );
};
