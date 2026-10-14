'use client';

import React, { useState, useEffect } from 'react';
import type { CreateUserPayload, UserManagementItem } from '@/lib/types/auth';
import { UserRolePicker } from './UserRolePicker';
import { User, KeyRound, Mail } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

interface UserEditModalProps {
  isOpen: boolean;
  editingUser: UserManagementItem | null;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload) => Promise<void>;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  editingUser,
  onClose,
  onSubmit,
}) => {
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('ROLE_ADMIN');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username || '');
      setEmail(editingUser.email || '');
      setFirstName(editingUser.firstName || '');
      setLastName(editingUser.lastName || '');
      setRole(editingUser.roles?.[0] || 'ROLE_ADMIN');
      setAvatarUrl(editingUser.avatarUrl || '');
      setPassword('');
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole('ROLE_ADMIN');
      setAvatarUrl('');
    }
    setErrorMsg(null);
  }, [editingUser, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!editingUser && !password.trim()) {
      setErrorMsg('Password is required for new user creation.');
      return;
    }

    setSaving(true);
    try {
      const payload: CreateUserPayload = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim() || '',
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        roles: [role.replace('ROLE_', '')],
        avatarUrl: avatarUrl || undefined,
        enabled: true,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? `Edit User: @${editingUser.username}` : 'Create New System Account'}
    >
      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <UserRolePicker role={role} setRole={setRole} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1.5">Username *</label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={!!editingUser}
                placeholder="e.g. john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white disabled:opacity-60"
              />
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1.5">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="john@apsonic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white"
              />
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1.5">
              {editingUser ? 'New Password (Leave blank to keep)' : 'Account Password *'}
            </label>
            <div className="relative">
              <input
                type="password"
                required={!editingUser}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white"
              />
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1.5">First Name</label>
            <input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900 focus:outline-none focus:border-brand-green focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand-green hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/20 transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : editingUser ? 'Save User Changes' : 'Create Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
