'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import api from '@/lib/api-client';
import ImageGallery from '@/components/ImageGallery';
import WhatsAppButton from '@/components/WhatsAppButton';
import StatusBadge from '@/components/StatusBadge';
import { formatPrice, formatDate } from '@/lib/utils';
import { MapPin, Calendar, FileText, Maximize2, Share2 } from 'lucide-react';

const ListingMap = dynamic(() => import('@/components/ListingMap'), { ssr: false });

export default function ListingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: listing, isLoading } = useSWR(`/listings/${slug}`, () => api.get<any>(`/listings/${slug}`));

  useEffect(() => {
    if (listing) api.post(`/listings/${listing.id}/track-click`, { event: 'view' }).catch(() => {});
  }, [listing]);

  const handleShare = async () => {
    if (listing) {
      await api.post(`/listings/${listing.id}/track-click`, { event: 'share' }).catch(() => {});
      navigator.share?.({ title: listing.title, url: window.location.href }) ?? navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-4"><div className="h-80 bg-gray-100 rounded-xl" /><div className="h-6 bg-gray-100 rounded w-1/2" /></div>;
  if (!listing) return <div className="text-center py-20 text-textSecondary">Listing not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <ImageGallery images={listing.images} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={listing.status} />
            <span className="text-xs text-textSecondary">{listing.documentType.replace(/_/g, ' ')}</span>
          </div>
          <h1 className="text-2xl font-bold text-textPrimary">{listing.title}</h1>
          <p className="text-primary text-2xl font-bold mt-1">{formatPrice(listing.price)}</p>
        </div>
        <button onClick={handleShare} className="flex items-center gap-1.5 text-sm text-textSecondary border border-border px-3 py-2 rounded-lg hover:border-primary hover:text-primary transition-colors">
          <Share2 size={15} /> Share
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2 text-textSecondary"><MapPin size={15} />{listing.lga}, {listing.state}</div>
        <div className="flex items-center gap-2 text-textSecondary"><Maximize2 size={15} />{listing.size} {listing.sizeUnit}</div>
        <div className="flex items-center gap-2 text-textSecondary"><FileText size={15} />{listing.documentType.replace(/_/g, ' ')}</div>
        <div className="flex items-center gap-2 text-textSecondary"><Calendar size={15} />{formatDate(listing.createdAt)}</div>
      </div>

      <div>
        <h2 className="font-semibold text-textPrimary mb-2">Description</h2>
        <p className="text-textSecondary leading-relaxed">{listing.description}</p>
      </div>

      {listing.features?.length > 0 && (
        <div>
          <h2 className="font-semibold text-textPrimary mb-2">Features</h2>
          <ul className="grid grid-cols-2 gap-1.5">
            {listing.features.map((f: string) => (
              <li key={f} className="flex items-center gap-2 text-sm text-textSecondary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />{f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {listing.lat && listing.lng && (
        <div>
          <h2 className="font-semibold text-textPrimary mb-2">Location</h2>
          <div className="h-64"><ListingMap listings={[listing]} center={[listing.lat, listing.lng]} zoom={14} /></div>
        </div>
      )}

      <WhatsAppButton listingId={listing.id} listingTitle={listing.title} />
    </div>
  );
}
