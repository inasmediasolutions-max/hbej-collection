'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BusinessSettings } from '@/types';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings>({
    id: 1,
    business_name: 'HBEJ Collection',
    whatsapp_number: '0593143270',
    email_address: 'inasmediasolutions@gmail.com',
    business_description: 'HBEJ Collections is your destination for stylish, high-quality bags that combine fashion, functionality, and affordability. We offer a carefully curated collection of handbags, tote bags, crossbody bags, backpacks, and more, perfect for every occasion. Our mission is to help you carry confidence with bags that elevate your everyday style.',
    tagline: 'Carry Confidence',
    currency: 'GH₵',
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await supabase.from('business_settings').select('*').single();
        if (data) setSettings(data);
      } catch (e) {
        console.error('Settings load error:', e);
      }
    }
    fetchSettings();
  }, []);

  const rawNum = settings.whatsapp_number.replace(/\D/g, '');
  const formattedNum = rawNum.startsWith('0') ? '233' + rawNum.slice(1) : rawNum.startsWith('233') ? rawNum : '233' + rawNum;

  const generalWhatsappLink = `https://wa.me/${formattedNum}?text=${encodeURIComponent(
    'Hello HBEJ Collection, I would like to make an enquiry about your bags.'
  )}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent('https://hbej-collection.vercel.app/')}&color=111111&bgcolor=F7F3EA`;

  return (
    <html lang="en">
      <head>
        <title>HBEJ Collection | Stylish & Affordable Bags</title>
        <meta name="description" content="Discover stylish, high-quality and affordable bags from HBEJ Collection. Browse our collection and order directly through WhatsApp." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* Open Graph / Social Media Preview */}
        <meta property="og:title" content="HBEJ Collection | Stylish & Affordable Bags" />
        <meta property="og:description" content="Discover stylish, high-quality and affordable bags from HBEJ Collection. Browse our collection and order directly through WhatsApp." />
        <meta property="og:url" content="https://hbej-collection.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HBEJ Collection" />
      </head>
      <body className="bg-[#F7F3EA] text-[#111111] min-h-screen flex flex-col font-sans">
        {/* TOP ANNOUNCEMENT BAR */}
        <div className="bg-[#111111] text-[#F7F3EA] text-[11px] sm:text-xs font-semibold py-2 text-center px-4 tracking-wider uppercase overflow-hidden text-ellipsis whitespace-nowrap">
          ✨ HBEJ COLLECTION — STYLE THAT CARRIES CONFIDENCE | ORDER VIA WHATSAPP ✨
        </div>

        {/* STICKY NAVIGATION */}
        <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {settings.business_logo ? (
                <img src={settings.business_logo} alt={settings.business_name} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#111111] text-[#C9A227] font-bold text-xl flex items-center justify-center border border-[#C9A227]/40 shadow-sm group-hover:scale-105 transition-transform">
                  H
                </div>
              )}
              <div>
                <span className="text-xl sm:text-2xl font-serif font-extrabold tracking-wider text-[#111111] block leading-none">
                  {settings.business_name}
                </span>
                <span className="text-[10px] tracking-widest text-[#4A4A4A] uppercase font-sans font-bold">
                  {settings.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 font-semibold text-xs tracking-wider uppercase text-[#111111]">
              <Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link>
              <Link href="/shop" className="hover:text-[#C9A227] transition-colors">Shop Catalog</Link>
              <Link href="/about" className="hover:text-[#C9A227] transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-[#C9A227] transition-colors">Contact</Link>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={generalWhatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-105 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#111111]" />
                WhatsApp Us
              </a>
              <Link
                href="/admin/login"
                className="text-[11px] text-[#4A4A4A] hover:text-[#111111] font-bold transition-colors px-3 py-1.5 border border-[#4A4A4A]/20 rounded-md hover:border-[#C9A227]"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#111111] hover:text-[#C9A227]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

          {/* Mobile Drawer Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-[#C9A227]/30 bg-[#F7F3EA] px-6 py-6 space-y-4 shadow-xl">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-[#111111] hover:text-[#C9A227] py-1 uppercase tracking-wider"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-[#111111] hover:text-[#C9A227] py-1 uppercase tracking-wider"
              >
                Shop Catalog
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-[#111111] hover:text-[#C9A227] py-1 uppercase tracking-wider"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-[#111111] hover:text-[#C9A227] py-1 uppercase tracking-wider"
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-[#4A4A4A]/20 flex flex-col gap-3">
                <a
                  href={generalWhatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#C9A227] text-[#111111] py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Chat on WhatsApp
                </a>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs text-[#4A4A4A] font-bold py-2 uppercase"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-grow">{children}</main>

        {/* FLOATING WHATSAPP BUTTON */}
        <a
          href={generalWhatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group font-bold border-2 border-white"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs uppercase ml-0 group-hover:ml-2 tracking-wider">
            Order via WhatsApp
          </span>
        </a>

        {/* FOOTER */}
        <footer className="bg-[#111111] text-[#F7F3EA] border-t border-[#C9A227]/30 pt-16 pb-12 text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4 md:col-span-1">
              <span className="text-2xl font-serif font-extrabold text-[#C9A227] block tracking-wider">
                {settings.business_name}
              </span>
              <p className="text-xs leading-relaxed text-neutral-400 font-medium">
                {settings.business_description}
              </p>
              <div className="text-xs text-[#C9A227] font-serif italic font-bold">
                "{settings.tagline}"
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-widest text-[#C9A227]">Quick Links</h3>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link></li>
                <li><Link href="/shop" className="hover:text-[#C9A227] transition-colors">Shop Catalog</Link></li>
                <li><Link href="/about" className="hover:text-[#C9A227] transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#C9A227] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-widest text-[#C9A227]">Contact Information</h3>
              <p className="text-xs mb-2 text-neutral-300">WhatsApp: <a href={generalWhatsappLink} className="text-[#C9A227] hover:underline font-bold">+{formattedNum}</a></p>
              <p className="text-xs mb-4 text-neutral-300">Email: <span className="font-bold text-white">{settings.email_address}</span></p>
              <p className="text-xs text-neutral-400">Website: <a href="https://hbej-collection.vercel.app/" className="hover:underline text-neutral-300">hbej-collection.vercel.app</a></p>
            </div>

            {/* QR CODE SECTION */}
            <div className="space-y-3">
              <h3 className="text-white font-bold text-xs uppercase tracking-widest text-[#C9A227]">SCAN TO SHOP</h3>
              <p className="text-[11px] text-neutral-400 font-medium">Visit HBEJ Collection online</p>
              <div className="p-2 bg-[#F7F3EA] rounded-xl inline-block border-2 border-[#C9A227]">
                <img src={qrCodeUrl} alt="Scan to shop HBEJ Collection" className="w-28 h-28 object-contain" />
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500 font-medium">
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved. Carry Confidence.
          </div>
        </footer>
      </body>
    </html>
  );
}
