'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Listing, FilterParams } from '@/lib/types';

export function useListings(initialParams?: FilterParams) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<FilterParams>(initialParams || {});

  useEffect(() => {
    fetchListings();
  }, [params]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getListings(params);
      
      if (response.success) {
        setListings(response.data.listings || response.data);
        setTotal(response.data.total || response.data.length);
      } else {
        setError(response.message || 'Failed to fetch listings');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (newParams: Partial<FilterParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const resetParams = () => {
    setParams(initialParams || {});
  };

  return {
    listings,
    loading,
    error,
    total,
    params,
    updateParams,
    resetParams,
    refetch: fetchListings,
  };
}