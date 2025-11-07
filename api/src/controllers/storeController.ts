import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../types';

export interface Store {
  id: string;
  title: string;
  location: string;
  phone: string | null;
  email: string | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  mediaType: string;
  imageUrl: string | null;
  videoUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Get all stores (public)
export const getAllStores = async (req: Request, res: Response<ApiResponse<Store[]>>) => {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: stores,
      count: stores.length
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all stores (admin)
export const getAdminStores = async (req: Request, res: Response<ApiResponse<Store[]>>) => {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: stores,
      count: stores.length
    });
  } catch (error) {
    console.error('Error fetching admin stores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get store by ID
export const getStoreById = async (req: Request, res: Response<ApiResponse<Store>>) => {
  try {
    const { id } = req.params;
    const store = await prisma.store.findUnique({
      where: { id }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create store
export const createStore = async (req: Request, res: Response<ApiResponse<Store>>) => {
  try {
    const {
      title,
      location,
      phone,
      email,
      hours,
      latitude,
      longitude,
      description,
      mediaType = 'image',
      videoUrl,
      isActive = true,
      sortOrder = 0
    } = req.body;

    // Get uploaded file path if image
    const imageUrl = req.file ? `/uploads/stores/${req.file.filename}` : null;

    const store = await prisma.store.create({
      data: {
        title,
        location,
        phone: phone || null,
        email: email || null,
        hours: hours || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        description: description || null,
        mediaType: mediaType === 'video' ? 'video' : 'image',
        imageUrl,
        videoUrl: mediaType === 'video' ? videoUrl : null,
        isActive: isActive === 'true' || isActive === true,
        sortOrder: typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store
    });
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create store',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update store
export const updateStore = async (req: Request, res: Response<ApiResponse<Store>>) => {
  try {
    const { id } = req.params;
    const {
      title,
      location,
      phone,
      email,
      hours,
      latitude,
      longitude,
      description,
      mediaType,
      videoUrl,
      isActive,
      sortOrder
    } = req.body;

    const existingStore = await prisma.store.findUnique({
      where: { id }
    });

    if (!existingStore) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get uploaded file path if new image provided
    const imageUrl = req.file ? `/uploads/stores/${req.file.filename}` : existingStore.imageUrl;

    const updateData: any = {
      title: title !== undefined ? title : existingStore.title,
      location: location !== undefined ? location : existingStore.location,
      phone: phone !== undefined ? (phone || null) : existingStore.phone,
      email: email !== undefined ? (email || null) : existingStore.email,
      hours: hours !== undefined ? (hours || null) : existingStore.hours,
      latitude: latitude !== undefined ? (latitude ? parseFloat(latitude) : null) : existingStore.latitude,
      longitude: longitude !== undefined ? (longitude ? parseFloat(longitude) : null) : existingStore.longitude,
      description: description !== undefined ? (description || null) : existingStore.description,
      mediaType: mediaType !== undefined ? mediaType : existingStore.mediaType,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existingStore.isActive,
      sortOrder: sortOrder !== undefined ? (typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder) : existingStore.sortOrder
    };

    if (mediaType === 'video') {
      updateData.videoUrl = videoUrl !== undefined ? videoUrl : existingStore.videoUrl;
      updateData.imageUrl = null;
    } else {
      updateData.imageUrl = imageUrl;
      updateData.videoUrl = null;
    }

    const store = await prisma.store.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: store
    });
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete store
export const deleteStore = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const existingStore = await prisma.store.findUnique({
      where: { id }
    });

    if (!existingStore) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    await prisma.store.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete store',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle store status
export const toggleStoreStatus = async (req: Request, res: Response<ApiResponse<Store>>) => {
  try {
    const { id } = req.params;

    const existingStore = await prisma.store.findUnique({
      where: { id }
    });

    if (!existingStore) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const store = await prisma.store.update({
      where: { id },
      data: {
        isActive: !existingStore.isActive
      }
    });

    res.json({
      success: true,
      message: `Store ${store.isActive ? 'activated' : 'deactivated'} successfully`,
      data: store
    });
  } catch (error) {
    console.error('Error toggling store status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle store status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
