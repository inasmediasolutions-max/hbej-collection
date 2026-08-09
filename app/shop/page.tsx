'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category, BusinessSettings } from '@/types';
import { Search, MessageCircle, SlidersHorizontal, Palette } from 'lucide-react';

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

  const rawNum = (settings?.whatsapp_number || '0593143270').replace(/\D/g, '');
  const formattedNum = rawNum.startsWith('0') ? '233' + rawNum.slice(1) : rawNum.startsWith('233') ? rawNum : '233' + rawNum;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8 bg-[#F7F3EA] text-[#111111]">
      <div className="text-center space-y-2 border-b border-[#4A4A4A]/20 pb-6 sm:pb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
          Explore Bag Catalog
        </h1>
        <p className="text-xs sm:text-sm text-[#4A4A4A] font-medium">
          Browse our entire collection of premium bags and enquire directly on WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#4A4A4A]/20 shadow-sm">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#4A4A4A]" />
          <input
            type="text"
            placeholder="Search bags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F3EA] border border-[#4A4A4A]/20 text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F3EA] border border-[#4A4A4A]/20 text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#C9A227] font-semibold"
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F3EA] border border-[#4A4A4A]/20 text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#C9A227] font-semibold"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-[#EFECE6] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-16 sm:py-20 space-y-4 bg-white rounded-2xl border border-[#4A4A4A]/20">
          <SlidersHorizontal className="w-10 h-10 mx-auto text-[#4A4A4A]" />
          <h3 className="text-base sm:text-lg font-bold text-[#111111]">No bags found</h3>
          <p className="text-xs text-[#4A4A4A]">Try adjusting your search query or category selection</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {sortedProducts.map((product) => {
            const hasMultipleColors = product.additional_images && product.additional_images.length > 0;
            const whatsappMsg = `Hello HBEJ Collection, I'm interested in the ${product.name}. Is it available?`;
            const whatsappUrl = `https://wa.me/${formattedNum}?text=${encodeURIComponent(whatsappMsg)}`;

            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-[#4A4A4A]/15 overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 space-y-3 hover:border-[#C9A227] shadow-sm hover:shadow-xl transition-all"
              >
                <Link href={`/product/${product.slug}`} className="block relative">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#F7F3EA] mb-3 relative">
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {hasMultipleColors && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#111111] text-[#C9A227] font-bold text-[9px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                        <Palette className="w-3 h-3 text-[#C9A227]" />
                        Diff colors
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#111111] hover:text-[#C9A227] line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="text-sm sm:text-base font-extrabold text-[#111111] mt-1">
                    {currency}{product.price.toLocaleString()}
                  </div>
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current text-[#111111]" />
                  Chat on WhatsApp
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
    <Suspense fallback={<div className="text-center py-20 text-[#4A4A4A]">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
