'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Category } from '@/types';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const { data } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (data) setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const { error } = await supabase.from('categories').insert([{ name: newCatName, slug, display_order: categories.length + 1 }]);

    if (!error) {
      setNewCatName('');
      fetchCategories();
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim()) return;
    const slug = editName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    await supabase.from('categories').update({ name: editName, slug }).eq('id', id);
    setEditingCat(null);
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-neutral-900 pb-6">
        <h1 className="text-2xl font-serif font-bold text-gold-gradient">
          Manage Bag Categories
        </h1>
        <p className="text-xs text-neutral-400">
          Create, rename, or delete bag categories for your catalog
        </p>
      </div>

      <form onSubmit={handleAddCategory} className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
        <h3 className="text-sm font-semibold text-white">Add New Category</h3>
        <div className="flex gap-3">
          <input
            type="text"
            required
            placeholder="Category name (e.g., Travel Bags, Clutches)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-bold text-xs flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </form>

      <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
        <h3 className="text-sm font-semibold text-white">Existing Bag Categories</h3>
        {loading ? (
          <div className="text-xs text-neutral-500 py-4">Loading categories...</div>
        ) : (
          <div className="divide-y divide-neutral-900">
            {categories.map((cat) => (
              <div key={cat.id} className="py-3 flex items-center justify-between">
                {editingCat?.id === cat.id ? (
                  <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white flex-1"
                    />
                    <button onClick={() => handleUpdateCategory(cat.id)} className="p-1.5 bg-emerald-600 rounded-lg text-white">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-neutral-200">{cat.name}</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCat(cat);
                      setEditName(cat.name);
                    }}
                    className="p-1.5 bg-neutral-900 rounded-lg text-amber-400"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 bg-neutral-900 rounded-lg text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
