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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Our Brand Story
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gold-gradient">
          About {settings?.business_name || 'HBEJ Collection'}
        </h1>
        <p className="text-sm text-neutral-400 tracking-wide uppercase">
          {settings?.tagline || 'Carry Confidence'}
        </p>
      </div>

      <div className="p-8 sm:p-12 rounded-3xl bg-neutral-950 border border-neutral-900 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <p className="text-base sm:text-xl text-neutral-200 leading-relaxed font-serif italic max-w-3xl mx-auto">
          "{settings?.business_description || 'HBEJ Collection is your destination for stylish, high-quality bags that combine fashion, functionality, and affordability.'}"
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
          <Heart className="w-8 h-8 mx-auto text-amber-400" />
          <h3 className="font-semibold text-white">Fashion & Elegance</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Every bag in our collection is carefully chosen to enhance your personal style.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
          <ShieldCheck className="w-8 h-8 mx-auto text-amber-400" />
          <h3 className="font-semibold text-white">Quality & Durability</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            We prioritize premium craftsmanship, strong hardware, and reliable materials.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
          <MessageCircle className="w-8 h-8 mx-auto text-amber-400 fill-current" />
          <h3 className="font-semibold text-white">Direct WhatsApp Service</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Personalized customer service right inside WhatsApp. Effortless ordering.
          </p>
        </div>
      </div>

      <div className="text-center space-y-4 pt-8">
        <h3 className="text-xl font-serif font-bold text-white">Ready to elevate your everyday style?</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="px-8 py-3.5 rounded-xl bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity"
          >
            Browse All Bags
          </Link>
          <a
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello! I would like to learn more about HBEJ Collection.')}`}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Chat with Us
          </a>
        </div>
      </div>
    </div>
  );
}
