'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MessageSquare, Eye, TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { DashboardStats } from '@/lib/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiClient.getDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Listings',
      value: stats?.totalListings || 0,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Available',
      value: stats?.listingsByStatus.available || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Sold',
      value: stats?.listingsByStatus.sold || 0,
      icon: Building2,
      color: 'bg-gray-500',
    },
    {
      title: 'Total Inquiries',
      value: stats?.totalInquiries || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg ${stat.color} p-2`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Inquiries</CardTitle>
            <Link
              href="/dashboard/inquiries"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {stats.recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="text-sm text-gray-600">{inquiry.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(inquiry.createdAt)}
                      </span>
                    </div>
                    {inquiry.listing && (
                      <p className="mt-2 text-sm text-gray-600">
                        Re: <span className="font-medium">{inquiry.listing.title}</span>
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No recent inquiries</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <Link href="/dashboard/listings/create">
            <CardHeader>
              <CardTitle className="text-lg">Create New Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add a new property to your listings
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <Link href="/dashboard/listings">
            <CardHeader>
              <CardTitle className="text-lg">Manage Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Edit or remove existing listings
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-lg">
          <Link href="/dashboard/analytics">
            <CardHeader>
              <CardTitle className="text-lg">View Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Check performance and insights
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}