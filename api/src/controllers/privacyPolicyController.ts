import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../types';

export interface PrivacyPolicy {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Get active privacy policy (public)
export const getActivePrivacyPolicy = async (req: Request, res: Response<ApiResponse<PrivacyPolicy>>) => {
  try {
    const privacyPolicy = await prisma.privacyPolicy.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (!privacyPolicy) {
      return res.status(404).json({
        success: false,
        message: 'No active privacy policy found'
      });
    }

    res.json({
      success: true,
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error fetching active privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch privacy policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all privacy policies (admin)
export const getAllPrivacyPolicies = async (req: Request, res: Response<ApiResponse<PrivacyPolicy[]>>) => {
  try {
    const privacyPolicies = await prisma.privacyPolicy.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      data: privacyPolicies,
      count: privacyPolicies.length
    });
  } catch (error) {
    console.error('Error fetching all privacy policies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch privacy policies',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get privacy policy by ID
export const getPrivacyPolicyById = async (req: Request, res: Response<ApiResponse<PrivacyPolicy>>) => {
  try {
    const { id } = req.params;
    const privacyPolicy = await prisma.privacyPolicy.findUnique({
      where: { id }
    });

    if (!privacyPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy policy not found'
      });
    }

    res.json({
      success: true,
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch privacy policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create privacy policy
export const createPrivacyPolicy = async (req: Request, res: Response<ApiResponse<PrivacyPolicy>>) => {
  try {
    const {
      title = 'Privacy Policy',
      content,
      isActive = true
    } = req.body;

    const privacyPolicy = await prisma.privacyPolicy.create({
      data: {
        title,
        content,
        isActive: isActive === 'true' || isActive === true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Privacy policy created successfully',
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error creating privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create privacy policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update privacy policy
export const updatePrivacyPolicy = async (req: Request, res: Response<ApiResponse<PrivacyPolicy>>) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      isActive
    } = req.body;

    const existingPrivacyPolicy = await prisma.privacyPolicy.findUnique({
      where: { id }
    });

    if (!existingPrivacyPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy policy not found'
      });
    }

    const updateData: any = {
      title: title !== undefined ? title : existingPrivacyPolicy.title,
      content: content !== undefined ? content : existingPrivacyPolicy.content,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingPrivacyPolicy.isActive
    };

    const privacyPolicy = await prisma.privacyPolicy.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Privacy policy updated successfully',
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update privacy policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete privacy policy
export const deletePrivacyPolicy = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const existingPrivacyPolicy = await prisma.privacyPolicy.findUnique({
      where: { id }
    });

    if (!existingPrivacyPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy policy not found'
      });
    }

    await prisma.privacyPolicy.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Privacy policy deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete privacy policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
