'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, ShoppingBag, FolderTree, Settings, LogOut, ExternalLink } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/admin/login');
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    }

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-amber-400 flex items-center justify-center text-sm font-semibold">
        Securing Admin Workspace...
      </div>
    );
  }

  if (!authenticated) return null;

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Business Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-900 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <span className="text-xl font-serif font-bold text-gold-gradient block">
              HBEJ Admin
            </span>
            <span className="text-[10px] uppercase text-neutral-500 tracking-wider">
              Catalog Management
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-neutral-900 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
