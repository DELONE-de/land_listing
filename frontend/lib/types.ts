export interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  state: string;
  lga?: string;
  landType: string;
  size: number;
  sizeUnit: string;
  status: 'available' | 'sold' | 'under_offer';
  images: string[];
  amenities: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  views: number;
  whatsappClicks: number;
  shareClicks: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  listingId: string;
  listing?: Listing;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalListings: number;
  listingsByStatus: {
    available: number;
    sold: number;
    under_offer: number;
  };
  totalInquiries: number;
  recentInquiries: Inquiry[];
}

export interface PopularAnalytics {
  mostViewed: Array<Listing & { clickRate: string }>;
  mostClicked: Array<Listing & { clickRate: string }>;
}

export interface ConversionAnalytics {
  overview: {
    totalViews: number;
    totalClicks: number;
    overallConversionRate: number;
    listingsWithViews: number;
    listingsWithClicks: number;
  };
  topConverting: Array<{
    id: string;
    title: string;
    views: number;
    clicks: number;
    conversionRate: number;
  }>;
  trends: Array<{
    week: string;
    views: number;
    clicks: number;
    conversionRate: string;
  }>;
}

export interface FilterParams {
  search?: string;
  location?: string;
  landType?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  amenities?: string[];
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}