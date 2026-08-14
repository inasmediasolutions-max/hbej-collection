'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, BusinessSettings } from '@/types';
import { MessageCircle, ArrowLeft, Share2, Check, Palette, Video, Play } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showVideo, setShowVideo] = useState<boolean>(false);
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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#4A4A4A] animate-pulse font-medium">
        Loading bag details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#111111]">Bag Not Found</h2>
        <p className="text-sm text-[#4A4A4A]">The requested bag model could not be found.</p>
        <Link href="/shop" className="inline-block px-6 py-2.5 bg-[#C9A227] text-[#111111] font-bold text-xs rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const rawNum = (settings?.whatsapp_number || '0593143270').replace(/\D/g, '');
  const formattedNum = rawNum.startsWith('0') ? '233' + rawNum.slice(1) : rawNum.startsWith('233') ? rawNum : '233' + rawNum;
  const currency = settings?.currency || 'GH₵';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const hasMultipleColors = product.additional_images && product.additional_images.length > 0;
  const hasVideo = !!product.video_url;

  const whatsappMessage = `Hello HBEJ Collection, I'm interested in the ${product.name}. Is it available?`;
  const whatsappUrl = `https://wa.me/${formattedNum}?text=${encodeURIComponent(whatsappMessage)}`;

  const allImages = [product.main_image, ...(product.additional_images || [])];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-[#F7F3EA] text-[#111111]">
      <div>
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-[#4A4A4A] hover:text-[#C9A227]">
          <ArrowLeft className="w-4 h-4" /> Back to Shop Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Gallery & Video */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border-2 border-[#C9A227]/30 shadow-xl">
            {showVideo && product.video_url ? (
              <video
                src={product.video_url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover bg-black"
              />
            ) : (
              <img
                src={selectedImage || product.main_image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            )}

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hasMultipleColors && (
                <div className="bg-[#111111] text-[#C9A227] border border-[#C9A227]/40 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                  <Palette className="w-3.5 h-3.5 text-[#C9A227]" />
                  Available in different colors
                </div>
              )}
              {hasVideo && (
                <div className="bg-[#111111] text-blue-400 border border-blue-400/40 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                  <Video className="w-3.5 h-3.5 text-blue-400" />
                  Video Preview Available
                </div>
              )}
            </div>
          </div>

          {/* Media Thumbnails (Photos & Video Toggle) */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-[#4A4A4A] font-bold block">
              Tap to view options:
            </span>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {/* Video Button Thumbnail */}
              {hasVideo && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#111111] border-2 transition-all flex-shrink-0 flex flex-col items-center justify-center gap-1 text-white ${
                    showVideo ? 'border-[#C9A227] scale-105 shadow-md' : 'border-[#4A4A4A]/30 opacity-80 hover:opacity-100'
                  }`}
                >
                  <Play className="w-6 h-6 text-[#C9A227] fill-current" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C9A227]">Watch Video</span>
                </button>
              )}

              {/* Image Thumbnails */}
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(img);
                    setShowVideo(false);
                  }}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 transition-all flex-shrink-0 ${
                    !showVideo && selectedImage === img ? 'border-[#C9A227] scale-105 shadow-md' : 'border-[#4A4A4A]/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold tracking-wider text-[#C9A227] uppercase">
              {product.categories?.name || 'Bag'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mt-1">
              {product.name}
            </h1>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-3">
              {currency}{product.price.toLocaleString()}
            </div>

            {hasMultipleColors && (
              <div className="mt-4 p-3 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#111111] text-xs font-bold flex items-center gap-2 shadow-sm">
                <Palette className="w-4 h-4 text-[#111111] flex-shrink-0" />
                <span>Available in different colors! Tap photos on the left to see all options.</span>
              </div>
            )}
          </div>

          {product.short_description && (
            <p className="text-sm text-[#4A4A4A] leading-relaxed border-t border-[#4A4A4A]/20 pt-4 font-medium">
              {product.short_description}
            </p>
          )}

          <div className="pt-2 space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02]"
            >
              <MessageCircle className="w-6 h-6 fill-current text-[#111111]" />
              CHAT ON WHATSAPP
            </a>

            <button
              onClick={handleShare}
              className="w-full py-3 rounded-2xl bg-white hover:bg-[#F2EFE9] text-[#111111] font-bold text-xs border border-[#4A4A4A]/20 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-[#4A4A4A]" />}
              {copied ? 'Link Copied!' : 'Share Product Link'}
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#4A4A4A]/20 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] border-b border-[#4A4A4A]/20 pb-2">
              Bag Specifications
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              {product.material && (
                <div>
                  <span className="text-[#4A4A4A]">Material:</span> <span className="text-[#111111] font-bold">{product.material}</span>
                </div>
              )}
              {product.color && (
                <div>
                  <span className="text-[#4A4A4A]">Main Color:</span> <span className="text-[#111111] font-bold">{product.color}</span>
                </div>
              )}
              {hasMultipleColors && (
                <div>
                  <span className="text-[#4A4A4A]">Color Options:</span> <span className="text-[#111111] font-extrabold">Available in different colors</span>
                </div>
              )}
              {hasVideo && (
                <div>
                  <span className="text-[#4A4A4A]">Video Showcase:</span> <span className="text-blue-600 font-extrabold">Video Available</span>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="text-[#4A4A4A]">Dimensions:</span> <span className="text-[#111111] font-bold">{product.dimensions}</span>
                </div>
              )}
              {product.compartments && (
                <div>
                  <span className="text-[#4A4A4A]">Compartments:</span> <span className="text-[#111111] font-bold">{product.compartments}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
