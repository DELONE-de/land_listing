'use client';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ListingCard from '@/components/ListingCard';
import { useListings, ListingFilters } from '@/hooks/useListings';

export default function HomePage() {
  const [filters, setFilters] = useState<ListingFilters>({});
  const { data, isLoading } = useListings({ ...filters, limit: 6 } as any);

  return (
    <main>
      {/* Hero */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Find Land Across Nigeria</h1>
          <p className="text-green-100 text-lg">Browse verified land listings with genuine documents</p>
          <SearchBar onSearch={setFilters} className="bg-white/10 p-2 rounded-xl" />
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-textPrimary mb-6">Featured Listings</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((listing: any) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-secondary text-white py-14 px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">List Your Land Today</h2>
        <p className="text-blue-100 mb-6">Reach thousands of buyers across Nigeria</p>
        <a href="/contact" className="bg-white text-secondary font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-block">
          Get Started
        </a>
      </section>
    </main>
  );
}
