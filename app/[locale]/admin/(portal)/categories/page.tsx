'use client';

import React, { useMemo, useState } from 'react';
import { Layers, Plus, Search } from 'lucide-react';
import { useRemoteList } from '@/hooks/queries/useRemoteList';
import { useProductMenuGroups } from '@/hooks/queries/useProductMenuGroups';
import { useAuth } from '@/hooks/useAuth';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActionModal } from '@/components/admin/ActionModal';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/Toast';
import { CategoryFormModalContent } from '@/components/admin/categories/CategoryFormModalContent';
import { CategoryRow } from '@/components/admin/categories/CategoryRow';
import { GroupFormModal } from '@/components/admin/categories/GroupFormModal';
import { GroupSection } from '@/components/admin/categories/GroupSection';
import { categoryService, type CategoryItem, type CreateCategoryPayload } from '@/services/category';
import { canDeleteCatalog } from '@/lib/utils/permissions';
import {
  PRODUCT_MENU_LIMITS,
  moveGroup,
  partitionByGroup,
  removeGroup,
  uniqueGroupId,
  upsertGroup,
  type ProductMenuGroup,
} from '@/lib/product-menu/groups';

const BRANDS = ['all', 'apsonic', 'apsonic-pro'] as const;

const emptyCategory = (parentType: string, displayOrder: number): CreateCategoryPayload => ({
  slug: '',
  nameEn: '',
  nameFr: '',
  nameZh: '',
  imageUrl: '',
  brand: 'apsonic',
  parentType,
  displayOrder,
  active: true,
});

const errorMessage = (err: unknown, fallback: string) => (err instanceof Error && err.message ? err.message : fallback);

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const allowDelete = canDeleteCatalog(user);

  const { data: categories, loading, refetch, setData } = useRemoteList<CategoryItem>(
    ['admin', 'categories'],
    () => categoryService.getAdminCategories(),
    (e) => toast.error(e.message || 'Failed to load categories')
  );
  const { groups, loading: groupsLoading, update: updateGroups } = useProductMenuGroups();

  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState<(typeof BRANDS)[number]>('all');

  // Category form
  const [categoryForm, setCategoryForm] = useState<{ editing: CategoryItem | null; data: CreateCategoryPayload } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Group form
  const [groupForm, setGroupForm] = useState<{ group: ProductMenuGroup | null } | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<ProductMenuGroup | null>(null);

  const all = useMemo(() => partitionByGroup(categories, groups), [categories, groups]);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = (c: CategoryItem) =>
      (brand === 'all' || c.brand === brand) &&
      (!q || [c.nameEn, c.nameFr, c.nameZh, c.slug].some((text) => text?.toLowerCase().includes(q)));
    return partitionByGroup(categories.filter(matches), groups);
  }, [categories, groups, search, brand]);

  // --- categories ---------------------------------------------------------------------------------------------

  const openCreateCategory = (groupId?: string) =>
    setCategoryForm({ editing: null, data: emptyCategory(groupId ?? groups[0]?.id ?? 'two-wheeler', categories.length + 1) });

  const openEditCategory = (c: CategoryItem) =>
    setCategoryForm({
      editing: c,
      data: {
        slug: c.slug,
        nameEn: c.nameEn || c.name || '',
        nameFr: c.nameFr || '',
        nameZh: c.nameZh || '',
        imageUrl: c.imageUrl || '',
        brand: c.brand || 'apsonic',
        parentType: c.parentType || groups[0]?.id || 'two-wheeler',
        displayOrder: c.displayOrder ?? 0,
        active: c.active ?? true,
      },
    });

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm) return;
    try {
      if (categoryForm.editing) {
        await categoryService.updateCategory(categoryForm.editing.id, categoryForm.data);
        toast.success('Category updated.');
      } else {
        await categoryService.createCategory(categoryForm.data);
        toast.success('Category created.');
      }
      setCategoryForm(null);
      await refetch();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not save the category'));
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deletingCategory.id);
      toast.success(`"${deletingCategory.nameEn || deletingCategory.slug}" deleted.`);
      setDeletingCategory(null);
      await refetch();
    } catch (err) {
      toast.error(errorMessage(err, 'Delete failed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActive = async (c: CategoryItem) => {
    const next = !(c.active ?? true);
    setData((rows) => rows.map((r) => (r.id === c.id ? { ...r, active: next } : r))); // optimistic
    try {
      await categoryService.toggleActive(c.id, next);
    } catch (err) {
      setData((rows) => rows.map((r) => (r.id === c.id ? { ...r, active: !next } : r)));
      toast.error(errorMessage(err, 'Status update failed'));
    }
  };

  // --- groups -------------------------------------------------------------------------------------------------

  const saveGroup = async (group: ProductMenuGroup) => {
    await updateGroups((list) => {
      if (!group.id && list.length >= PRODUCT_MENU_LIMITS.maxGroups) {
        throw new Error(`The menu can have at most ${PRODUCT_MENU_LIMITS.maxGroups} groups.`);
      }
      return upsertGroup(list, group.id ? group : { ...group, id: uniqueGroupId(group.labelEn, list) });
    });
    toast.success(group.id ? 'Group updated.' : 'Group added.');
    setGroupForm(null);
  };

  const confirmDeleteGroup = async () => {
    if (!deletingGroup) return;
    try {
      await updateGroups((list) => removeGroup(list, deletingGroup.id));
      toast.success('Group removed.');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not remove the group'));
    } finally {
      setDeletingGroup(null);
    }
  };

  const move = async (id: string, direction: -1 | 1) => {
    try {
      await updateGroups((list) => moveGroup(list, id, direction));
    } catch (err) {
      toast.error(errorMessage(err, 'Could not reorder the groups'));
    }
  };

  return (
    <div className="space-y-3 font-sans max-w-6xl mx-auto pb-10">
      <AdminPageHeader
        compact
        title="Categories"
        subtitle="The Products menu: groups with their pictures, and the categories inside each one, in English, French and Chinese."
        actionLabel="Add category"
        onActionClick={() => openCreateCategory()}
        onRefresh={() => refetch()}
        isRefreshing={loading || groupsLoading}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-3 py-2 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="relative w-full sm:w-80 flex items-center bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-1.5">
          <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
          <input
            type="text"
            aria-label="Search categories"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {BRANDS.map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={brand === b}
              onClick={() => setBrand(b)}
              className={`px-3 py-1 rounded-lg text-2xs font-bold capitalize transition-colors cursor-pointer ${brand === b ? 'bg-brand-green text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
            >
              {b === 'all' ? 'All brands' : b}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setGroupForm({ group: null })}
            disabled={groups.length >= PRODUCT_MENU_LIMITS.maxGroups}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-2xs font-bold bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 cursor-pointer sm:ml-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add group
          </button>
        </div>
      </div>

      {groups.map((group, index) => (
        <GroupSection
          key={group.id}
          group={group}
          categories={visible.byGroup[group.id] ?? []}
          totalCount={all.byGroup[group.id]?.length ?? 0}
          canMoveUp={index > 0}
          canMoveDown={index < groups.length - 1}
          canDeleteCategories={allowDelete}
          onMove={(direction) => move(group.id, direction)}
          onEdit={() => setGroupForm({ group })}
          onDelete={() => setDeletingGroup(group)}
          onAddCategory={() => openCreateCategory(group.id)}
          onToggleActive={toggleActive}
          onEditCategory={openEditCategory}
          onDeleteCategory={setDeletingCategory}
        />
      ))}

      {visible.orphans.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/40">
          <header className="flex items-center gap-2 border-b border-amber-200 px-3 py-2.5">
            <Layers className="h-4 w-4 text-amber-700" />
            <div>
              <h2 className="text-sm font-black text-amber-900">Group removed</h2>
              <p className="text-2xs text-amber-800">
                These categories point to a group that no longer exists. The site lists them under the first group; edit each one to choose a group.
              </p>
            </div>
          </header>
          <ul className="divide-y divide-amber-100 bg-white">
            {visible.orphans.map((c) => (
              <CategoryRow key={c.id} category={c} canDelete={allowDelete} onToggleActive={toggleActive} onEdit={openEditCategory} onDelete={setDeletingCategory} />
            ))}
          </ul>
        </section>
      )}

      <Modal
        isOpen={categoryForm !== null}
        onClose={() => setCategoryForm(null)}
        title={categoryForm?.editing ? 'Edit category' : 'Add category'}
      >
        {categoryForm && (
          <CategoryFormModalContent
            formData={categoryForm.data}
            setFormData={(update) =>
              setCategoryForm((current) =>
                current ? { ...current, data: typeof update === 'function' ? update(current.data) : update } : current
              )
            }
            isEditing={!!categoryForm.editing}
            groups={groups}
            onSubmit={saveCategory}
            onCancel={() => setCategoryForm(null)}
          />
        )}
      </Modal>

      <GroupFormModal
        isOpen={groupForm !== null}
        onClose={() => setGroupForm(null)}
        group={groupForm?.group ?? null}
        onSave={saveGroup}
      />

      <ActionModal
        isOpen={deletingCategory !== null}
        onClose={() => setDeletingCategory(null)}
        onConfirm={confirmDeleteCategory}
        variant="danger"
        title="Delete category"
        description="Delete this category? Products mapped to it will need re-assigning. Its address (slug) stays reserved, so it cannot be reused."
        confirmLabel="Delete category"
        cancelLabel="Cancel"
        expectedConfirmationName={deletingCategory?.nameEn || deletingCategory?.name || deletingCategory?.slug}
        isLoading={isDeleting}
      />

      <ActionModal
        isOpen={deletingGroup !== null}
        onClose={() => setDeletingGroup(null)}
        onConfirm={confirmDeleteGroup}
        variant="danger"
        title="Remove group"
        description={`Remove "${deletingGroup?.labelEn ?? ''}" from the Products menu? It holds no categories, so nothing else changes.`}
        confirmLabel="Remove group"
        cancelLabel="Cancel"
      />
    </div>
  );
}
