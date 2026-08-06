'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category, BusinessSettings } from '@/types';
import { Search, MessageCircle, SlidersHorizontal } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [productsRes, categoriesRes, settingsRes] = await Promise.all([
          supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('display_order', { ascending: true }),
          supabase.from('business_settings').select('*').single(),
        ]);

        if (productsRes.data) setProducts(productsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (e) {
        console.error('Error fetching shop data:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const whatsappNum = settings?.whatsapp_number || '233593143270';
  const currency = settings?.currency || 'GH₵';

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.color?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || p.categories?.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name-az') return a.name.localeCompare(b.name);
    return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2 border-b border-neutral-900 pb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gold-gradient">
          Explore Bag Catalog
        </h1>
        <p className="text-sm text-neutral-400">
          Browse our entire collection of premium bags and order directly on WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-900">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search bags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-neutral-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-neutral-950 rounded-2xl border border-neutral-900">
          <SlidersHorizontal className="w-12 h-12 mx-auto text-neutral-600" />
          <h3 className="text-lg font-semibold text-neutral-300">No bags found</h3>
          <p className="text-xs text-neutral-500">Try adjusting your search query or category selection</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => {
            const whatsappMsg = `Hello HBEJ Collection 👋\n\nI'm interested in this bag:\n*${product.name}*\nPrice: ${currency}${product.price}\n\nIs this bag currently available?`;
            const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMsg)}`;

            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between p-4 space-y-3"
              >
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 mb-3">
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-sm text-neutral-100 hover:text-amber-400 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="text-base font-bold text-amber-400 mt-1">
                    {currency}{product.price}
                  </div>
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  Order via WhatsApp
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-neutral-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
