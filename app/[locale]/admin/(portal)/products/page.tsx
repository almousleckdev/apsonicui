'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActionModal } from '@/components/admin/ActionModal';
import { productService, ProductListItem } from '@/services/product';
import { categoryService, CategoryItem } from '@/services/category';
import { ProductTable } from '@/components/admin/products/ProductTable';
import { useToast } from '@/components/ui/Toast';
import { Search } from 'lucide-react';

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [deletingProduct, setDeletingProduct] = useState<ProductListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        productService.getAdminProducts(),
        categoryService.getAdminCategories(),
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(deletingProduct.id);
      toast.success(`Product "${deletingProduct.model}" deleted successfully.`);
      setDeletingProduct(null);
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (id: number | string, current: boolean) => {
    try {
      await productService.toggleActive(id, !current);
      toast.success(`Product status ${!current ? 'activated' : 'disabled'} successfully.`);
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Status toggle failed');
    }
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchQuery =
        p.model?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      return matchBrand && matchQuery;
    });
  }, [products, search, selectedBrand]);

  return (
    <>
      <div className="space-y-6 font-sans max-w-7xl mx-auto">
        {/* Unified Admin Page Header */}
        <AdminPageHeader
          title="Products Management"
          subtitle="Manage motorcycle models, technical specifications, and section images."
          actionLabel="Add Product"
          actionHref="/admin/products/new"
          onRefresh={fetchData}
          isRefreshing={loading}
        />

        {/* Filter Bar with Brand Tabs */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <Search className="w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search model name, slug, category..."
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
                {b === 'all' ? 'All Brands' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Products TanStack Table Component */}
        <ProductTable
          products={filtered}
          loading={loading}
          onToggleActive={handleToggleActive}
          onDelete={(id) => {
            const prod = products.find((p) => String(p.id) === String(id));
            if (prod) setDeletingProduct(prod);
          }}
        />

        {/* Reusable ActionModal for Delete Confirmation with Typed Model Name */}
        <ActionModal
          isOpen={deletingProduct !== null}
          onClose={() => setDeletingProduct(null)}
          onConfirm={confirmDelete}
          variant="danger"
          title="Delete Product"
          description="Are you sure you want to delete this motorcycle model? This will remove it from the catalog and customer-facing pages."
          confirmLabel="Delete Product"
          cancelLabel="Cancel"
          expectedConfirmationName={deletingProduct?.model}
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}
