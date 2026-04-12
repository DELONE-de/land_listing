import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/ImageGallery';
import { ListingMap } from '@/components/ListingMap';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { InquiryForm } from '@/components/InquiryForm';
import { StatusBadge } from '@/components/StatusBadge';
import { ListingGrid } from '@/components/ListingGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, MapPin, Maximize, Calendar, Eye, Heart } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { TrackView } from '@/components/TrackView';
import { ShareButton } from '@/components/ShareButton';
import { FavoriteButton } from '@/components/FavoriteButton';

interface ListingDetailPageProps {
  params: {
    slug: string;
  };
}

async function getListingBySlug(slug: string) {
  try {
    const response = await apiClient.getListingBySlug(slug);
    if (!response.success) {
      return null;
    }
    return response.data;
  } catch (error) {
    return null;
  }
}

async function getRelatedListings(id: string) {
  try {
    const response = await apiClient.getRelatedListings(id);
    return response.data || [];
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug);
  
  if (!listing) {
    return {
      title: 'Listing Not Found',
    };
  }

  return {
    title: `${listing.title} - LandApp`,
    description: listing.description?.substring(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description?.substring(0, 160),
      images: listing.images?.[0] ? [listing.images[0]] : [],
    },
  };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const listing = await getListingBySlug(params.slug);
  
  if (!listing) {
    notFound();
  }

  const relatedListings = await getRelatedListings(listing.id);

  return (
    <>
      <TrackView listingId={listing.id} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={listing.images} title={listing.title} />

            {/* Title and Price */}
            <div>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location}, {listing.state}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <FavoriteButton listingId={listing.id} />
                  <ShareButton listing={listing} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(listing.price)}
                </p>
                <StatusBadge status={listing.status} />
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border p-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Size</p>
                <p className="font-semibold">
                  {listing.size} {listing.sizeUnit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <p className="font-semibold">{listing.landType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Views</p>
                <p className="font-semibold flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {listing.views}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Listed</p>
                <p className="font-semibold flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(listing.createdAt)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((amenity: string) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map */}
            {listing.coordinates && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Location</h2>
                <ListingMap coordinates={listing.coordinates} title={listing.title} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Inquiry Form */}
            <InquiryForm listingId={listing.id} listingTitle={listing.title} />

            {/* Contact Info */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">+234 800 123 4567</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">contact@landapp.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Office Hours</p>
                  <p className="font-semibold">Mon - Fri: 9AM - 6PM</p>
                </div>
              </div>
            </div>

            {/* Share Stats */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Views</span>
                  <span className="font-semibold">{listing.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">WhatsApp Clicks</span>
                  <span className="font-semibold">{listing.whatsappClicks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shares</span>
                  <span className="font-semibold">{listing.shareClicks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Listings</h2>
            <ListingGrid listings={relatedListings} />
          </div>
        )}
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton 
        listingId={listing.id}
        phoneNumber="2348001234567"
        message={`Hi, I'm interested in: ${listing.title}`}
      />
    </>
  );
}
