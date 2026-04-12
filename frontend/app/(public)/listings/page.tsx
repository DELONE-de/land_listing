'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/SearchBar';
import ListingCard from '@/components/ListingCard';
import { useListings, ListingFilters } from '@/hooks/useListings';
import { STATES, LGA_BY_STATE } from '@/data/nigeria-locations';
import { Map, Grid } from 'lucide-react';

const ListingMap = dynamic(() => import('@/components/ListingMap'), { ssr: false });

const DOC_TYPES = ['C_OF_O','DEED_OF_ASSIGNMENT','SURVEY_PLAN','GOVERNORS_CONSENT','OTHER'];

export default function ListingsPage() {
  const [filters, setFilters] = useState<ListingFilters>({});
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const { data, isLoading } = useListings({ ...filters, page });

  const listings = data?.data ?? [];
  const pages = data?.pages ?? 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SearchBar onSearch={f => { setFilters(f); setPage(1); }} className="mb-6" />

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-5">
          <div>
            <label className="text-sm font-medium text-textPrimary block mb-1">State</label>
            <select className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              onChange={e => setFilters(f => ({ ...f, state: e.target.value, lga: '' }))}>
              <option value="">All</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {filters.state && LGA_BY_STATE[filters.state] && (
            <div>
              <label className="text-sm font-medium text-textPrimary block mb-1">LGA</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                onChange={e => setFilters(f => ({ ...f, lga: e.target.value }))}>
                <option value="">All</option>
                {LGA_BY_STATE[filters.state].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-textPrimary block mb-1">Min Price (₦)</label>
            <input type="number" placeholder="0" className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-textPrimary block mb-1">Max Price (₦)</label>
            <input type="number" placeholder="Any" className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-textPrimary block mb-1">Document Type</label>
            <select className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              onChange={e => setFilters(f => ({ ...f, documentType: e.target.value }))}>
              <option value="">All</option>
              {DOC_TYPES.map(d => <option key={d} value={d}>{d.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-textSecondary text-sm">{data?.total ?? 0} listings found</p>
            <div className="flex gap-2">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg border ${view === 'grid' ? 'border-primary text-primary' : 'border-border text-textSecondary'}`}><Grid size={16} /></button>
              <button onClick={() => setView('map')} className={`p-2 rounded-lg border ${view === 'map' ? 'border-primary text-primary' : 'border-border text-textSecondary'}`}><Map size={16} /></button>
            </div>
          </div>

          {view === 'map' ? (
            <div className="h-[600px]"><ListingMap listings={listings} /></div>
          ) : (
            <>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {listings.map((l: any) => <ListingCard key={l.id} listing={l} />)}
                </div>
              )}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium border ${p === page ? 'bg-primary text-white border-primary' : 'border-border text-textSecondary hover:border-primary'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
