import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { ListingGrid } from '@/components/ListingGrid';
import { ArrowRight, MapPin, Shield, TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

async function getFeaturedListings() {
  try {
    const response = await apiClient.getListings({ 
      featured: true, 
      limit: 8,
      sort: '-createdAt'
    });
    return response.data.listings || [];
  } catch (error) {
    console.error('Failed to fetch featured listings:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredListings = await getFeaturedListings();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find Your Perfect{' '}
              <span className="text-primary">Land</span> in Nigeria
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Browse thousands of verified land listings across Nigeria. 
              Find the perfect property for your dream project.
            </p>
            <div className="mt-10 flex justify-center">
              <SearchBar onSearch={(query) => console.log(query)} />
            </div>
            <div className="mt-8">
              <Link href="/listings">
                <Button size="lg" className="gap-2">
                  Browse All Listings
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Wide Coverage</h3>
              <p className="mt-2 text-sm text-gray-600">
                Properties available across all states in Nigeria
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Verified Listings</h3>
              <p className="mt-2 text-sm text-gray-600">
                All properties are verified for authenticity
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Best Deals</h3>
              <p className="mt-2 text-sm text-gray-600">
                Competitive prices and great investment opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Listings</h2>
              <p className="mt-2 text-gray-600">
                Handpicked properties just for you
              </p>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <ListingGrid listings={featuredListings} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Find Your Land?</h2>
          <p className="mt-4 text-lg text-primary-100">
            Start browsing our extensive collection of properties today
          </p>
          <div className="mt-8">
            <Link href="/listings">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}