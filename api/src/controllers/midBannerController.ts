import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { 
  ApiResponse, 
  Banner, 
  BannerQueryParams, 
  CreateBannerRequest, 
  UpdateBannerRequest 
} from '../types';

// Helper function to create/update mid-banner data
const createMidBannerData = (body: any) => {
  const {
    title,
    description,
    text,
    linkText,
    linkUrl,
    backgroundColor,
    textColor,
    isActive,
    priority,
    startDate,
    endDate,
    leftImage,
    rightImage,
    leftImageHeight,
    rightImageHeight
  } = body;

  // Create a data object for mid-banner specific fields
  const midBannerData = {
    leftImage: leftImage || null,
    rightImage: rightImage || null,
    leftImageHeight: leftImageHeight || 200,
    rightImageHeight: rightImageHeight || 300
  };

  // Store mid-banner specific data in description as JSON
  const bannerDescription = description 
    ? `${description}||${JSON.stringify(midBannerData)}`
    : JSON.stringify(midBannerData);

  // Ensure the title indicates this is a mid banner
  const midBannerTitle = title.includes('Mid Banner') ? title : `Mid Banner: ${title}`;

  return {
    title: midBannerTitle,
    description: bannerDescription,
    text,
    linkText: linkText || null,
    linkUrl: linkUrl || null,
    backgroundColor: backgroundColor || '#f4f4f9',
    textColor: textColor || '#000000',
    isActive: isActive !== undefined ? isActive : true,
    priority: priority || 0,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null
  };
};

// Helper function to extract mid-banner data from banner
const extractMidBannerData = (banner: Banner) => {
  // Extract mid-banner specific data from description
  let midBannerData = {
    leftImage: null,
    rightImage: null,
    leftImageHeight: 200,
    rightImageHeight: 300
  };

  if (banner.description) {
    try {
      // Check if description contains mid-banner data (separated by ||)
      const parts = banner.description.split('||');
      const jsonData = parts.length > 1 ? parts[1] : parts[0];
      midBannerData = JSON.parse(jsonData);
    } catch (e) {
      console.warn("Failed to parse mid-banner data", e);
    }
  }

  return {
    ...banner,
    leftImage: midBannerData.leftImage,
    rightImage: midBannerData.rightImage,
    leftImageHeight: midBannerData.leftImageHeight,
    rightImageHeight: midBannerData.rightImageHeight
  };
};

// Get all mid banners (public endpoint)
export const getAllMidBanners = async (req: Request<{}, ApiResponse<Banner[]>, {}, BannerQueryParams>, res: Response<ApiResponse<Banner[]>>) => {
  try {
    const queryParams = req.query as BannerQueryParams;
    const active_only = queryParams.active_only ?? 'true';
    
    const whereClause: any = {
      // Filter for mid banners - we'll use a naming convention or tag
      title: {
        contains: 'Mid Banner',
        mode: 'insensitive'
      }
    };
    
    if (active_only === 'true') {
      whereClause.isActive = true;
      whereClause.OR = [
        { startDate: null },
        { startDate: { lte: new Date() } }
      ];
      whereClause.AND = [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } }
          ]
        }
      ];
    }

    const banners = await prisma.banner.findMany({
      where: whereClause,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Extract mid-banner specific data
    const formattedBanners = banners.map(banner => extractMidBannerData(banner));

    res.json({
      success: true,
      data: formattedBanners as unknown as Banner[],
      count: formattedBanners.length
    });
  } catch (error) {
    console.error('Error fetching mid banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mid banners',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : ''
    });
  }
};

// Get all mid banners for admin (includes inactive)
export const getAdminMidBanners = async (_req: Request, res: Response<ApiResponse<Banner[]>>) => {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        // Filter for mid banners - we'll use a naming convention or tag
        title: {
          contains: 'Mid Banner',
          mode: 'insensitive'
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Extract mid-banner specific data
    const formattedBanners = banners.map(banner => extractMidBannerData(banner));

    res.json({
      success: true,
      data: formattedBanners as unknown as Banner[],
      count: formattedBanners.length
    });
  } catch (error) {
    console.error('Error fetching admin mid banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mid banners',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : ''
    });
  }
};

// Get single mid banner by ID
export const getMidBannerById = async (req: Request<{ id: string }>, res: Response<ApiResponse<Banner>>) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({
      where: { 
        id,
        title: {
          contains: 'Mid Banner',
          mode: 'insensitive'
        }
      }
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Mid banner not found'
      });
    }

    // Extract mid-banner specific data
    const formattedBanner = extractMidBannerData(banner);

    res.json({
      success: true,
      data: formattedBanner as unknown as Banner
    });
  } catch (error) {
    console.error('Error fetching mid banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mid banner',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : ''
    });
  }
};

// Create new mid banner
export const createMidBanner = async (req: Request<{}, ApiResponse<Banner>, CreateBannerRequest>, res: Response<ApiResponse<Banner>>) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: JSON.stringify(errors.array())
      });
    }

    const bannerData = createMidBannerData(req.body);

    const banner = await prisma.banner.create({
      data: bannerData
    });

    // Extract mid-banner specific data for response
    const formattedBanner = extractMidBannerData(banner);

    res.status(201).json({
      success: true,
      message: 'Mid banner created successfully',
      data: formattedBanner as unknown as Banner
    });
  } catch (error) {
    console.error('Error creating mid banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mid banner',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : ''
    });
  }
};

// Update mid banner
export const updateMidBanner = async (req: Request<{ id: string }, ApiResponse<Banner>, UpdateBannerRequest>, res: Response<ApiResponse<Banner>>) => {
  try {
    const { id } = req.params;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: JSON.stringify(errors.array())
      });
    }

    const {
      title,
      description,
      text,
      linkText,
      linkUrl,
      backgroundColor,
      textColor,
      isActive,
      priority,
      startDate,
      endDate
    } = req.body;

    // Check if banner exists and is a mid banner
    const existingBanner = await prisma.banner.findUnique({
      where: { 
        id,
        title: {
          contains: 'Mid Banner',
          mode: 'insensitive'
        }
      }
    });

    if (!existingBanner) {
      return res.status(404).json({
        success: false,
        message: 'Mid banner not found'
      });
    }

    // Validate date range
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const updateData = createMidBannerData(req.body);

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData
    });

    // Extract mid-banner specific data for response
    const formattedBanner = extractMidBannerData(banner);

    res.json({
      success: true,
      message: 'Mid banner updated successfully',
      data: formattedBanner as unknown as Banner
    });
  } catch (error) {
    console.error('Error updating mid banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mid banner',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : ''
    });
  }
};

// Delete mid banner
export const deleteMidBanner = async (req: Request<{ id: string }>, res: Response<ApiResponse<null>>) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Banner ID is required'
      });
    }

    console.log('Attempting to delete mid banner with ID:', id);

    // Check if banner exists and is a mid banner
    const existingBanner = await prisma.banner.findUnique({
      where: { 
        id,
        title: {
          contains: 'Mid Banner',
          mode: 'insensitive'
        }
      }
    });

    if (!existingBanner) {
      console.log('Mid banner not found with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Mid banner not found'
      });
    }

    console.log('Mid banner found, deleting:', existingBanner.title);

    await prisma.banner.delete({
      where: { id }
    });

    console.log('Mid banner deleted successfully:', id);

    res.json({
      success: true,
      message: 'Mid banner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mid banner:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Check for Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      console.error('Prisma error code:', prismaError.code);
      
      if (prismaError.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Mid banner not found',
          error: isDevelopment ? errorMessage : ''
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete mid banner',
      error: isDevelopment ? errorMessage : ''
    });
  }
};

// Toggle mid banner status
export const toggleMidBannerStatus = async (req: Request<{ id: string }>, res: Response<ApiResponse<Banner>>) => {
  try {
    const { id } = req.params;

    const existingBanner = await prisma.banner.findUnique({
      where: { 
        id,
        title: {
          contains: 'Mid Banner',
          mode: 'insensitive'
        }
      }
    });

    if (!existingBanner) {
      return res.status(404).json({
        success: false,
        message: 'Mid banner not found'
      });
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        isActive: !existingBanner.isActive
      }
    });

    // Extract mid-banner specific data for response
    const formattedBanner = extractMidBannerData(banner);

    res.json({
      success: true,
      message: `Mid banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
      data: formattedBanner as unknown as Banner
    });
  } catch (error) {
    console.error('Error toggling mid banner status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle mid banner status',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : ''
    });
  }
};