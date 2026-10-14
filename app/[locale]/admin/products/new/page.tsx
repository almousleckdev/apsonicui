'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductFormContent } from '@/components/admin/products/ProductFormModalContent';
import { AdminBackNav } from '@/components/admin/AdminBackNav';
import { productService, CreateProductPayload } from '@/services/product';
import { categoryService, CategoryItem } from '@/services/category';
import { useToast } from '@/components/ui/Toast';
import { Save } from 'lucide-react';

const INITIAL_FORM: CreateProductPayload = {
  modelName: '',
  slug: '',
  categoryId: 1,
  brand: 'apsonic',
  displacement: 110,
  coverImageUrl: '',
  heroImageUrl: '',
  performanceImageUrl: '',
  featured: false,
  active: true,
  displayOrder: 1,
  colors: [],
  specBanners: [],
  specs: [],
  reviews: [],
};

export default function AdminNewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [formData, setFormData] = useState<CreateProductPayload>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryService.getAdminCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: Number(cats[0].id) }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productService.createProduct(formData);
      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err?.message || 'Error creating product');
    } finally {
      setLoading(false);
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
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-green hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-green/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Creating...' : 'Create Product'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated Page Form Container */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
          <ProductFormContent
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            isEditing={false}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin/products')}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
