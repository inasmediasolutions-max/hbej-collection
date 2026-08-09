'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category, BusinessSettings } from '@/types';
import { MessageCircle, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Award, Heart, Palette } from 'lucide-react';

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

  const rawNum = (settings?.whatsapp_number || '0593143270').replace(/\D/g, '');
  const formattedNum = rawNum.startsWith('0') ? '233' + rawNum.slice(1) : rawNum.startsWith('233') ? rawNum : '233' + rawNum;
  const currency = settings?.currency || 'GH₵';

  const heroWhatsappLink = `https://wa.me/${formattedNum}?text=${encodeURIComponent(
    'Hello HBEJ Collection, I would like to make an enquiry about your bags.'
  )}`;

  const featuredBags = products.filter((p) => p.is_featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.is_new_arrival).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 bg-[#F7F3EA] text-[#111111]">
      {/* HOMEPAGE HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F7F3EA] pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[#C9A227]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          
          {/* Left Text & CTAs */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C9A227]/50 text-[#111111] text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              {settings?.tagline || 'Carry Confidence'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#111111] tracking-tight leading-tight uppercase">
              CARRY CONFIDENCE.
            </h1>

            <p className="text-base sm:text-lg text-[#4A4A4A] max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Stylish, high-quality bags designed to elevate your everyday look.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                EXPLORE COLLECTION
              </Link>
              
              <a
                href={heroWhatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-[#C9A227] fill-current" />
                CHAT ON WHATSAPP
              </a>
            </div>
          </div>

          {/* Right Visual / Hero Image */}
          <div className="relative group">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white border-2 border-[#C9A227]/40 shadow-2xl p-2 sm:p-3">
              <img
                src={settings?.hero_image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80'}
                alt="HBEJ Collection Hero Bag"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / BRAND SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#4A4A4A]/15 text-center space-y-2 shadow-sm">
            <Award className="w-6 h-6 mx-auto text-[#C9A227]" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#111111]">PREMIUM QUALITY</h3>
            <p className="text-[11px] text-[#4A4A4A] font-medium leading-relaxed">
              Carefully selected bags for your style.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#4A4A4A]/15 text-center space-y-2 shadow-sm">
            <Sparkles className="w-6 h-6 mx-auto text-[#C9A227]" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#111111]">STYLISH DESIGNS</h3>
            <p className="text-[11px] text-[#4A4A4A] font-medium leading-relaxed">
              Find a bag for every occasion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#4A4A4A]/15 text-center space-y-2 shadow-sm">
            <Heart className="w-6 h-6 mx-auto text-[#C9A227]" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#111111]">AFFORDABLE PRICES</h3>
            <p className="text-[11px] text-[#4A4A4A] font-medium leading-relaxed">
              Style without unnecessary expense.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#4A4A4A]/15 text-center space-y-2 shadow-sm">
            <MessageCircle className="w-6 h-6 mx-auto text-[#C9A227] fill-current" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#111111]">EASY WHATSAPP ORDERING</h3>
            <p className="text-[11px] text-[#4A4A4A] font-medium leading-relaxed">
              Browse, enquire and order directly.
            </p>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">Shop by Bag Category</h2>
          <p className="text-xs sm:text-sm text-[#4A4A4A] font-medium">Explore curated bag collections tailored for your style</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="p-3.5 rounded-2xl bg-white border border-[#4A4A4A]/15 hover:border-[#C9A227] shadow-sm hover:shadow-md transition-all text-center group"
            >
              <div className="w-9 h-9 mx-auto mb-2 rounded-full bg-[#F7F3EA] group-hover:bg-[#C9A227] text-[#111111] flex items-center justify-center transition-colors">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#111111] group-hover:text-[#C9A227] block truncate">
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
              <p className="text-xs text-[#4A4A4A] font-medium">Handpicked premium designs</p>
            </div>
            <Link href="/shop" className="text-xs text-[#111111] font-bold hover:text-[#C9A227] flex items-center gap-1 uppercase tracking-wider">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredBags.map((product) => (
              <ProductCard key={product.id} product={product} formattedNum={formattedNum} currency={currency} />
            ))}
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between border-b border-[#4A4A4A]/20 pb-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#111111]">New Arrivals</h2>
              <p className="text-xs text-[#4A4A4A] font-medium">Fresh additions to our catalog</p>
            </div>
            <Link href="/shop" className="text-xs text-[#111111] font-bold hover:text-[#C9A227] flex items-center gap-1 uppercase tracking-wider">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} formattedNum={formattedNum} currency={currency} />
            ))}
          </div>
        </section>
      )}

      {/* ABOUT SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">About HBEJ Collection</h2>
        <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed italic max-w-3xl mx-auto font-medium">
          "HBEJ Collections is your destination for stylish, high-quality bags that combine fashion, functionality, and affordability. We carefully curate bags for different styles, occasions and everyday needs."
        </p>
        <div className="text-sm font-serif font-bold text-[#C9A227] uppercase tracking-widest">
          Carry Confidence.
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, formattedNum, currency }: { product: Product; formattedNum: string; currency: string }) {
  const hasMultipleColors = product.additional_images && product.additional_images.length > 0;
  
  const whatsappMsg = `Hello HBEJ Collection, I'm interested in the ${product.name}. Is it available?`;
  const whatsappUrl = `https://wa.me/${formattedNum}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="group rounded-2xl bg-white border border-[#4A4A4A]/15 overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 space-y-3 shadow-sm hover:shadow-xl transition-all">
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
}
