'use client';
import { useFavorites } from '@/hooks/useFavorites';
import useSWR from 'swr';
import api from '@/lib/api-client';
import ListingCard from '@/components/ListingCard';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  // Fetch all listings and filter by favorites (simple approach for localStorage-based favorites)
  const { data } = useSWR('/listings?limit=100', () => api.get<any>('/listings?limit=100'));
  const favListings = (data?.data ?? []).filter((l: any) => favorites.includes(l.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-2">
        <Heart size={22} className="text-red-500" /> Saved Listings
      </h1>
      {favListings.length === 0 ? (
        <p className="text-textSecondary text-center py-20">No saved listings yet. Heart a listing to save it.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favListings.map((l: any) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
