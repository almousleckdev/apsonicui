'use client';

import React from 'react';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { ShieldCheck, CheckCircle2, XCircle, Edit2, Trash2, Users } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { canManageUsers } from '@/lib/utils/permissions';
import type { UserManagementItem } from '@/lib/types/auth';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

interface UserTableProps {
  loading: boolean;
  users: UserManagementItem[];
  onEdit: (user: UserManagementItem) => void;
  onDelete: (user: UserManagementItem) => void;
  onToggleStatus: (user: UserManagementItem) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  loading,
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const { user: currentUser } = useAuth();
  const allowDelete = canManageUsers(currentUser);
  const { t } = useAdminText();

  const columns: ColumnDef<UserManagementItem>[] = [
    {
      accessorKey: 'username',
      header: () => <T id="users.columns.profile" />,
      cell: ({ row }) => {
        const user = row.original;
        const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200/80 flex items-center justify-center">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={displayName} fill className="object-cover" sizes="40px" />
              ) : (
                <span className="font-extrabold text-zinc-600 text-xs">
                  {user.username.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                {displayName}
                {user.roles?.includes('ROLE_SUPER_ADMIN') && (
                  <span title={t('users.superAdmin')}>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                )}
              </div>
              <div className="text-2xs text-zinc-400 font-mono">@{user.username}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: () => <T id="users.columns.email" />,
      cell: ({ row }) => <span className="text-zinc-600 font-mono text-xs">{row.original.email}</span>,
    },
    {
      accessorKey: 'roles',
      header: () => <T id="users.columns.roles" />,
      cell: ({ row }) => {
        const roles = row.original.roles || [];
        return (
          <div className="flex flex-wrap gap-1.5">
            {roles.map((role) => (
              <span
                key={role}
                className={`px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider ${
                  role === 'ROLE_SUPER_ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : role === 'ROLE_ADMIN'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                {role.replace('ROLE_', '')}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'enabled',
      header: () => <T id="users.columns.status" />,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <button
            type="button"
            onClick={() => onToggleStatus(user)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {user.enabled ? (
              <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 className="w-4 h-4" /> <T id="users.active" /></span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-400 font-bold"><XCircle className="w-4 h-4" /> <T id="users.suspended" /></span>
            )}
          </button>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right"><T id="users.columns.actions" /></div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(user)}
              className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors cursor-pointer"
              title={t('users.edit')}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            {allowDelete && (
              <button
                type="button"
                onClick={() => onDelete(user)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors cursor-pointer"
                title={t('users.delete')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={loading}
      emptyTitle={<T id="users.emptyTitle" />}
      emptyDescription={<T id="users.emptyText" />}
      emptyIcon={Users}
    />
  );
};
