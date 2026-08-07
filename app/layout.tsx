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
    whatsapp_number: '233593143270',
    email_address: 'inasmediasolutions@gmail.com',
    business_description: 'HBEJ Collection is your destination for stylish, high-quality bags that combine fashion, functionality, and affordability.',
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

  const whatsappLink = `https://wa.me/${settings.whatsapp_number.replace(/\+/g, '')}?text=${encodeURIComponent(
    `Hello ${settings.business_name} 👋\n\nI came from your website and would like to make an inquiry!`
  )}`;

  return (
    <html lang="en">
      <head>
        <title>{settings.business_name} | Premium Bags</title>
        <meta name="description" content={settings.business_description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-[#F8F6F2] text-[#111111] min-h-screen flex flex-col font-sans">
        {/* Top Banner */}
        <div className="bg-[#C9A227] text-[#111111] text-xs sm:text-sm font-bold py-2 text-center px-4 tracking-wide shadow-sm">
          ✨ Welcome to {settings.business_name} — High-Quality Stylish Bags | Order via WhatsApp ✨
        </div>

        {/* Sticky Header */}
        <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {settings.business_logo ? (
                <img src={settings.business_logo} alt={settings.business_name} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center text-[#111111] font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                  H
                </div>
              )}
              <div>
                <span className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-[#111111] block leading-none">
                  {settings.business_name}
                </span>
                <span className="text-[10px] tracking-widest text-[#4A4A4A] uppercase font-sans font-semibold">
                  {settings.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-[#111111]">
              <Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link>
              <Link href="/shop" className="hover:text-[#C9A227] transition-colors">Shop Catalog</Link>
              <Link href="/about" className="hover:text-[#C9A227] transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-[#C9A227] transition-colors">Contact</Link>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] px-5 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#111111]" />
                WhatsApp Us
              </a>
              <Link
                href="/admin/login"
                className="text-xs text-[#4A4A4A] hover:text-[#111111] font-semibold transition-colors px-3 py-1.5 border border-[#4A4A4A]/30 rounded-md hover:border-[#C9A227]"
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
            <div className="md:hidden border-t border-[#C9A227]/30 bg-[#F8F6F2] px-6 py-6 space-y-4 shadow-xl">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-[#111111] hover:text-[#C9A227] py-1"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-[#111111] hover:text-[#C9A227] py-1"
              >
                Shop Catalog
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-[#111111] hover:text-[#C9A227] py-1"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-bold text-[#111111] hover:text-[#C9A227] py-1"
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-[#4A4A4A]/20 flex flex-col gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#C9A227] text-[#111111] py-3 rounded-xl font-bold shadow-md"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Chat on WhatsApp
                </a>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs text-[#4A4A4A] font-semibold py-2"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Floating WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#C9A227] hover:bg-[#B58F1F] text-[#111111] p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group font-bold"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-sm ml-0 group-hover:ml-2">
            Order via WhatsApp
          </span>
        </a>

        {/* Footer */}
        <footer className="bg-[#111111] border-t border-neutral-800 pt-16 pb-12 text-neutral-400 text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4 md:col-span-1">
              <span className="text-2xl font-serif font-bold text-[#C9A227] block">
                {settings.business_name}
              </span>
              <p className="text-xs leading-relaxed text-neutral-400">
                {settings.business_description}
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/" className="hover:text-[#C9A227] transition-colors">Home</Link></li>
                <li><Link href="/shop" className="hover:text-[#C9A227] transition-colors">All Bags</Link></li>
                <li><Link href="/about" className="hover:text-[#C9A227] transition-colors">About Brand</Link></li>
                <li><Link href="/contact" className="hover:text-[#C9A227] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/shop?category=handbags" className="hover:text-[#C9A227] transition-colors">Handbags</Link></li>
                <li><Link href="/shop?category=tote-bags" className="hover:text-[#C9A227] transition-colors">Tote Bags</Link></li>
                <li><Link href="/shop?category=crossbody-bags" className="hover:text-[#C9A227] transition-colors">Crossbody Bags</Link></li>
                <li><Link href="/shop?category=luxury-collection" className="hover:text-[#C9A227] transition-colors">Luxury Collection</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact & Socials</h3>
              <p className="text-xs mb-2">WhatsApp: <a href={whatsappLink} className="text-[#C9A227] hover:underline">+{settings.whatsapp_number}</a></p>
              <p className="text-xs mb-4">Email: {settings.email_address}</p>
              <div className="flex items-center gap-3">
                {settings.instagram_link && (
                  <a href={settings.instagram_link} target="_blank" rel="noreferrer" className="p-2 bg-neutral-900 rounded-full hover:text-[#C9A227]">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.facebook_link && (
                  <a href={settings.facebook_link} target="_blank" rel="noreferrer" className="p-2 bg-neutral-900 rounded-full hover:text-[#C9A227]">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-neutral-900 text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved. Built with elegance.
          </div>
        </footer>
      </body>
    </html>
  );
}
