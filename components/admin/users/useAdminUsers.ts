'use client';

import { useState } from 'react';
import { useRemoteList } from '@/hooks/queries/useRemoteList';
import { userService } from '@/services/auth-service';
import type { UserManagementItem, CreateUserPayload, UpdateUserPayload } from '@/lib/types/auth';

import { useToast } from '@/components/ui/Toast';

export function useAdminUsers() {
  const { toast } = useToast();
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
      toast.error('Failed to fetch user list');
    },
    { keepPrevious: true }
  );
  const error = loadError ? loadError.message || 'Failed to fetch user list' : null;

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
      toast.success('User updated successfully!');
    } else {
      await userService.createUser(payload);
      toast.success('User created successfully!');
    }
    await fetchUserList();
  };

  const handleToggleStatus = async (user: UserManagementItem) => {
    try {
      await userService.toggleUserStatus(user.id, !user.enabled);
      toast.success(`User account ${!user.enabled ? 'activated' : 'suspended'} successfully.`);
      await fetchUserList();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (id: number) => {
    setDeleting(true);
    try {
      await userService.deleteUser(id);
      toast.success('User account deleted successfully.');
      setDeletingUser(null);
      await fetchUserList();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
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
