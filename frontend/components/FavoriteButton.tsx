'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  listingId: string;
}

export function FavoriteButton({ listingId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(listingId);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => toggleFavorite(listingId)}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          favorite ? 'fill-red-500 text-red-500' : ''
        )}
      />
    </Button>
  );
}