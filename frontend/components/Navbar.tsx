'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/listings', label: 'Listings' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">LandApp 🇳🇬</Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-textSecondary hover:text-primary transition-colors text-sm font-medium">{l.label}</Link>
          ))}
          <Link href="/admin/dashboard" className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">Admin</Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-textSecondary hover:text-primary text-sm font-medium">{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
