'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Maximize, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { formatPrice } from '@/lib/utils';
import { Listing } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(listing.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  return (
    <Link href={`/listings/${listing.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={listing.images[0] || '/placeholder.jpg'}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 z-10">
            <StatusBadge status={listing.status} />
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 transition-colors hover:bg-white"
          >
            <Heart
              className={cn(
                'h-5 w-5',
                favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </button>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary">
              {listing.title}
            </h3>
          </div>
          
          <p className="mb-3 text-2xl font-bold text-primary">
            {formatPrice(listing.price)}
          </p>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{listing.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="h-4 w-4" />
              <span>
                {listing.size} {listing.sizeUnit}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span>{listing.landType}</span>
            <span>{listing.views} views</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}