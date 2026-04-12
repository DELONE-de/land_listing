import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
    ],
    resources: [
      { name: 'Listings', href: '/listings' },
      { name: 'Favorites', href: '/favorites' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Help Center', href: '/help' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
  ];

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-xl font-bold text-primary">LandApp</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              Find your perfect piece of land in Nigeria. Browse thousands of 
              verified listings across the country.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="mr-2 h-4 w-4" />
                contact@landapp.com
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="mr-2 h-4 w-4" />
                +234 800 123 4567
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4" />
                Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-gray-900">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-600">
              © {currentYear} LandApp. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-600 transition-colors hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}