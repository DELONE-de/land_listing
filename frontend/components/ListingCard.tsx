'use client';
import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import StatusBadge from './StatusBadge';

interface Listing {
  id: string; slug: string; title: string; price: number;
  state: string; lga: string; size: number; sizeUnit: string;
  documentType: string; status: string; images: string[];
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const { isFavorite, toggle } = useFavorites();

  return (
    <motion.div whileHover={{ y: -4 }} className="bg-surface rounded-xl overflow-hidden shadow-sm border border-border">
      <Link href={`/listings/${listing.slug}`}>
        <div className="relative h-48 w-full">
          <Image src={listing.images[0] || '/placeholder.jpg'} alt={listing.title} fill className="object-cover" loading="lazy" />
          <div className="absolute top-2 left-2"><StatusBadge status={listing.status} /></div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link href={`/listings/${listing.slug}`}>
            <h3 className="font-semibold text-textPrimary line-clamp-1 hover:text-primary">{listing.title}</h3>
          </Link>
          <button onClick={() => toggle(listing.id)} className="text-textSecondary hover:text-red-500 transition-colors">
            <Heart size={18} fill={isFavorite(listing.id) ? 'currentColor' : 'none'} className={isFavorite(listing.id) ? 'text-red-500' : ''} />
          </button>
        </div>
        <p className="text-primary font-bold text-lg mt-1">{formatPrice(listing.price)}</p>
        <div className="flex items-center gap-1 text-textSecondary text-sm mt-1">
          <MapPin size={14} /><span>{listing.lga}, {listing.state}</span>
        </div>
        <div className="flex gap-2 mt-2 text-xs text-textSecondary">
          <span>{listing.size} {listing.sizeUnit}</span>
          <span>•</span>
          <span>{listing.documentType.replace(/_/g, ' ')}</span>
        </div>
      </div>
    </motion.div>
  );
}
