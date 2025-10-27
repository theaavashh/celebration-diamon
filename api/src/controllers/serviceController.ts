import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, Service, CreateServiceRequest, UpdateServiceRequest } from '../types';

// Get all services (public)
export const getAllServices = async (req: Request, res: Response<ApiResponse<Service[]>>) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all services (admin)
export const getAdminServices = async (req: Request, res: Response<ApiResponse<Service[]>>) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get service by ID
export const getServiceById = async (req: Request, res: Response<ApiResponse<Service>>) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create service
export const createService = async (req: Request<{}, ApiResponse<Service>, CreateServiceRequest>, res: Response<ApiResponse<Service>>) => {
  try {
    const {
      title,
      description,
      link,
      isActive = true,
      sortOrder = 0
    } = req.body;

    // Convert string boolean to actual boolean
    const isActiveBoolean = isActive === 'true' || isActive === true;
    
    // Convert string to number for sortOrder
    const sortOrderNumber = typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0;

    // Get uploaded file path
    const imageUrl = req.file ? `/uploads/services/${req.file.filename}` : null;

    const service = await prisma.service.create({
      data: {
        title,
        description,
        imageUrl,
        link: link || null,
        isActive: isActiveBoolean,
        sortOrder: sortOrderNumber
      }
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update service
export const updateService = async (req: Request<{ id: string }, ApiResponse<Service>, UpdateServiceRequest>, res: Response<ApiResponse<Service>>) => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };

    // Convert string boolean to actual boolean if present
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }
    
    // Convert string to number for sortOrder
    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder = typeof updateData.sortOrder === 'string' ? parseInt(updateData.sortOrder, 10) : updateData.sortOrder;
    }

    // Get uploaded file path if new image is uploaded
    const imageUrl = req.file ? `/uploads/services/${req.file.filename}` : updateData.imageUrl;

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...updateData,
        imageUrl: imageUrl || null,
        link: updateData.link || null
      }
    });

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete service
export const deleteService = async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle service status
export const toggleServiceStatus = async (req: Request, res: Response<ApiResponse<Service>>) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive }
    });

    res.json({
      success: true,
      message: `Service ${updatedService.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedService
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle service status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


















