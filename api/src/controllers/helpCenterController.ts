import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../types';

export interface HelpCenter {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Get active help center (public)
export const getActiveHelpCenter = async (req: Request, res: Response<ApiResponse<HelpCenter>>) => {
  try {
    const helpCenter = await prisma.helpCenter.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (!helpCenter) {
      return res.status(404).json({
        success: false,
        message: 'No active help center found'
      });
    }

    res.json({
      success: true,
      data: helpCenter
    });
  } catch (error) {
    console.error('Error fetching active help center:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch help center',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all help centers (admin)
export const getAllHelpCenters = async (req: Request, res: Response<ApiResponse<HelpCenter[]>>) => {
  try {
    const helpCenters = await prisma.helpCenter.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      data: helpCenters,
      count: helpCenters.length
    });
  } catch (error) {
    console.error('Error fetching all help centers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch help centers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get help center by ID
export const getHelpCenterById = async (req: Request, res: Response<ApiResponse<HelpCenter>>) => {
  try {
    const { id } = req.params;
    const helpCenter = await prisma.helpCenter.findUnique({
      where: { id }
    });

    if (!helpCenter) {
      return res.status(404).json({
        success: false,
        message: 'Help center not found'
      });
    }

    res.json({
      success: true,
      data: helpCenter
    });
  } catch (error) {
    console.error('Error fetching help center:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch help center',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create help center
export const createHelpCenter = async (req: Request, res: Response<ApiResponse<HelpCenter>>) => {
  try {
    const {
      title = 'Help Center',
      content,
      isActive = true
    } = req.body;

    const helpCenter = await prisma.helpCenter.create({
      data: {
        title,
        content,
        isActive: isActive === 'true' || isActive === true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Help center created successfully',
      data: helpCenter
    });
  } catch (error) {
    console.error('Error creating help center:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create help center',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update help center
export const updateHelpCenter = async (req: Request, res: Response<ApiResponse<HelpCenter>>) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      isActive
    } = req.body;

    const existingHelpCenter = await prisma.helpCenter.findUnique({
      where: { id }
    });

    if (!existingHelpCenter) {
      return res.status(404).json({
        success: false,
        message: 'Help center not found'
      });
    }

    const updateData: any = {
      title: title !== undefined ? title : existingHelpCenter.title,
      content: content !== undefined ? content : existingHelpCenter.content,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingHelpCenter.isActive
    };

    const helpCenter = await prisma.helpCenter.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Help center updated successfully',
      data: helpCenter
    });
  } catch (error) {
    console.error('Error updating help center:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update help center',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete help center
export const deleteHelpCenter = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const existingHelpCenter = await prisma.helpCenter.findUnique({
      where: { id }
    });

    if (!existingHelpCenter) {
      return res.status(404).json({
        success: false,
        message: 'Help center not found'
      });
    }

    await prisma.helpCenter.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Help center deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting help center:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete help center',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
