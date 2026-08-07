'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BusinessSettings } from '@/types';
import { Sparkles, Heart, ShieldCheck, MessageCircle } from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('business_settings').select('*').single();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, []);

  const whatsappNum = settings?.whatsapp_number || '233593143270';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-[#F8F6F2] text-[#111111]">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C9A227]/40 text-[#111111] text-xs font-bold uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
          Our Brand Story
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#111111]">
          About {settings?.business_name || 'HBEJ Collection'}
        </h1>
        <p className="text-sm text-[#4A4A4A] tracking-wide uppercase font-bold">
          {settings?.tagline || 'Carry Confidence'}
        </p>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-[#C9A227]/30 text-center space-y-6 shadow-xl relative overflow-hidden">
        <p className="text-base sm:text-xl text-[#111111] leading-relaxed font-serif italic max-w-3xl mx-auto font-medium">
          "{settings?.business_description || 'HBEJ Collection is your destination for stylish, high-quality bags that combine fashion, functionality, and affordability.'}"
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#4A4A4A]/20 text-center space-y-3 shadow-sm">
          <Heart className="w-8 h-8 mx-auto text-[#C9A227]" />
          <h3 className="font-bold text-[#111111]">Fashion & Elegance</h3>
          <p className="text-xs text-[#4A4A4A] leading-relaxed font-medium">
            Every bag in our collection is carefully chosen to enhance your personal style.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#4A4A4A]/20 text-center space-y-3 shadow-sm">
          <ShieldCheck className="w-8 h-8 mx-auto text-[#C9A227]" />
          <h3 className="font-bold text-[#111111]">Quality & Durability</h3>
          <p className="text-xs text-[#4A4A4A] leading-relaxed font-medium">
            We prioritize premium craftsmanship, strong hardware, and reliable materials.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#4A4A4A]/20 text-center space-y-3 shadow-sm">
          <MessageCircle className="w-8 h-8 mx-auto text-[#C9A227] fill-current" />
          <h3 className="font-bold text-[#111111]">Direct WhatsApp Service</h3>
          <p className="text-xs text-[#4A4A4A] leading-relaxed font-medium">
            Personalized customer service right inside WhatsApp. Effortless ordering.
          </p>
        </div>
      </div>

      <div className="text-center space-y-4 pt-8">
        <h3 className="text-xl font-serif font-bold text-[#111111]">Ready to elevate your everyday style?</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="px-8 py-3.5 rounded-xl bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Browse All Bags
          </Link>
          <a
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello! I would like to learn more about HBEJ Collection.')}`}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            Chat with Us
          </a>
        </div>
      </div>
    </div>
  );
}
