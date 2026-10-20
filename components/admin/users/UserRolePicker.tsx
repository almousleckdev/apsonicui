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

const ROLES: Array<{ id: string; title: string; badge: AdminKey; icon: typeof ShieldAlert; desc: AdminKey; permissions: string[]; superAdminOnly: boolean }> = [
  {
    id: 'ROLE_SUPER_ADMIN',
    title: 'SUPER_ADMIN',
    badge: 'users.picker.SUPER_ADMIN.badge',
    icon: ShieldAlert,
    desc: 'users.picker.SUPER_ADMIN.text',
    permissions: ['ALL Permissions', 'MANAGE_USERS', 'MANAGE_ROLES', 'DELETE ALL'],
    superAdminOnly: true,
  },
  {
    id: 'ROLE_ADMIN',
    title: 'ADMIN',
    badge: 'users.picker.ADMIN.badge',
    icon: ShieldCheck,
    desc: 'users.picker.ADMIN.text',
    permissions: ['READ_PRODUCTS', 'WRITE_PRODUCTS', 'DELETE_PRODUCTS', 'READ_CATEGORIES', 'WRITE_CATEGORIES', 'DELETE_CATEGORIES', 'WRITE_NEWS'],
    superAdminOnly: false,
  },
  {
    id: 'ROLE_EDITOR',
    title: 'EDITOR',
    badge: 'users.picker.EDITOR.badge',
    icon: Edit3,
    desc: 'users.picker.EDITOR.text',
    permissions: ['READ_PRODUCTS', 'WRITE_PRODUCTS', 'READ_CATEGORIES', 'WRITE_CATEGORIES', 'READ_NEWS', 'WRITE_NEWS'],
    superAdminOnly: false,
  },
  {
    id: 'ROLE_USER',
    title: 'USER',
    badge: 'users.picker.USER.badge',
    icon: UserCheck,
    desc: 'users.picker.USER.text',
    permissions: ['READ_ONLY'],
    superAdminOnly: false,
  },
];

export const UserRolePicker: React.FC<UserRolePickerProps> = ({
  role,
  setRole,
  canAssignSuperAdmin = true,
}) => {
  const visibleRoles = ROLES.filter((r) => !r.superAdminOnly || canAssignSuperAdmin);

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
          <T id="users.picker.title" />
        </label>
        <span className="text-2xs text-zinc-400 font-medium">
          <T id="users.picker.hint" />
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visibleRoles.map((r) => {
          const isSelected = role === r.id;
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={cn(
                'p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer relative overflow-hidden',
                isSelected
                  ? 'bg-emerald-50/90 border-brand-green text-zinc-900 shadow-sm ring-1 ring-brand-green'
                  : 'bg-white border-zinc-200/80 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300'
              )}
            >
              <div className="flex items-start justify-between w-full gap-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                    isSelected ? "bg-brand-green text-white" : "bg-zinc-100 text-zinc-600"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={cn("text-xs font-extrabold tracking-tight", isSelected ? "text-brand-green" : "text-zinc-900")}>
                      {r.title}
                    </span>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-4xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600">
                      <T id={r.badge} />
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                )}
              </div>

              <p className="text-2xs text-zinc-500 leading-relaxed font-medium">
                <T id={r.desc} />
              </p>

              <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-1">
                {r.permissions.map((perm) => (
                  <span
                    key={perm}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-4xs font-mono font-bold",
                      isSelected ? "bg-brand-green/10 text-brand-green" : "bg-zinc-100 text-zinc-500"
                    )}
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
