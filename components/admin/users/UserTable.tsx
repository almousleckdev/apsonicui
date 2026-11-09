'use client';

import React from 'react';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { ShieldCheck, CheckCircle2, XCircle, Edit2, Trash2, Users, Mail, Clock, Lock, Ban, UserCheck } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { useAuth } from '@/hooks/useAuth';
import { canManageUsers } from '@/lib/utils/permissions';
import type { UserAccountStatus, UserManagementItem } from '@/lib/types/auth';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

interface UserTableProps {
  loading: boolean;
  users: UserManagementItem[];
  onEdit: (user: UserManagementItem) => void;
  onDelete: (user: UserManagementItem) => void;
  onToggleStatus: (user: UserManagementItem) => void;
  onResendInvitation: (user: UserManagementItem) => void;
}

type StatusLook = { label: 'users.active' | 'users.invited' | 'users.invitationExpired' | 'users.suspended' | 'users.locked'; color: string; icon: typeof CheckCircle2 };

const STATUS_LOOK: Record<UserAccountStatus, StatusLook> = {
  ACTIVE: { label: 'users.active', color: 'text-emerald-600', icon: CheckCircle2 },
  INVITED: { label: 'users.invited', color: 'text-amber-600', icon: Clock },
  INVITATION_EXPIRED: { label: 'users.invitationExpired', color: 'text-orange-600', icon: Clock },
  SUSPENDED: { label: 'users.suspended', color: 'text-zinc-400', icon: XCircle },
  LOCKED: { label: 'users.locked', color: 'text-red-600', icon: Lock },
};

/** The server sends the status; older servers only say whether the account is enabled. */
const accountStatus = (user: UserManagementItem): UserAccountStatus =>
  user.status ?? (user.enabled ? 'ACTIVE' : 'SUSPENDED');

/** A new link can be sent only to someone who has not chosen a password yet and is not suspended. */
const canResend = (user: UserManagementItem): boolean => {
  const status = accountStatus(user);
  return status === 'INVITED' || status === 'INVITATION_EXPIRED';
};

export const UserTable: React.FC<UserTableProps> = ({
  loading,
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  onResendInvitation,
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
      id: 'status',
      header: () => <T id="users.columns.status" />,
      cell: ({ row }) => {
        const user = row.original;
        const status = accountStatus(user);
        const look = STATUS_LOOK[status];
        const Icon = look.icon;
        return (
          <div className="flex flex-col gap-0.5">
            <span className={`flex items-center gap-1 font-bold ${look.color}`}>
              <Icon className="w-4 h-4" /> <T id={look.label} />
            </span>
            {status === 'INVITED' && user.invitationExpiresAt && (
              <span className="text-2xs text-zinc-500">
                {t('users.linkUntil', { time: new Date(user.invitationExpiresAt).toLocaleString() })}
              </span>
            )}
          </div>
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
            {canResend(user) && (
              <button
                type="button"
                onClick={() => onResendInvitation(user)}
                className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors cursor-pointer"
                title={t('users.resendInvitation')}
                aria-label={t('users.resendInvitation')}
              >
                <Mail className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onToggleStatus(user)}
              className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-colors cursor-pointer"
              title={t(user.enabled ? 'users.suspend' : 'users.activate')}
              aria-label={t(user.enabled ? 'users.suspend' : 'users.activate')}
            >
              {user.enabled ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
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
