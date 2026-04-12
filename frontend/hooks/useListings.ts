import useSWR from 'swr';
import api from '@/lib/api-client';

export interface ListingFilters {
  state?: string; lga?: string; status?: string;
  minPrice?: string; maxPrice?: string;
  documentType?: string; search?: string; page?: number;
}

const toQuery = (f: ListingFilters) =>
  '?' + new URLSearchParams(
    Object.entries(f).filter(([, v]) => v).map(([k, v]) => [k, String(v)])
  ).toString();

export const useListings = (filters: ListingFilters = {}) => {
  const key = `/listings${toQuery(filters)}`;
  return useSWR(key, () => api.get<any>(key));
};
