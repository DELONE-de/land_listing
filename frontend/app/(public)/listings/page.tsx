'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ListingGrid } from '@/components/ListingGrid';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SlidersHorizontal, X } from 'lucide-react';
import { useListings } from '@/hooks/useListings';
import { FilterParams } from '@/lib/types';

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsContent />
    </Suspense>
  );
}

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    landType: searchParams.get('landType') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: searchParams.get('sort') || '-createdAt',
    page: 1,
    limit: 12,
  });

  const { listings, loading, error, total, updateParams } = useListings(filters);

  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query, page: 1 });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: '',
      landType: '',
      minPrice: undefined,
      maxPrice: undefined,
      sort: '-createdAt',
      page: 1,
      limit: 12,
    });
  };

  useEffect(() => {
    updateParams(filters);
  }, [filters]);

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== '' && value !== undefined && value !== '-createdAt'
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Listings</h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchBar onSearch={handleSearch} />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={handleClearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8 rounded-lg border bg-card p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>Location</Label>
              <Input
                placeholder="Enter location"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            <div>
              <Label>Land Type</Label>
              <Select
                value={filters.landType || 'all'}
                onValueChange={(value) => handleFilterChange('landType', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                  <SelectItem value="AGRICULTURAL">Agricultural</SelectItem>
                  <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Min Price (₦)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div>
              <Label>Max Price (₦)</Label>
              <Input
                type="number"
                placeholder="No limit"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sort and Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${total} properties found`}
        </p>
        <Select
          value={filters.sort || '-createdAt'}
          onValueChange={(value) => handleFilterChange('sort', value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-createdAt">Newest First</SelectItem>
            <SelectItem value="createdAt">Oldest First</SelectItem>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="-price">Price: High to Low</SelectItem>
            <SelectItem value="-views">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings Grid */}
      {error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading listings...</p>
        </div>
      ) : (
        <ListingGrid listings={listings} />
      )}

      {/* Pagination */}
      {total > (filters.limit || 12) && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={(filters.page || 1) * (filters.limit || 12) >= total}
            onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}