'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { UserFilterBar } from '@/components/admin/users/UserFilterBar';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserEditModal } from '@/components/admin/users/UserEditModal';
import { ActionModal } from '@/components/admin/ActionModal';
import { useAdminUsers } from '@/components/admin/users/useAdminUsers';
import { AlertTriangle } from 'lucide-react';

export default function AdminUsersPage() {
  const {
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
  } = useAdminUsers();

  const handleConfirmDelete = async () => {
    if (deletingUser !== null) {
      await handleDeleteUser(deletingUser.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans max-w-7xl mx-auto">
        {/* Unified Admin Page Header Banner */}
        <AdminPageHeader
          title="Users Management"
          subtitle="Manage administrator credentials, roles, and platform permissions."
          actionLabel="Create User"
          onActionClick={handleOpenCreateModal}
          onRefresh={fetchUserList}
          isRefreshing={loading}
        />

        {/* Filter and Search Toolbar */}
        <UserFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRoleFilter={selectedRole}
          onRoleFilterChange={setSelectedRole}
        />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* User TanStack Table Component */}
        <UserTable
          loading={loading}
          users={filteredUsers}
          onEdit={handleOpenEditModal}
          onDelete={(u) => setDeletingUser(u)}
          onToggleStatus={handleToggleStatus}
        />

        {/* Create / Edit User Modal */}
        <UserEditModal
          isOpen={isModalOpen}
          editingUser={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveUser}
        />

        {/* Standardized ActionModal for User Deletion with Typed Name Verification */}
        <ActionModal
          isOpen={deletingUser !== null}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleConfirmDelete}
          variant="danger"
          title="Delete User Account"
          description="Are you sure you want to delete this system user? All associated session tokens and administrator rights will be permanently revoked."
          confirmLabel="Delete User"
          cancelLabel="Cancel"
          expectedConfirmationName={deletingUser?.username}
          isLoading={deleting}
        />
      </div>
    </AdminLayout>
  );
}
