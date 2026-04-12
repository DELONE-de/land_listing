'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface TrackViewProps {
  listingId: string;
}

export function TrackView({ listingId }: TrackViewProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await apiClient.trackView(listingId);
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    // Track view after a short delay to avoid tracking bots
    const timeout = setTimeout(trackView, 2000);
    return () => clearTimeout(timeout);
  }, [listingId]);

  return null;
}