import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../types';

export interface ReturnPolicy {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Get active return policy (public)
export const getActiveReturnPolicy = async (req: Request, res: Response<ApiResponse<ReturnPolicy>>) => {
  try {
    const returnPolicy = await prisma.returnPolicy.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (!returnPolicy) {
      return res.status(404).json({
        success: false,
        message: 'No active return policy found'
      });
    }

    res.json({
      success: true,
      data: returnPolicy
    });
  } catch (error) {
    console.error('Error fetching active return policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch return policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all return policies (admin)
export const getAllReturnPolicies = async (req: Request, res: Response<ApiResponse<ReturnPolicy[]>>) => {
  try {
    const returnPolicies = await prisma.returnPolicy.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      data: returnPolicies,
      count: returnPolicies.length
    });
  } catch (error) {
    console.error('Error fetching all return policies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch return policies',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get return policy by ID
export const getReturnPolicyById = async (req: Request, res: Response<ApiResponse<ReturnPolicy>>) => {
  try {
    const { id } = req.params;
    const returnPolicy = await prisma.returnPolicy.findUnique({
      where: { id }
    });

    if (!returnPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Return policy not found'
      });
    }

    res.json({
      success: true,
      data: returnPolicy
    });
  } catch (error) {
    console.error('Error fetching return policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch return policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create return policy
export const createReturnPolicy = async (req: Request, res: Response<ApiResponse<ReturnPolicy>>) => {
  try {
    const {
      title = 'Return Policy',
      content,
      isActive = true
    } = req.body;

    const returnPolicy = await prisma.returnPolicy.create({
      data: {
        title,
        content,
        isActive: isActive === 'true' || isActive === true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Return policy created successfully',
      data: returnPolicy
    });
  } catch (error) {
    console.error('Error creating return policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create return policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update return policy
export const updateReturnPolicy = async (req: Request, res: Response<ApiResponse<ReturnPolicy>>) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      isActive
    } = req.body;

    const existingReturnPolicy = await prisma.returnPolicy.findUnique({
      where: { id }
    });

    if (!existingReturnPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Return policy not found'
      });
    }

    const updateData: any = {
      title: title !== undefined ? title : existingReturnPolicy.title,
      content: content !== undefined ? content : existingReturnPolicy.content,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingReturnPolicy.isActive
    };

    const returnPolicy = await prisma.returnPolicy.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Return policy updated successfully',
      data: returnPolicy
    });
  } catch (error) {
    console.error('Error updating return policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update return policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete return policy
export const deleteReturnPolicy = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const existingReturnPolicy = await prisma.returnPolicy.findUnique({
      where: { id }
    });

    if (!existingReturnPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Return policy not found'
      });
    }

    await prisma.returnPolicy.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Return policy deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting return policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete return policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
