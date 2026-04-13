"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight, MapPin, Shield, TrendingUp,
  Home, Building2, Tractor, Factory, LayoutGrid
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Listing } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { SearchBar } from "@/components/SearchBar";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const TYPES = [
  { icon: Home,       label: "Residential",  value: "residential",  color: "bg-green-50 text-green-700"   },
  { icon: Building2,  label: "Commercial",   value: "commercial",   color: "bg-blue-50 text-blue-700"     },
  { icon: Tractor,    label: "Agricultural", value: "agricultural", color: "bg-amber-50 text-amber-700"   },
  { icon: Factory,    label: "Industrial",   value: "industrial",   color: "bg-slate-50 text-slate-700"   },
  { icon: LayoutGrid, label: "Mixed Use",    value: "mixed-use",    color: "bg-purple-50 text-purple-700" },
];

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="aspect-[4/3] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: listings, isLoading } = useQuery({
    queryKey: ["featured-listings"],
    queryFn: async () => {
      const res = await apiClient.getListings({ status: "available", limit: 6 });
      return res.data.listings as Listing[];
    },
    retry: 1,
  });

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-secondary-700 pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-green-400" /> Verified Listings
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full">
              No Sign-up Needed
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Find Your Perfect<br />
            <span className="text-yellow-400">Land in Nigeria</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10">
            Browse verified plots across every state. Contact sellers directly via WhatsApp.
          </p>

          <div className="max-w-3xl mx-auto mb-8">
            <SearchBar />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-white/50">Popular:</span>
            {["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Ogun"].map((loc) => (
              <Link key={loc} href={`/listings?state=${loc}`}
                className="text-white/80 hover:text-white hover:underline underline-offset-2 transition-colors">
                {loc}
              </Link>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 25C672 30 768 30 864 25C960 20 1056 10 1152 10C1248 10 1344 20 1392 25L1440 30V60H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: MapPin,     label: "Active Listings", value: "500+",   color: "text-green-700"  },
              { icon: TrendingUp, label: "States Covered",  value: "36",     color: "text-blue-700"   },
              { icon: Shield,     label: "Verified Plots",  value: "98%",    color: "text-green-700"  },
              { icon: Home,       label: "Happy Buyers",    value: "2,400+", color: "text-yellow-600" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 mb-3 group-hover:scale-110 transition-transform duration-200">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Land Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Browse by Land Type</h2>
            <p className="text-gray-500">Find exactly what you are looking for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TYPES.map(({ icon: Icon, label, value, color }) => (
              <Link key={value} href={`/listings?landType=${value}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Listings</h2>
              <p className="text-gray-500">Top verified land listings across Nigeria</p>
            </div>
            <Link href="/listings"
              className="hidden sm:inline-flex items-center gap-2 text-green-700 font-semibold text-sm hover:gap-3 transition-all duration-200">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : !listings || listings.length === 0
              ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-4xl mb-3">🌿</p>
                  <p className="font-semibold text-gray-900 mb-1">No listings yet</p>
                  <p className="text-gray-500 text-sm">Start the backend and run npm run seed to add sample data.</p>
                </div>
              )
              : listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))
            }
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link href="/listings"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition-all">
              View All Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Land?</h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Browse verified listings and contact sellers directly. No account needed.
          </p>
          <Link href="/listings"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl transition-all active:scale-95 shadow-lg">
            Browse All Listings <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <WhatsAppButton variant="sticky" label="Enquire on WhatsApp" />
    </div>
  );
}
