'use client';

import React from 'react';
import { User, Mail } from 'lucide-react';
import { T } from '@/components/admin/T';

interface AccountInfoSectionProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
}

export const AccountInfoSection: React.FC<AccountInfoSectionProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  username,
  setUsername,
  email,
  setEmail,
}) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6 font-sans">
      <h4 className="text-base font-bold text-zinc-950 flex items-center gap-2 border-b border-zinc-100 pb-3">
        <User className="w-4 h-4 text-brand-green" /> <T id="profile.personal" />
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-2"><T id="profile.firstName" /></label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-2"><T id="profile.lastName" /></label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-2"><T id="profile.username" /></label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-400" /> <T id="profile.email" />
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>
  );
};
