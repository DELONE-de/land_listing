const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Analytics Module for Prisma
 * Handles all analytics and statistics calculations
 */

class AnalyticsModule {
  
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      // Get total listings count
      const totalListings = await prisma.listing.count();
      
      // Get listings by status
      const [available, sold, underOffer] = await Promise.all([
        prisma.listing.count({ where: { status: 'AVAILABLE' } }),
        prisma.listing.count({ where: { status: 'SOLD' } }),
        prisma.listing.count({ where: { status: 'UNDER_OFFER' } })
      ]);
      
      const statusCounts = {
        available,
        sold,
        under_offer: underOffer
      };
      
      // Get total inquiries
      const totalInquiries = await prisma.inquiry.count();
      
      // Get recent inquiries (last 10)
      const recentInquiries = await prisma.inquiry.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              price: true,
              state: true,
              city: true
            }
          }
        }
      });
      
      // Format recent inquiries
      const formattedInquiries = recentInquiries.map(inquiry => ({
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
        listing: inquiry.listing ? {
          id: inquiry.listing.id,
          title: inquiry.listing.title,
          price: inquiry.listing.price,
          location: inquiry.listing ? `${inquiry.listing.city}, ${inquiry.listing.state}` : null
        } : null,
        createdAt: inquiry.createdAt
      }));
      
      return {
        success: true,
        data: {
          totalListings,
          listingsByStatus: statusCounts,
          totalInquiries,
          recentInquiries: formattedInquiries
        }
      };
      
    } catch (error) {
      console.error('Dashboard Stats Error:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }
  
  /**
   * Get popular listings analytics
   */
  async getPopularListings() {
    try {
      // Most viewed listings
      const mostViewed = await prisma.listing.findMany({
        take: 10,
        orderBy: {
          views: 'desc'
        },
        select: {
          id: true,
          title: true,
          price: true,
          state: true,
          city: true,
          photos: true,
          views: true,
          whatsappClicks: true,
          createdAt: true
        }
      });
      
      // Most clicked listings (WhatsApp clicks)
      const mostClicked = await prisma.listing.findMany({
        take: 10,
        orderBy: {
          whatsappClicks: 'desc'
        },
        select: {
          id: true,
          title: true,
          price: true,
          state: true,
          city: true,
          photos: true,
          views: true,
          whatsappClicks: true,
          createdAt: true
        }
      });
      
      // Format listings
      const formatListing = (listing) => ({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        location: `${listing.city}, ${listing.state}`,
        image: listing.photos?.[0] || null,
        views: listing.views || 0,
        whatsappClicks: listing.whatsappClicks || 0,
        clickRate: listing.views > 0 
          ? ((listing.whatsappClicks / listing.views) * 100).toFixed(2) 
          : 0,
        createdAt: listing.createdAt
      });
      
      return {
        success: true,
        data: {
          mostViewed: mostViewed.map(formatListing),
          mostClicked: mostClicked.map(formatListing)
        }
      };
      
    } catch (error) {
      console.error('Popular Listings Error:', error);
      throw new Error('Failed to fetch popular listings');
    }
  }
  
  /**
   * Get conversion analytics (views vs clicks)
   */
  async getConversionAnalytics() {
    try {
      // Get aggregate stats using Prisma aggregation
      const aggregateStats = await prisma.listing.aggregate({
        _sum: {
          views: true,
          whatsappClicks: true
        },
        _count: {
          id: true
        }
      });
      
      // Count listings with views and clicks
      const [listingsWithViews, listingsWithClicks] = await Promise.all([
        prisma.listing.count({
          where: {
            views: {
              gt: 0
            }
          }
        }),
        prisma.listing.count({
          where: {
            whatsappClicks: {
              gt: 0
            }
          }
        })
      ]);
      
      const totalViews = aggregateStats._sum.views || 0;
      const totalClicks = aggregateStats._sum.whatsappClicks || 0;
      
      // Calculate overall conversion rate
      const overallConversionRate = totalViews > 0
        ? ((totalClicks / totalViews) * 100).toFixed(2)
        : 0;
      
      // Get top converting listings
      const listingsWithConversion = await prisma.listing.findMany({
        where: {
          views: {
            gt: 0
          }
        },
        select: {
          id: true,
          title: true,
          views: true,
          whatsappClicks: true
        },
        orderBy: {
          whatsappClicks: 'desc'
        },
        take: 10
      });
      
      // Calculate conversion rate for each listing
      const topConverting = listingsWithConversion
        .map(listing => ({
          id: listing.id,
          title: listing.title,
          views: listing.views || 0,
          clicks: listing.whatsappClicks || 0,
          conversionRate: listing.views > 0
            ? parseFloat(((listing.whatsappClicks / listing.views) * 100).toFixed(2))
            : 0
        }))
        .sort((a, b) => b.conversionRate - a.conversionRate)
        .slice(0, 10);
      
      // Get conversion trends (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentListings = await prisma.listing.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        select: {
          title: true,
          views: true,
          whatsappClicks: true,
          createdAt: true
        }
      });
      
      // Group by week
      const weeklyData = {};
      recentListings.forEach(listing => {
        const weekStart = new Date(listing.createdAt);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { views: 0, clicks: 0 };
        }
        
        weeklyData[weekKey].views += listing.views || 0;
        weeklyData[weekKey].clicks += listing.whatsappClicks || 0;
      });
      
      const trends = Object.keys(weeklyData)
        .sort()
        .map(week => ({
          week,
          views: weeklyData[week].views,
          clicks: weeklyData[week].clicks,
          conversionRate: weeklyData[week].views > 0
            ? ((weeklyData[week].clicks / weeklyData[week].views) * 100).toFixed(2)
            : 0
        }));
      
      return {
        success: true,
        data: {
          overview: {
            totalViews,
            totalClicks,
            overallConversionRate: parseFloat(overallConversionRate),
            listingsWithViews,
            listingsWithClicks
          },
          topConverting,
          trends
        }
      };
      
    } catch (error) {
      console.error('Conversion Analytics Error:', error);
      throw new Error('Failed to fetch conversion analytics');
    }
  }
  
  /**
   * Get analytics summary (all stats combined)
   */
  async getAnalyticsSummary() {
    try {
      const [dashboard, popular, conversion] = await Promise.all([
        this.getDashboardStats(),
        this.getPopularListings(),
        this.getConversionAnalytics()
      ]);
      
      return {
        success: true,
        data: {
          dashboard: dashboard.data,
          popular: popular.data,
          conversion: conversion.data
        }
      };
      
    } catch (error) {
      console.error('Analytics Summary Error:', error);
      throw new Error('Failed to fetch analytics summary');
    }
  }
  
  /**
   * Cleanup - disconnect Prisma client
   */
  async disconnect() {
    await prisma.$disconnect();
  }
}

module.exports = new AnalyticsModule();