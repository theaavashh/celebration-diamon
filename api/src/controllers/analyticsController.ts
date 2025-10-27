import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get analytics overview (admin)
export const getAnalyticsOverview = async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get total visitors
    const totalVisitors = await prisma.analytics.count({
      where: {
        createdAt: { gte: startDate }
      }
    });

    // Get unique visitors
    const uniqueVisitors = await prisma.analytics.count({
      where: {
        createdAt: { gte: startDate },
        isNewVisitor: true
      }
    });

    // Get total page views
    const totalPageViews = await prisma.pageViews.count({
      where: {
        createdAt: { gte: startDate }
      }
    });

    // Get bounce rate
    const bouncedSessions = await prisma.analytics.count({
      where: {
        createdAt: { gte: startDate },
        bounceRate: true
      }
    });
    const bounceRate = totalVisitors > 0 ? (bouncedSessions / totalVisitors) * 100 : 0;

    // Get average session duration
    const avgSessionDuration = await prisma.analytics.aggregate({
      where: {
        createdAt: { gte: startDate },
        timeOnPage: { not: null }
      },
      _avg: {
        timeOnPage: true
      }
    });

    // Get conversions
    const conversions = await prisma.analytics.count({
      where: {
        createdAt: { gte: startDate },
        conversion: true
      }
    });
    const conversionRate = totalVisitors > 0 ? (conversions / totalVisitors) * 100 : 0;

    // Get top countries
    const topCountries = await prisma.analytics.groupBy({
      by: ['country'],
      where: {
        createdAt: { gte: startDate },
        country: { not: null }
      },
      _count: {
        country: true
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      },
      take: 10
    });

    // Get top regions
    const topRegions = await prisma.analytics.groupBy({
      by: ['region'],
      where: {
        createdAt: { gte: startDate },
        region: { not: null }
      },
      _count: {
        region: true
      },
      orderBy: {
        _count: {
          region: 'desc'
        }
      },
      take: 10
    });

    // Get device types
    const deviceTypes = await prisma.analytics.groupBy({
      by: ['deviceType'],
      where: {
        createdAt: { gte: startDate },
        deviceType: { not: null }
      },
      _count: {
        deviceType: true
      }
    });

    // Get browsers
    const browsers = await prisma.analytics.groupBy({
      by: ['browser'],
      where: {
        createdAt: { gte: startDate },
        browser: { not: null }
      },
      _count: {
        browser: true
      },
      orderBy: {
        _count: {
          browser: 'desc'
        }
      },
      take: 10
    });

    // Get top pages
    const topPages = await prisma.pageViews.groupBy({
      by: ['pageUrl'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: {
        pageUrl: true
      },
      orderBy: {
        _count: {
          pageUrl: 'desc'
        }
      },
      take: 10
    });

    // Get referrers
    const topReferrers = await prisma.analytics.groupBy({
      by: ['referrer'],
      where: {
        createdAt: { gte: startDate },
        referrer: { not: null }
      },
      _count: {
        referrer: true
      },
      orderBy: {
        _count: {
          referrer: 'desc'
        }
      },
      take: 10
    });

    // Get daily visitors for chart (simplified for now)
    const dailyVisitors = await prisma.analytics.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        isNewVisitor: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group by date
    const groupedVisitors = dailyVisitors.reduce((acc: any, visitor) => {
      const date = visitor.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { visitors: 0, new_visitors: 0 };
      }
      acc[date].visitors++;
      if (visitor.isNewVisitor) {
        acc[date].new_visitors++;
      }
      return acc;
    }, {});

    const dailyVisitorsArray = Object.entries(groupedVisitors).map(([date, data]: [string, any]) => ({
      date,
      visitors: data.visitors,
      new_visitors: data.new_visitors
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalVisitors,
          uniqueVisitors,
          totalPageViews,
          bounceRate: Math.round(bounceRate * 100) / 100,
          avgSessionDuration: Math.round((avgSessionDuration._avg.timeOnPage || 0) * 100) / 100,
          conversions,
          conversionRate: Math.round(conversionRate * 100) / 100
        },
        geography: {
          topCountries: topCountries.map(item => ({
            country: item.country,
            visitors: item._count.country
          })),
          topRegions: topRegions.map(item => ({
            region: item.region,
            visitors: item._count.region
          }))
        },
        technology: {
          deviceTypes: deviceTypes.map(item => ({
            deviceType: item.deviceType,
            count: item._count.deviceType
          })),
          browsers: browsers.map(item => ({
            browser: item.browser,
            count: item._count.browser
          }))
        },
        content: {
          topPages: topPages.map(item => ({
            pageUrl: item.pageUrl,
            views: item._count.pageUrl
          })),
          topReferrers: topReferrers.map(item => ({
            referrer: item.referrer,
            count: item._count.referrer
          }))
        },
        charts: {
          dailyVisitors: dailyVisitorsArray
        }
      },
      message: 'Analytics overview retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch analytics overview'
    });
  }
};

// Track page view
export const trackPageView = async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      pageUrl,
      pageTitle,
      timeOnPage,
      scrollDepth,
      exitPage = false
    } = req.body;

    if (!sessionId || !pageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and page URL are required'
      });
    }

    const pageView = await prisma.pageViews.create({
      data: {
        sessionId,
        pageUrl,
        pageTitle,
        timeOnPage,
        scrollDepth,
        exitPage
      }
    });

    res.json({
      success: true,
      data: pageView,
      message: 'Page view tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to track page view'
    });
  }
};

// Track event
export const trackEvent = async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      eventName,
      eventData,
      pageUrl
    } = req.body;

    if (!sessionId || !eventName || !pageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Session ID, event name, and page URL are required'
      });
    }

    const event = await prisma.events.create({
      data: {
        sessionId,
        eventName,
        eventData,
        pageUrl
      }
    });

    res.json({
      success: true,
      data: event,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to track event'
    });
  }
};

// Track session (visitor)
export const trackSession = async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      userId,
      ipAddress,
      userAgent,
      country,
      region,
      city,
      referrer,
      pageUrl,
      pageTitle,
      timeOnPage,
      bounceRate = false,
      deviceType,
      browser,
      os,
      screenResolution,
      language,
      isNewVisitor = true,
      conversion = false,
      goalType
    } = req.body;

    if (!sessionId || !ipAddress || !userAgent || !pageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Session ID, IP address, user agent, and page URL are required'
      });
    }

    // Check if session already exists
    const existingSession = await prisma.analytics.findFirst({
      where: { sessionId }
    });

    let session;
    if (existingSession) {
      // Update existing session
      session = await prisma.analytics.update({
        where: { id: existingSession.id },
        data: {
          timeOnPage,
          bounceRate,
          conversion,
          goalType,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new session
      session = await prisma.analytics.create({
        data: {
          sessionId,
          userId,
          ipAddress,
          userAgent,
          country,
          region,
          city,
          referrer,
          pageUrl,
          pageTitle,
          timeOnPage,
          bounceRate,
          deviceType,
          browser,
          os,
          screenResolution,
          language,
          isNewVisitor,
          conversion,
          goalType
        }
      });
    }

    res.json({
      success: true,
      data: session,
      message: 'Session tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking session:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to track session'
    });
  }
};

// Get real-time analytics
export const getRealTimeAnalytics = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Active visitors in last hour
    const activeVisitors = await prisma.analytics.count({
      where: {
        createdAt: { gte: oneHourAgo }
      }
    });

    // Current page views
    const currentPageViews = await prisma.pageViews.count({
      where: {
        createdAt: { gte: oneHourAgo }
      }
    });

    // Top pages right now
    const topPagesNow = await prisma.pageViews.groupBy({
      by: ['pageUrl'],
      where: {
        createdAt: { gte: oneHourAgo }
      },
      _count: {
        pageUrl: true
      },
      orderBy: {
        _count: {
          pageUrl: 'desc'
        }
      },
      take: 5
    });

    // Recent countries
    const recentCountries = await prisma.analytics.groupBy({
      by: ['country'],
      where: {
        createdAt: { gte: oneHourAgo },
        country: { not: null }
      },
      _count: {
        country: true
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      },
      take: 5
    });

    res.json({
      success: true,
      data: {
        activeVisitors,
        currentPageViews,
        topPagesNow: topPagesNow.map(item => ({
          pageUrl: item.pageUrl,
          views: item._count.pageUrl
        })),
        recentCountries: recentCountries.map(item => ({
          country: item.country,
          visitors: item._count.country
        }))
      },
      message: 'Real-time analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch real-time analytics'
    });
  }
};