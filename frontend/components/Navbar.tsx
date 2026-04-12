'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites } = useFavorites();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Listings', href: '/listings' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold text-primary">LandApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/dashboard" className="hidden md:block">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden',
            mobileMenuOpen ? 'block' : 'hidden'
          )}
        >
          <div className="space-y-1 pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}