'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Edit3, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { T } from '@/components/admin/T';
import type { AdminKey } from '@/lib/i18n/admin/catalog';

interface UserRolePickerProps {
  role: string;
  setRole: (role: string) => void;
  canAssignSuperAdmin?: boolean;
}

const ROLES: Array<{ id: string; title: string; badge: AdminKey; icon: typeof ShieldAlert; desc: AdminKey; superAdminOnly: boolean }> = [
  {
    id: 'ROLE_SUPER_ADMIN',
    title: 'SUPER_ADMIN',
    badge: 'users.picker.SUPER_ADMIN.badge',
    icon: ShieldAlert,
    desc: 'users.picker.SUPER_ADMIN.text',
    superAdminOnly: true,
  },
  {
    id: 'ROLE_ADMIN',
    title: 'ADMIN',
    badge: 'users.picker.ADMIN.badge',
    icon: ShieldCheck,
    desc: 'users.picker.ADMIN.text',
    superAdminOnly: false,
  },
  {
    id: 'ROLE_EDITOR',
    title: 'EDITOR',
    badge: 'users.picker.EDITOR.badge',
    icon: Edit3,
    desc: 'users.picker.EDITOR.text',
    superAdminOnly: false,
  },
  {
    id: 'ROLE_USER',
    title: 'USER',
    badge: 'users.picker.USER.badge',
    icon: UserCheck,
    desc: 'users.picker.USER.text',
    superAdminOnly: false,
  },
];

export const UserRolePicker: React.FC<UserRolePickerProps> = ({
  role,
  setRole,
  canAssignSuperAdmin = true,
}) => {
  const visibleRoles = ROLES.filter((r) => !r.superAdminOnly || canAssignSuperAdmin);

  const selected = visibleRoles.find((r) => r.id === role);

  return (
    <div className="space-y-2.5 font-sans">
      <label className="text-xs font-bold text-zinc-700 block">
        <T id="users.picker.title" />
      </label>

      <div className="grid grid-cols-2 gap-2">
        {visibleRoles.map((r) => {
          const isSelected = role === r.id;
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              aria-pressed={isSelected}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer',
                isSelected
                  ? 'bg-emerald-50 border-brand-green ring-1 ring-brand-green'
                  : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'
              )}
            >
              <span className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                isSelected ? 'bg-brand-green text-white' : 'bg-zinc-100 text-zinc-600'
              )}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span className="min-w-0">
                <span className={cn('block text-xs font-extrabold tracking-tight truncate', isSelected ? 'text-brand-green' : 'text-zinc-900')}>
                  {r.title}
                </span>
                <span className="block text-2xs text-zinc-500 font-medium truncate">
                  <T id={r.badge} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="text-2xs text-zinc-500 leading-relaxed font-medium px-1">
          <T id={selected.desc} />
        </p>
      )}
    </div>
  );
};
