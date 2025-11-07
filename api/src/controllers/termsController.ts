import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../types';

export interface Terms {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Get active terms (public)
export const getActiveTerms = async (req: Request, res: Response<ApiResponse<Terms>>) => {
  try {
    const terms = await prisma.termsAndConditions.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: 'No active terms found'
      });
    }

    res.json({
      success: true,
      data: terms
    });
  } catch (error) {
    console.error('Error fetching active terms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch terms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all terms (admin)
export const getAllTerms = async (req: Request, res: Response<ApiResponse<Terms[]>>) => {
  try {
    const terms = await prisma.termsAndConditions.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      data: terms,
      count: terms.length
    });
  } catch (error) {
    console.error('Error fetching all terms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch terms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get terms by ID
export const getTermsById = async (req: Request, res: Response<ApiResponse<Terms>>) => {
  try {
    const { id } = req.params;
    const terms = await prisma.termsAndConditions.findUnique({
      where: { id }
    });

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: 'Terms not found'
      });
    }

    res.json({
      success: true,
      data: terms
    });
  } catch (error) {
    console.error('Error fetching terms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch terms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create terms
export const createTerms = async (req: Request, res: Response<ApiResponse<Terms>>) => {
  try {
    const {
      title = 'Terms & Conditions',
      content,
      isActive = true
    } = req.body;

    const terms = await prisma.termsAndConditions.create({
      data: {
        title,
        content,
        isActive: isActive === 'true' || isActive === true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Terms created successfully',
      data: terms
    });
  } catch (error) {
    console.error('Error creating terms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create terms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update terms
export const updateTerms = async (req: Request, res: Response<ApiResponse<Terms>>) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      isActive
    } = req.body;

    const existingTerms = await prisma.termsAndConditions.findUnique({
      where: { id }
    });

    if (!existingTerms) {
      return res.status(404).json({
        success: false,
        message: 'Terms not found'
      });
    }

    const updateData: any = {
      title: title !== undefined ? title : existingTerms.title,
      content: content !== undefined ? content : existingTerms.content,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingTerms.isActive
    };

    const terms = await prisma.termsAndConditions.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Terms updated successfully',
      data: terms
    });
  } catch (error) {
    console.error('Error updating terms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update terms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete terms
export const deleteTerms = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const existingTerms = await prisma.termsAndConditions.findUnique({
      where: { id }
    });

    if (!existingTerms) {
      return res.status(404).json({
        success: false,
        message: 'Terms not found'
      });
    }

    await prisma.termsAndConditions.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Terms deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting terms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete terms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
