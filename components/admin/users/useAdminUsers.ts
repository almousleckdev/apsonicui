'use client';

import { useState } from 'react';
import { useRemoteList } from '@/hooks/queries/useRemoteList';
import { userService } from '@/services/auth-service';
import type { UserManagementItem, CreateUserPayload, UpdateUserPayload } from '@/lib/types/auth';

import { useToast } from '@/components/ui/Toast';
import { useAdminText } from '@/context/AdminTextContext';

export function useAdminUsers() {
  const { toast } = useToast();
  const { t } = useAdminText();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserManagementItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserManagementItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    data: users,
    loading,
    refetch: fetchUserList,
    error: loadError,
  } = useRemoteList<UserManagementItem>(
    ['admin', 'users', searchQuery, selectedRole],
    () => userService.getUsersList(searchQuery, selectedRole),
    (err) => {
      console.error(err);
      toast.error(t('users.loadFailed'));
    },
    { keepPrevious: true }
  );
  const error = loadError ? loadError.message || t('users.loadFailed') : null;

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserManagementItem) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (payload: CreateUserPayload) => {
    if (editingUser) {
      const updatePayload: UpdateUserPayload = {
        ...payload,
        enabled: editingUser.enabled,
      };
      await userService.updateUser(editingUser.id, updatePayload);
      toast.success(t('users.updated'));
    } else {
      await userService.createUser(payload);
      toast.success(t('users.created'));
    }
    await fetchUserList();
  };

  const handleToggleStatus = async (user: UserManagementItem) => {
    try {
      await userService.toggleUserStatus(user.id, !user.enabled);
      toast.success(t(!user.enabled ? 'users.activated' : 'users.suspendedToast'));
      await fetchUserList();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : t('users.statusFailed'));
    }
  };

  const handleDeleteUser = async (id: number) => {
    setDeleting(true);
    try {
      await userService.deleteUser(id);
      toast.success(t('users.deleted'));
      setDeletingUser(null);
      await fetchUserList();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : t('users.deleteFailed'));
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.firstName && u.firstName.toLowerCase().includes(query)) ||
      (u.lastName && u.lastName.toLowerCase().includes(query));

    const matchesRole =
      selectedRole === 'ALL' ||
      (u.roles && u.roles.some((r: string) => r.toLowerCase().includes(selectedRole.toLowerCase())));

    return matchesQuery && matchesRole;
  });

  return {
    users,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    isModalOpen,
    setIsModalOpen,
    editingUser,
    deletingUser,
    setDeletingUser,
    deleting,
    fetchUserList,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleSaveUser,
    handleToggleStatus,
    handleDeleteUser,
    filteredUsers,
  };
}
