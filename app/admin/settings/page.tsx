'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BusinessSettings } from '@/types';
import { MessageCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>({
    id: 1,
    business_name: 'HBEJ Collection',
    whatsapp_number: '233593143270',
    email_address: 'inasmediasolutions@gmail.com',
    business_description: 'HBEJ Collection is your destination for stylish, high-quality bags that combine fashion, functionality, and affordability. We offer a carefully curated collection of handbags, tote bags, crossbody bags, backpacks, and more—perfect for every occasion. Our mission is to help you carry confidence with bags that elevate your everyday style.',
    tagline: 'Carry Confidence',
    currency: 'GH₵',
    business_location: 'Accra, Ghana',
    business_hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    hero_heading: 'Carry Confidence with Premium Bags',
    hero_description: 'Discover stylish, high-quality bags designed to complement your everyday look.',
    instagram_link: 'https://instagram.com',
    tiktok_link: 'https://tiktok.com',
    facebook_link: 'https://facebook.com',
    threads_link: 'https://threads.net',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const { data } = await supabase.from('business_settings').select('*').single();
        if (data) setSettings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setMessage('Uploading logo...');
      const fileExt = file.name.split('.').pop();
      const filePath = `settings/logo_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage.from('hbej-media').upload(filePath, file);
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('hbej-media').getPublicUrl(filePath);
      setSettings({ ...settings, business_logo: urlData.publicUrl });
      setMessage('Logo uploaded successfully!');
    } catch (err: any) {
      setMessage(`Upload error: ${err.message}`);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setMessage('Uploading hero image...');
      const fileExt = file.name.split('.').pop();
      const filePath = `settings/hero_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage.from('hbej-media').upload(filePath, file);
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('hbej-media').getPublicUrl(filePath);
      setSettings({ ...settings, hero_image: urlData.publicUrl });
      setMessage('Hero image uploaded successfully!');
    } catch (err: any) {
      setMessage(`Upload error: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');

      const { error } = await supabase
        .from('business_settings')
        .upsert([{ ...settings, id: 1, updated_at: new Date().toISOString() }]);

      if (error) throw error;
      setMessage('✅ Business Settings saved successfully! Public website updated.');
    } catch (err: any) {
      setMessage(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-neutral-900 pb-6">
        <h1 className="text-2xl font-serif font-bold text-gold-gradient">
          Business & Website Settings
        </h1>
        <p className="text-xs text-neutral-400">
          Change your WhatsApp number, email, logo, description, and currency without editing code
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> WhatsApp & Email Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-neutral-300 block mb-1">WhatsApp Number (International Format) *</label>
              <input
                type="text"
                required
                placeholder="233593143270"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
              />
              <p className="text-[10px] text-neutral-500 mt-1">Example: 233593143270 (no plus sign)</p>
            </div>

            <div>
              <label className="font-semibold text-neutral-300 block mb-1">Business Email Address *</label>
              <input
                type="email"
                required
                value={settings.email_address}
                onChange={(e) => setSettings({ ...settings, email_address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            Brand Identity & Description
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-neutral-300 block mb-1">Business Name</label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-300 block mb-1">Tagline / Slogan</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-neutral-300 block mb-1">Brand Description</label>
            <textarea
              rows={3}
              value={settings.business_description}
              onChange={(e) => setSettings({ ...settings, business_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-neutral-300 block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-300 block mb-1">Logo Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-500/10 file:text-amber-400"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            Homepage Hero Banner
          </h3>

          <div>
            <label className="font-semibold text-neutral-300 block mb-1">Hero Heading</label>
            <input
              type="text"
              value={settings.hero_heading || ''}
              onChange={(e) => setSettings({ ...settings, hero_heading: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-300 block mb-1">Hero Description</label>
            <textarea
              rows={2}
              value={settings.hero_description || ''}
              onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-300 block mb-1">Hero Banner Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroImageUpload}
              className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-500/10 file:text-amber-400"
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-300 block mb-1">Instagram Link</label>
              <input
                type="text"
                value={settings.instagram_link || ''}
                onChange={(e) => setSettings({ ...settings, instagram_link: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 block mb-1">TikTok Link</label>
              <input
                type="text"
                value={settings.tiktok_link || ''}
                onChange={(e) => setSettings({ ...settings, tiktok_link: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 block mb-1">Facebook Link</label>
              <input
                type="text"
                value={settings.facebook_link || ''}
                onChange={(e) => setSettings({ ...settings, facebook_link: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 block mb-1">Threads Link</label>
              <input
                type="text"
                value={settings.threads_link || ''}
                onChange={(e) => setSettings({ ...settings, threads_link: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-xl bg-gold-gradient text-black font-bold text-sm tracking-wider shadow-xl hover:opacity-90 transition-opacity"
        >
          {saving ? 'SAVING CHANGES...' : 'SAVE ALL SETTINGS'}
        </button>
      </form>
    </div>
  );
}
