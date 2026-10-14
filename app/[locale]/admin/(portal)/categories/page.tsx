'use client';

import React, { useState, useMemo } from 'react';
import { useRemoteList } from '@/hooks/queries/useRemoteList';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Modal } from '@/components/ui/modal';
import { ActionModal } from '@/components/admin/ActionModal';
import { categoryService, CategoryItem, CreateCategoryPayload } from '@/services/category';
import { CategoryTable } from '@/components/admin/categories/CategoryTable';
import { CategoryFormModalContent } from '@/components/admin/categories/CategoryFormModalContent';
import { useToast } from '@/components/ui/Toast';
import { Search } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const {
    data: categories,
    loading,
    refetch: fetchCategories,
  } = useRemoteList<CategoryItem>(
    ['admin', 'categories'],
    () => categoryService.getAdminCategories(),
    (e) => toast.error(e.message || 'Failed to load categories')
  );
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<CreateCategoryPayload>({
    slug: '',
    nameEn: '',
    nameFr: '',
    nameZh: '',
    imageUrl: '',
    brand: 'apsonic',
    parentType: 'two-wheeler',
    displayOrder: 0,
    active: true,
  });


  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      slug: '',
      nameEn: '',
      nameFr: '',
      nameZh: '',
      imageUrl: '',
      brand: 'apsonic',
      parentType: 'two-wheeler',
      displayOrder: categories.length + 1,
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      slug: cat.slug,
      nameEn: cat.nameEn || cat.name || '',
      nameFr: cat.nameFr || '',
      nameZh: cat.nameZh || '',
      imageUrl: cat.imageUrl || '',
      brand: cat.brand || 'apsonic',
      parentType: cat.parentType || 'two-wheeler',
      displayOrder: cat.displayOrder ?? 0,
      active: cat.active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.createCategory(formData);
        toast.success('Category created successfully!');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving category');
    }
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deletingCategory.id);
      toast.success(`Category "${deletingCategory.nameEn || deletingCategory.name}" deleted successfully.`);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (id: number | string, current: boolean) => {
    try {
      await categoryService.toggleActive(id, !current);
      toast.success(`Category status ${!current ? 'activated' : 'disabled'} successfully.`);
      fetchCategories();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const q = search.toLowerCase();
      const matchBrand = selectedBrand === 'all' || c.brand === selectedBrand;
      const matchQuery =
        c.nameEn?.toLowerCase().includes(q) ||
        c.nameZh?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q) ||
        c.brand?.toLowerCase().includes(q);
      return matchBrand && matchQuery;
    });
  }, [categories, search, selectedBrand]);

  return (
    <>
      <div className="space-y-6 font-sans max-w-7xl mx-auto">
        {/* Unified Admin Page Header */}
        <AdminPageHeader
          title="Categories Management"
          subtitle="Configure models classification, brands, and ordering."
          actionLabel="Add Category"
          onActionClick={openCreateModal}
          onRefresh={fetchCategories}
          isRefreshing={loading}
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="relative w-full sm:w-80 flex items-center bg-zinc-50 border border-zinc-200/80 rounded-2xl px-3 py-2">
            <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {['all', 'apsonic', 'apsonic-pro'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${selectedBrand === b ? 'bg-brand-green text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
              >
                {b === 'all' ? 'All Categories' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Categories TanStack Table Component */}
        <CategoryTable
          categories={filtered}
          loading={loading}
          onToggleActive={handleToggleActive}
          onEdit={openEditModal}
          onDelete={(id) => {
            const found = categories.find((c) => String(c.id) === String(id));
            if (found) setDeletingCategory(found);
          }}
        />

        {/* Create / Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Add Category'}>
          <CategoryFormModalContent
            formData={formData}
            setFormData={setFormData}
            isEditing={!!editingCategory}
            onSubmit={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>

        {/* Reusable ActionModal for Delete Confirmation with Required Name Verification */}
        <ActionModal
          isOpen={deletingCategory !== null}
          onClose={() => setDeletingCategory(null)}
          onConfirm={confirmDelete}
          variant="danger"
          title="Delete Category"
          description="Are you sure you want to delete this category? Products mapped to this category will need re-assigning."
          confirmLabel="Delete Category"
          cancelLabel="Cancel"
          expectedConfirmationName={deletingCategory?.nameEn || deletingCategory?.name || deletingCategory?.slug}
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}
