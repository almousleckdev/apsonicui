'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductFormContent } from '@/components/admin/products/ProductFormModalContent';
import { AdminBackNav } from '@/components/admin/AdminBackNav';
import { productService, CreateProductPayload } from '@/services/product';
import { categoryService, CategoryItem } from '@/services/category';
import { useToast } from '@/components/ui/Toast';
import { Loader2, Save } from 'lucide-react';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [formData, setFormData] = useState<CreateProductPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      categoryService.getAdminCategories(),
      productService.getProductDetail(id),
    ]).then(([cats, detail]) => {
      setCategories(cats);
      if (detail) {
        setFormData({
          ...detail,
          categoryId: Number(cats.find((c) => c.slug === detail.categorySlug)?.id || cats[0]?.id || 1),
        });
      }
      setLoading(false);
    }).catch((e) => {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Failed to load product details');
      setLoading(false);
    });
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);
    try {
      await productService.updateProduct(id, formData);
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err?.message || 'Error updating product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans max-w-5xl mx-auto pb-16">
        {/* Top Header - Back Nav + Action Buttons */}
        <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <AdminBackNav href="/admin/products" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={saving || loading || !formData}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-green hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated Page Form Container */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
          {loading || !formData ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="w-6 h-6 text-brand-green animate-spin" />
              <span className="text-xs font-bold text-zinc-500">Loading Product Data...</span>
            </div>
          ) : (
            <ProductFormContent
              formData={formData}
              setFormData={setFormData as any}
              categories={categories}
              isEditing={true}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/admin/products')}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
