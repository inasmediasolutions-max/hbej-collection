'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, BusinessSettings } from '@/types';
import { MessageCircle, ArrowLeft, Share2, Check, Palette } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
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

          if (productRes.data.category_id) {
            const { data: related } = await supabase
              .from('products')
              .select('*, categories(*)')
              .eq('category_id', productRes.data.category_id)
              .neq('id', productRes.data.id)
              .limit(4);
            if (related) setRelatedProducts(related);
          }
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

  const hasMultipleColors = product.additional_images && product.additional_images.length > 0;

  const whatsappMessage = `Hello HBEJ Collection 👋\n\nI'm interested in this bag:\n*${product.name}*\nPrice: ${currency}${product.price}\n${hasMultipleColors ? '(Available in different colors)\n' : ''}Product Link:\n${currentUrl}\n\nIs this bag currently available?`;
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMessage)}`;

  const allImages = [product.main_image, ...(product.additional_images || [])];

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
        {/* Left Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-900">
            <img
              src={selectedImage || product.main_image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {hasMultipleColors && (
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-full text-amber-400 text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                <Palette className="w-3.5 h-3.5" />
                Available in different colors
              </div>
            )}
          </div>

          {/* Color Option Thumbnails */}
          {allImages.length > 1 && (
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                Tap to view color options ({allImages.length}):
              </span>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-900 border-2 transition-all flex-shrink-0 ${
                      selectedImage === img ? 'border-amber-400 scale-105 shadow-lg shadow-amber-500/20' : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Details */}
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

            {hasMultipleColors && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Available in different colors! Tap photos on the left to see all options.</span>
              </div>
            )}
          </div>

          {product.short_description && (
            <p className="text-sm text-neutral-300 leading-relaxed border-t border-neutral-900 pt-4">
              {product.short_description}
            </p>
          )}

          <div className="pt-2 space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02]"
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

          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-2">
              Bag Specifications
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              {product.material && (
                <div>
                  <span className="text-neutral-500">Material:</span> <span className="text-neutral-200 font-medium">{product.material}</span>
                </div>
              )}
              {product.color && (
                <div>
                  <span className="text-neutral-500">Main Color:</span> <span className="text-neutral-200 font-medium">{product.color}</span>
                </div>
              )}
              {hasMultipleColors && (
                <div>
                  <span className="text-neutral-500">Color Options:</span> <span className="text-amber-400 font-medium">Available in different colors</span>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="text-neutral-500">Dimensions:</span> <span className="text-neutral-200 font-medium">{product.dimensions}</span>
                </div>
              )}
              {product.compartments && (
                <div>
                  <span className="text-neutral-500">Compartments:</span> <span className="text-neutral-200 font-medium">{product.compartments}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
