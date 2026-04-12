'use client';

import { useState, useEffect } from 'react';
import { ListingGrid } from '@/components/ListingGrid';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { apiClient } from '@/lib/api-client';
import { Listing } from '@/lib/types';

export default function FavoritesPage() {
  const { favorites, clearFavorites, isLoaded } = useFavorites();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && favorites.length > 0) {
      fetchFavoriteListings();
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [favorites, isLoaded]);

  const fetchFavoriteListings = async () => {
    try {
      setLoading(true);
      const promises = favorites.map(id => apiClient.getListing(id));
      const results = await Promise.allSettled(promises);
      
      const validListings = results
        .filter((result): result is PromiseFulfilledResult<any> => 
          result.status === 'fulfilled' && result.value.success
        )
        .map(result => result.value.data);
      
      setListings(validListings);
    } catch (error) {
      console.error('Failed to fetch favorite listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      clearFavorites();
      setListings([]);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Heart className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">No Favorites Yet</h1>
          <p className="mt-2 text-gray-600">
            Start adding properties to your favorites to see them here.
          </p>
          <Button className="mt-6" asChild>
            <a href="/listings">Browse Listings</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="mt-2 text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleClearAll}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      <ListingGrid listings={listings} />
    </div>
  );
}
