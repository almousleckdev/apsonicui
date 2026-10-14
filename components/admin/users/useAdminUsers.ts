'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/auth-service';
import { tokenStorage } from '@/services/token-storage';
import type { UserManagementItem, CreateUserPayload, UpdateUserPayload } from '@/lib/types/auth';

import { useToast } from '@/components/ui/Toast';

export function useAdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserManagementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserManagementItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserManagementItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUserList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getUsersList(searchQuery, selectedRole);
      setUsers(res || []);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user list');
      toast.error('Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedRole, toast]);

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserManagementItem) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (payload: CreateUserPayload) => {
    const token = tokenStorage.getAccessToken();
    if (!token) throw new Error('Authentication session expired');
    if (editingUser) {
      const updatePayload: UpdateUserPayload = {
        ...payload,
        enabled: editingUser.enabled,
      };
      await userService.updateUser(editingUser.id, updatePayload, token);
      toast.success('User updated successfully!');
    } else {
      await userService.createUser(payload, token);
      toast.success('User created successfully!');
    }
    await fetchUserList();
  };

  const handleToggleStatus = async (user: UserManagementItem) => {
    const token = tokenStorage.getAccessToken();
    if (!token) return;
    try {
      await userService.toggleUserStatus(user.id, !user.enabled, token);
      toast.success(`User account ${!user.enabled ? 'activated' : 'suspended'} successfully.`);
      await fetchUserList();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (id: number) => {
    const token = tokenStorage.getAccessToken();
    if (!token) return;
    setDeleting(true);
    try {
      await userService.deleteUser(id, token);
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
