'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NextIntlClientProvider } from 'next-intl';
import zhMessages from '@/messages/zh.json';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Layers, Newspaper, FolderTree, Users, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
import { productService } from '@/services/product';
import { categoryService } from '@/services/category';
import { newsService } from '@/services/news';
import { userService } from '@/services/auth-service';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    news: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchLiveStats = async () => {
    setLoading(true);
    try {
      const [prods, cats, news, users] = await Promise.allSettled([
        productService.getAdminProducts(),
        categoryService.getAdminCategories(),
        newsService.getAdminNewsList(),
        userService.getUsersList(),
      ]);

      setStats({
        products: prods.status === 'fulfilled' ? prods.value.length : 0,
        categories: cats.status === 'fulfilled' ? cats.value.length : 0,
        news: news.status === 'fulfilled' ? news.value.length : 0,
        users: users.status === 'fulfilled' ? users.value.length : 0,
      });
    } catch (e) {
      console.error('Failed to load dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, []);

  const statCards = [
    {
      title: 'Products Models',
      titleEn: 'Active Models',
      value: loading ? '...' : String(stats.products),
      icon: Layers,
      color: 'bg-emerald-500/10 text-brand-green border-emerald-500/20',
      href: '/admin/products',
    },
    {
      title: 'Categories',
      titleEn: 'Product Series',
      value: loading ? '...' : String(stats.categories),
      icon: FolderTree,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      href: '/admin/categories',
    },
    {
      title: 'News & Articles',
      titleEn: 'Published Content',
      value: loading ? '...' : String(stats.news),
      icon: Newspaper,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      href: '/admin/news',
    },
    {
      title: 'User Accounts',
      titleEn: 'System Access',
      value: loading ? '...' : String(stats.users),
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      href: '/admin/users',
    },
  ];

  return (
    <NextIntlClientProvider locale="zh" messages={zhMessages}>
      <AdminLayout>
        <div className="space-y-6 font-sans max-w-7xl mx-auto">
          {/* Top Page Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">Dashboard Overview</h1>
            </div>

            <button
              onClick={fetchLiveStats}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  href={card.href}
                  className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-200 block group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl border ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-0.5">{card.title}</h3>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">{card.titleEn}</span>
                  <p className="text-3xl font-extrabold text-zinc-900">{card.value}</p>
                </Link>
              );
            })}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-100 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight mb-4">Quick Management Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/main-page" className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100 transition-colors block group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-zinc-900">Edit Main Page</span>
                  <ArrowUpRight className="w-4 h-4 text-brand-green" />
                </div>
                <p className="text-xs text-zinc-500">Configure hero video background and homepage showcase.</p>
              </Link>

              <Link href="/admin/products" className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100 transition-colors block group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-zinc-900">Manage Products</span>
                  <Plus className="w-4 h-4 text-brand-green" />
                </div>
                <p className="text-xs text-zinc-500">Add or edit motorcycle models and tech specifications.</p>
              </Link>

              <Link href="/admin/categories" className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100 transition-colors block group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-zinc-900">Manage Categories</span>
                  <Plus className="w-4 h-4 text-brand-green" />
                </div>
                <p className="text-xs text-zinc-500">Organize motorcycle lines and category photos.</p>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </NextIntlClientProvider>
  );
}
