'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category, BusinessSettings } from '@/types';
import { MessageCircle, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-neutral-950 pt-16 pb-24 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              {settings?.tagline || 'Carry Confidence'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight">
              {settings?.hero_heading || 'Carry Confidence with Premium Bags'}
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {settings?.hero_description || 'Discover stylish, high-quality bags designed to complement your everyday look.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient text-black font-bold text-sm shadow-xl shadow-amber-500/10 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                EXPLORE CATALOG
              </Link>
              
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent("Hello! I'd like to browse your bag collection.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm border border-neutral-800 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 fill-current" />
                CHAT ON WHATSAPP
              </a>
            </div>
          </div>

          <div className="relative group">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
              <img
                src={settings?.hero_image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80'}
                alt="HBEJ Collection Hero"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gold-gradient">Shop by Bag Category</h2>
          <p className="text-xs sm:text-sm text-neutral-400">Explore curated bag collections tailored for your style</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/50 hover:bg-neutral-900 transition-all text-center group"
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-neutral-800 group-hover:bg-amber-500/20 text-amber-400 flex items-center justify-center transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-neutral-200 group-hover:text-amber-400 block truncate">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED BAGS */}
      {featuredBags.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Featured Bags</h2>
              <p className="text-xs text-neutral-400">Handpicked premium designs</p>
            </div>
            <Link href="/shop" className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1">
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
      <section className="bg-neutral-950 py-16 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gold-gradient">Why Choose HBEJ Collection</h2>
            <p className="text-xs sm:text-sm text-neutral-400">Experience premium shopping with effortless WhatsApp ordering</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-amber-400" />
              <h3 className="font-semibold text-white">Stylish & Trendy</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Handbags, totes, and crossbodies designed to complement your everyday style.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
              <ShieldCheck className="w-8 h-8 mx-auto text-amber-400" />
              <h3 className="font-semibold text-white">Guaranteed Quality</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Premium materials, strong stitching, and durable hardware.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
              <MessageCircle className="w-8 h-8 mx-auto text-amber-400 fill-current" />
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
        <h2 className="text-2xl font-serif font-bold text-gold-gradient">About HBEJ Collection</h2>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed italic max-w-3xl mx-auto">
          "{settings?.business_description}"
        </p>
      </section>
    </div>
  );
}

function ProductCard({ product, whatsappNum, currency }: { product: Product; whatsappNum: string; currency: string }) {
  const whatsappMsg = `Hello HBEJ Collection 👋\n\nI'm interested in this bag:\n*${product.name}*\nPrice: ${currency}${product.price}\n\nIs this bag currently available?`;
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="group rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between p-4 space-y-3">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 mb-3">
          <img src={product.main_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
        <h3 className="font-semibold text-sm text-neutral-100 hover:text-amber-400 line-clamp-1">{product.name}</h3>
        <div className="text-base font-bold text-amber-400 mt-1">{currency}{product.price}</div>
      </Link>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4 fill-current" /> Order via WhatsApp
      </a>
    </div>
  );
}
