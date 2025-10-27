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

// Get all banners (public endpoint)
export const getAllBanners = async (req: Request<{}, ApiResponse<Banner[]>, {}, BannerQueryParams>, res: Response<ApiResponse<Banner[]>>) => {
  try {
    const { active_only = 'true' } = req.query;
    
    const whereClause: any = {};
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

    res.json({
      success: true,
      data: banners,
      count: banners.length
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Get all banners for admin (includes inactive)
export const getAdminBanners = async (_req: Request, res: Response<ApiResponse<Banner[]>>) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: banners,
      count: banners.length
    });
  } catch (error) {
    console.error('Error fetching admin banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Get single banner by ID
export const getBannerById = async (req: Request<{ id: string }>, res: Response<ApiResponse<Banner>>) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banner',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Create new banner
export const createBanner = async (req: Request<{}, ApiResponse<Banner>, CreateBannerRequest>, res: Response<ApiResponse<Banner>>) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
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

    // Validate date range
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        description: description || null,
        text,
        linkText: linkText || null,
        linkUrl: linkUrl || null,
        backgroundColor: backgroundColor || '#ffffff',
        textColor: textColor || '#000000',
        isActive: isActive !== undefined ? isActive : true,
        priority: priority || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create banner',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Update banner
export const updateBanner = async (req: Request<{ id: string }, ApiResponse<Banner>, UpdateBannerRequest>, res: Response<ApiResponse<Banner>>) => {
  try {
    const { id } = req.params;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
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

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    // Validate date range
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (text !== undefined) updateData.text = text;
    if (linkText !== undefined) updateData.linkText = linkText;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor;
    if (textColor !== undefined) updateData.textColor = textColor;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (priority !== undefined) updateData.priority = priority;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Banner updated successfully',
      data: banner
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Delete banner
export const deleteBanner = async (req: Request<{ id: string }>, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    await prisma.banner.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Toggle banner status
export const toggleBannerStatus = async (req: Request<{ id: string }>, res: Response<ApiResponse<Banner>>) => {
  try {
    const { id } = req.params;

    const existingBanner = await prisma.banner.findUnique({
      where: { id }
    });

    if (!existingBanner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        isActive: !existingBanner.isActive
      }
    });

    res.json({
      success: true,
      message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
      data: banner
    });
  } catch (error) {
    console.error('Error toggling banner status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle banner status',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};
