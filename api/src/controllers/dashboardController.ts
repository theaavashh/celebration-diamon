import { Request, Response } from 'express';
import prisma from '../config/database';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get counts for various entities
    const [
      totalProducts,
      totalQuoteRequests,
      totalCollections,
      activeGalleries,
      activeTestimonials,
      totalGalleries,
      recentQuoteRequests,
      categories
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.quoteRequest.count(),
      prisma.collection.count(),
      prisma.gallery.count({ where: { isActive: true } }),
      prisma.testimonial.count({ where: { isActive: true } }),
      prisma.gallery.count(),
      prisma.quoteRequest.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 5,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          isActive: true,
          sortOrder: true
        }
      })
    ]);

    // Get quote requests from last month for growth calculation
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const [lastMonthQuotes, thisMonthQuotes] = await Promise.all([
      prisma.quoteRequest.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lt: thisMonthStart
          }
        }
      }),
      prisma.quoteRequest.count({
        where: {
          createdAt: {
            gte: thisMonthStart
          }
        }
      })
    ]);

    // Calculate growth percentage
    const quoteRequestsGrowth = lastMonthQuotes > 0
      ? ((thisMonthQuotes - lastMonthQuotes) / lastMonthQuotes) * 100
      : (thisMonthQuotes > 0 ? 100 : 0);

    // Get recent quotes
    const recentQuotes = await prisma.quote.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 5,
      select: {
        id: true,
        text: true,
        author: true,
        isActive: true
      }
    });

    // Get recent quote requests
    const recentQuoteRequestsList = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        productId: true,
        status: true,
        createdAt: true,
        product: {
          select: {
            name: true
          }
        }
      }
    });

    const stats = {
      overview: {
        totalProducts,
        totalQuoteRequests,
        totalCollections,
        totalVisitors: 0, // This would come from analytics if implemented
        activeGalleries,
        activeTestimonials,
        recentQuoteRequests,
        totalGalleries
      },
      growth: {
        quoteRequests: {
          percentage: Math.round(quoteRequestsGrowth * 100) / 100,
          current: thisMonthQuotes,
          previous: lastMonthQuotes
        }
      },
      categories,
      recentQuotes,
      recentQuoteRequests: recentQuoteRequestsList
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

