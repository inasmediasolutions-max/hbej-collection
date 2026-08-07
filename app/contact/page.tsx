'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BusinessSettings } from '@/types';
import { MessageCircle, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('business_settings').select('*').single();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, []);

  const whatsappNum = settings?.whatsapp_number || '233593143270';
  const email = settings?.email_address || 'inasmediasolutions@gmail.com';

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello HBEJ Collection 👋\n\nI would like to make an inquiry.')}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-[#F8F6F2] text-[#111111]">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
          Contact HBEJ Collection
        </h1>
        <p className="text-sm text-[#4A4A4A] font-medium max-w-lg mx-auto">
          We are here to assist you with bag availability, recommendations, and orders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-[#4A4A4A]/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 text-[#111111] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 fill-current text-[#111111]" />
            </div>
            <h3 className="font-bold text-[#111111]">WhatsApp Orders & Inquiries</h3>
            <p className="text-xs text-[#4A4A4A]">
              Fastest response time. Click below to chat with us on WhatsApp.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] font-bold text-xs transition-colors shadow-sm"
            >
              Start WhatsApp Chat
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#4A4A4A]/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 text-[#111111] flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#111111]" />
            </div>
            <h3 className="font-bold text-[#111111]">Business Email</h3>
            <p className="text-xs text-[#4A4A4A] font-medium">{email}</p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#4A4A4A]/20 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-xl text-[#111111] border-b border-[#4A4A4A]/20 pb-3">
            Business Information
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#111111] block mb-0.5">Location</span>
                <span className="text-[#4A4A4A] font-medium">{settings?.business_location || 'Accra, Ghana'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#111111] block mb-0.5">Business Hours</span>
                <span className="text-[#4A4A4A] font-medium">{settings?.business_hours || 'Mon - Sat: 8:00 AM - 6:00 PM'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
