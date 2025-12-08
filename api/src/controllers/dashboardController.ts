import { Request, Response } from 'express';
import prisma from '../config/database';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const safeCount = async (model: any): Promise<number> => {
      try {
        if (model && typeof model.count === 'function') {
          return await model.count();
        }
      } catch {}
      return 0;
    };

    const safeCountWhere = async (model: any, where: any): Promise<number> => {
      try {
        if (model && typeof model.count === 'function') {
          return await model.count({ where });
        }
      } catch {}
      return 0;
    };

    const safeFindMany = async (model: any, args: any): Promise<any[]> => {
      try {
        if (model && typeof model.findMany === 'function') {
          return await model.findMany(args);
        }
      } catch {}
      return [];
    };
    // Get counts for various entities
    const [
      totalProducts,
      totalQuoteRequests,
      activeGalleries,
      activeTestimonials,
      totalGalleries,
      recentQuoteRequests,
      categories
    ] = await Promise.all([
      safeCountWhere((prisma as any).product, { isActive: true }),
      safeCount((prisma as any).quoteRequest),
      safeCountWhere((prisma as any).gallery, { isActive: true }),
      safeCountWhere((prisma as any).testimonial, { isActive: true }),
      safeCount((prisma as any).gallery),
      safeCountWhere((prisma as any).quoteRequest, {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      }),
      safeFindMany((prisma as any).category, {
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

    let totalCollections = 0;
    try {
      // Some deployments may not include the Collection model
      // Fallback to 0 if unavailable
      totalCollections = await (prisma as any).collection.count();
    } catch {
      totalCollections = 0;
    }

    // Get quote requests from last month for growth calculation
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const [lastMonthQuotes, thisMonthQuotes] = await Promise.all([
      safeCountWhere((prisma as any).quoteRequest, {
        createdAt: {
          gte: lastMonthStart,
          lt: thisMonthStart
        }
      }),
      safeCountWhere((prisma as any).quoteRequest, {
        createdAt: {
          gte: thisMonthStart
        }
      })
    ]);

    // Calculate growth percentage
    const quoteRequestsGrowth = lastMonthQuotes > 0
      ? ((thisMonthQuotes - lastMonthQuotes) / lastMonthQuotes) * 100
      : (thisMonthQuotes > 0 ? 100 : 0);

    // Get recent quotes
    const recentQuotes = await safeFindMany((prisma as any).quote, {
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
    const recentQuoteRequestsList = await safeFindMany((prisma as any).quoteRequest, {
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

