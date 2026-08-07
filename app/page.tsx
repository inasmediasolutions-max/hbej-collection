'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category, BusinessSettings } from '@/types';
import { MessageCircle, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Palette } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes, settingsRes] = await Promise.all([
          supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('display_order', { ascending: true }),
          supabase.from('business_settings').select('*').single(),
        ]);

        if (productsRes.data) setProducts(productsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (e) {
        console.error('Error fetching homepage data:', e);
      }
    }

    fetchData();
  }, []);

  const whatsappNum = settings?.whatsapp_number || '233593143270';
  const currency = settings?.currency || 'GH₵';

  const featuredBags = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div className="space-y-20 pb-16 bg-[#F8F6F2] text-[#111111]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F2EFE9] pt-16 pb-24 border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C9A227]/40 text-[#111111] text-xs font-bold uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              {settings?.tagline || 'Carry Confidence'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#111111] tracking-tight leading-tight">
              {settings?.hero_heading || 'Carry Confidence with Premium Bags'}
            </h1>

            <p className="text-base sm:text-lg text-[#4A4A4A] max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {settings?.hero_description || 'Discover stylish, high-quality bags designed to complement your everyday look.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] font-extrabold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                EXPLORE CATALOG
              </Link>
              
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent("Hello! I'd like to browse your bag collection.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-5 h-5 text-[#C9A227] fill-current" />
                CHAT ON WHATSAPP
              </a>
            </div>
          </div>

          <div className="relative group">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border-2 border-[#C9A227]/30 shadow-2xl">
              <img
                src={settings?.hero_image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80'}
                alt="HBEJ Collection Hero"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">Shop by Bag Category</h2>
          <p className="text-xs sm:text-sm text-[#4A4A4A]">Explore curated bag collections tailored for your style</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="p-4 rounded-2xl bg-white border border-[#4A4A4A]/15 hover:border-[#C9A227] shadow-sm hover:shadow-md transition-all text-center group"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#F8F6F2] group-hover:bg-[#C9A227] text-[#111111] flex items-center justify-center transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#111111] group-hover:text-[#C9A227] block truncate">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED BAGS */}
      {featuredBags.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between border-b border-[#4A4A4A]/20 pb-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#111111]">Featured Bags</h2>
              <p className="text-xs text-[#4A4A4A]">Handpicked premium designs</p>
            </div>
            <Link href="/shop" className="text-xs text-[#111111] font-bold hover:text-[#C9A227] flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredBags.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNum={whatsappNum} currency={currency} />
            ))}
          </div>
        </section>
      )}

      {/* WHY CHOOSE HBEJ COLLECTION */}
      <section className="bg-[#111111] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#C9A227]">Why Choose HBEJ Collection</h2>
            <p className="text-xs sm:text-sm text-neutral-400">Experience premium shopping with effortless WhatsApp ordering</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-[#C9A227]" />
              <h3 className="font-semibold text-white">Stylish & Trendy</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Handbags, totes, and crossbodies designed to complement your everyday style.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-3">
              <ShieldCheck className="w-8 h-8 mx-auto text-[#C9A227]" />
              <h3 className="font-semibold text-white">Guaranteed Quality</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Premium materials, strong stitching, and durable hardware.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-3">
              <MessageCircle className="w-8 h-8 mx-auto text-[#C9A227] fill-current" />
              <h3 className="font-semibold text-white">Instant WhatsApp Ordering</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Chat directly on WhatsApp to ask questions and finalize your order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#111111]">About HBEJ Collection</h2>
        <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed italic max-w-3xl mx-auto font-medium">
          "{settings?.business_description}"
        </p>
      </section>
    </div>
  );
}

function ProductCard({ product, whatsappNum, currency }: { product: Product; whatsappNum: string; currency: string }) {
  const hasMultipleColors = product.additional_images && product.additional_images.length > 0;
  const whatsappMsg = `Hello HBEJ Collection 👋\n\nI'm interested in this bag:\n*${product.name}*\nPrice: ${currency}${product.price}\n${hasMultipleColors ? '(Available in different colors)\n' : ''}\nIs this bag currently available?`;
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="group rounded-2xl bg-white border border-[#4A4A4A]/15 overflow-hidden flex flex-col justify-between p-4 space-y-3 shadow-sm hover:shadow-xl transition-all">
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="aspect-square rounded-xl overflow-hidden bg-[#F8F6F2] mb-3 relative">
          <img src={product.main_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {hasMultipleColors && (
            <span className="absolute top-2 left-2 px-2 py-1 rounded bg-[#111111] text-[#C9A227] font-bold text-[9px] tracking-wider uppercase flex items-center gap-1 shadow-md">
              <Palette className="w-3 h-3 text-[#C9A227]" />
              Diff colors
            </span>
          )}
        </div>
        <h3 className="font-bold text-sm text-[#111111] hover:text-[#C9A227] line-clamp-1">{product.name}</h3>
        <div className="text-base font-extrabold text-[#111111] mt-1">{currency}{product.price}</div>
      </Link>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 rounded-xl bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
      >
        <MessageCircle className="w-4 h-4 fill-current text-[#111111]" /> Order via WhatsApp
      </a>
    </div>
  );
}
