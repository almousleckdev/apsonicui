'use client';

import React, { useState, useMemo } from 'react';
import { useRemoteList } from '@/hooks/queries/useRemoteList';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ActionModal } from '@/components/admin/ActionModal';
import { productService, ProductListItem } from '@/services/product';
import { ProductTable } from '@/components/admin/products/ProductTable';
import { useToast } from '@/components/ui/Toast';
import { Search } from 'lucide-react';
import { T } from '@/components/admin/T';
import { useAdminText } from '@/context/AdminTextContext';

export default function AdminProductsPage() {
  const { toast } = useToast();
  const { t } = useAdminText();
  const { data: products, loading, refetch: fetchData } = useRemoteList<ProductListItem>(
    ['admin', 'products'],
    () => productService.getAdminProducts(),
    (e) => toast.error(e.message || t('products.loadFailed'))
  );
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [deletingProduct, setDeletingProduct] = useState<ProductListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(deletingProduct.id);
      toast.success(t('products.deleted', { name: deletingProduct.model }));
      setDeletingProduct(null);
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('products.deleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (id: number | string, current: boolean) => {
    try {
      await productService.toggleActive(id, !current);
      toast.success(t(!current ? 'products.activated' : 'products.disabledToast'));
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('products.toggleFailed'));
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
          title={<T id="products.title" layout="stack" />}
          subtitle={<T id="products.subtitle" />}
          actionLabel={<T id="products.add" />}
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
              placeholder={t('products.search')}
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
                {b === 'all' ? <T id="products.allBrands" /> : b}
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
          title={t('products.confirmDelete')}
          description={t('products.confirmDeleteText')}
          confirmLabel={<T id="products.deleteConfirm" />}
          expectedConfirmationName={deletingProduct?.model}
          isLoading={isDeleting}
        />
      </div>
    </>
  );
}
