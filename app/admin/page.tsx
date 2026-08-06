'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types';
import { ShoppingBag, CheckCircle, XCircle, FolderTree, Plus, Settings } from 'lucide-react';

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*'),
        ]);

        if (prodRes.data) setProducts(prodRes.data);
        if (catRes.data) setCategories(catRes.data);
      } catch (e) {
        console.error('Error loading stats:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const totalProducts = products.length;
  const availableCount = products.filter((p) => p.stock_status === 'available').length;
  const outOfStockCount = products.filter((p) => p.stock_status === 'out_of_stock').length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gold-gradient">
            Dashboard Overview
          </h1>
          <p className="text-xs text-neutral-400">
            Welcome to HBEJ Collection catalog management system
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add New Bag
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium text-xs hover:bg-neutral-800 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Business Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase">Total Bags</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totalProducts}</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase">Available</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400">{availableCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase">Out of Stock</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-rose-400">{outOfStockCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase">Categories</span>
            <FolderTree className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white">{categories.length}</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
            Recently Added Bags
          </h2>
          <Link href="/admin/products" className="text-xs text-amber-400 hover:underline">
            View All Bags →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-neutral-500 text-xs">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-xs space-y-3">
            <p>No bags added yet.</p>
            <Link
              href="/admin/products"
              className="inline-block px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-medium"
            >
              Add Your First Bag
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-neutral-500 uppercase border-b border-neutral-900">
                <tr>
                  <th className="py-3 px-2">Bag</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-900/50">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img src={p.main_image} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-900" />
                      <span className="font-semibold text-white">{p.name}</span>
                    </td>
                    <td className="py-3 px-2 font-bold text-amber-400">GH₵{p.price}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.stock_status === 'available'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {p.stock_status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Link href="/admin/products" className="text-amber-400 hover:underline font-medium">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
