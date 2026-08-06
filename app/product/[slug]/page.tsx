'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, BusinessSettings } from '@/types';
import { MessageCircle, ArrowLeft, Share2, Check } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);

        const [productRes, settingsRes] = await Promise.all([
          supabase.from('products').select('*, categories(*)').eq('slug', slug).single(),
          supabase.from('business_settings').select('*').single(),
        ]);

        if (productRes.data) {
          setProduct(productRes.data);
          setSelectedImage(productRes.data.main_image);
        }

        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (e) {
        console.error('Error fetching product detail:', e);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-neutral-500 animate-pulse">
        Loading bag details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Bag Not Found</h2>
        <p className="text-sm text-neutral-400">The requested bag model could not be found.</p>
        <Link href="/shop" className="inline-block px-6 py-2.5 bg-amber-500 text-black font-semibold text-xs rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const whatsappNum = settings?.whatsapp_number || '233593143270';
  const currency = settings?.currency || 'GH₵';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const whatsappMessage = `Hello HBEJ Collection 👋\n\nI'm interested in this bag:\n*${product.name}*\nPrice: ${currency}${product.price}\n\nProduct Link:\n${currentUrl}\n\nIs this bag currently available?`;
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <div>
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400">
          <ArrowLeft className="w-4 h-4" /> Back to Shop Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-900">
            <img
              src={selectedImage || product.main_image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
              {product.categories?.name || 'Bag'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
              {product.name}
            </h1>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-3">
              {currency}{product.price.toLocaleString()}
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-6 h-6 fill-current" />
              ORDER VIA WHATSAPP
            </a>

            <button
              onClick={handleShare}
              className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium text-xs border border-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Share Product Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
