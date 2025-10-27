import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all active top banners
export const getActiveTopBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.topBanner.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });

    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('Error fetching top banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top banners'
    });
  }
};

// Get all top banners (admin)
export const getAllTopBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.topBanner.findMany({
      orderBy: {
        displayOrder: 'asc'
      }
    });

    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('Error fetching all top banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top banners'
    });
  }
};

// Create new top banner
export const createTopBanner = async (req: Request, res: Response) => {
  try {
    const { text, displayOrder, isActive = true } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Banner text is required'
      });
    }

    const banner = await prisma.topBanner.create({
      data: {
        text,
        displayOrder: displayOrder || 0,
        isActive
      }
    });

    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Error creating top banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create top banner'
    });
  }
};

// Update top banner
export const updateTopBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, displayOrder, isActive } = req.body;

    const banner = await prisma.topBanner.update({
      where: { id },
      data: {
        ...(text !== undefined && { text }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Error updating top banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update top banner'
    });
  }
};

// Delete top banner
export const deleteTopBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.topBanner.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Top banner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting top banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete top banner'
    });
  }
};

// Toggle top banner status
export const toggleTopBannerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const banner = await prisma.topBanner.findUnique({
      where: { id }
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Top banner not found'
      });
    }

    const updatedBanner = await prisma.topBanner.update({
      where: { id },
      data: {
        isActive: !banner.isActive
      }
    });

    res.json({
      success: true,
      data: updatedBanner
    });
  } catch (error) {
    console.error('Error toggling top banner status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle top banner status'
    });
  }
};
