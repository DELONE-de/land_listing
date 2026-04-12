'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, MousePointerClick, TrendingUp, Award } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { PopularAnalytics, ConversionAnalytics } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function AnalyticsPage() {
  const [popularData, setPopularData] = useState<PopularAnalytics | null>(null);
  const [conversionData, setConversionData] = useState<ConversionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [popular, conversion] = await Promise.all([
        apiClient.getPopularAnalytics(),
        apiClient.getConversionAnalytics(),
      ]);

      if (popular.success) setPopularData(popular.data);
      if (conversion.success) setConversionData(conversion.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track performance and user engagement
        </p>
      </div>

      {/* Overview Stats */}
      {conversionData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversionData.overview.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">WhatsApp Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversionData.overview.totalClicks.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total interactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversionData.overview.overallConversionRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Views to clicks ratio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversionData.overview.listingsWithViews}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                With at least 1 view
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="popular" className="space-y-6">
        <TabsList>
          <TabsTrigger value="popular">Popular Listings</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Popular Listings Tab */}
        <TabsContent value="popular" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Most Viewed */}
            <Card>
              <CardHeader>
                <CardTitle>Most Viewed Listings</CardTitle>
                <CardDescription>Top 10 listings by views</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularData?.mostViewed.slice(0, 10).map((listing, index) => (
                    <div key={listing.id} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div className="relative h-12 w-12 overflow-hidden rounded">
                        {listing.image ? (
                          <Image
                            src={listing.image}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {listing.views} views • {listing.whatsappClicks} clicks
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{listing.clickRate}%</p>
                        <p className="text-xs text-muted-foreground">rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Clicked */}
            <Card>
              <CardHeader>
                <CardTitle>Most Clicked Listings</CardTitle>
                <CardDescription>Top 10 by WhatsApp clicks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularData?.mostClicked.slice(0, 10).map((listing, index) => (
                    <div key={listing.id} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                        {index + 1}
                      </div>
                      <div className="relative h-12 w-12 overflow-hidden rounded">
                        {listing.image ? (
                          <Image
                            src={listing.image}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {listing.whatsappClicks} clicks • {listing.views} views
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{listing.clickRate}%</p>
                        <p className="text-xs text-muted-foreground">rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Converting Listings</CardTitle>
              <CardDescription>
                Listings with the highest view-to-click conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionData?.topConverting.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{listing.title}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>{listing.views} views</span>
                          <span>{listing.clicks} clicks</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent">
                        {listing.conversionRate}%
                      </p>
                      <p className="text-xs text-muted-foreground">conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Breakdown */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Listings with Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {conversionData?.overview.listingsWithViews}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Out of total listings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Listings with Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {conversionData?.overview.listingsWithClicks}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Generated interactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {conversionData?.overview.overallConversionRate}%
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Across all listings
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trends</CardTitle>
              <CardDescription>
                Performance over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversionData?.trends && conversionData.trends.length > 0 ? (
                <div className="space-y-4">
                  {conversionData.trends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          Week of {new Date(trend.week).toLocaleDateString()}
                        </p>
                        <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                          <span>{trend.views} views</span>
                          <span>{trend.clicks} clicks</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{trend.conversionRate}%</p>
                        <p className="text-xs text-muted-foreground">conversion</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No trend data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Week</CardTitle>
              </CardHeader>
              <CardContent>
                {conversionData?.trends && conversionData.trends.length > 0 ? (
                  (() => {
                    const best = conversionData.trends.reduce((prev, current) =>
                      parseFloat(current.conversionRate) > parseFloat(prev.conversionRate)
                        ? current
                        : prev
                    );
                    return (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Week of {new Date(best.week).toLocaleDateString()}
                        </p>
                        <p className="text-3xl font-bold mt-2">{best.conversionRate}%</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {best.views} views • {best.clicks} clicks
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-muted-foreground">No data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                {conversionData?.trends && conversionData.trends.length > 0 ? (
                  (() => {
                    const totalViews = conversionData.trends.reduce(
                      (sum, trend) => sum + trend.views,
                      0
                    );
                    const totalClicks = conversionData.trends.reduce(
                      (sum, trend) => sum + trend.clicks,
                      0
                    );
                    return (
                      <div>
                        <p className="text-sm text-muted-foreground">Last 30 days</p>
                        <p className="text-3xl font-bold mt-2">
                          {(totalViews + totalClicks).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {totalViews.toLocaleString()} views •{' '}
                          {totalClicks.toLocaleString()} clicks
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-muted-foreground">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}