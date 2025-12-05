import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, Subcategory, CreateSubcategoryRequest, UpdateSubcategoryRequest } from '../types';

// Get all subcategories (public)
export const getAllSubcategories = async (req: Request, res: Response<ApiResponse<Subcategory[]>>) => {
  try {
    const subcategories = await prisma.subcategory.findMany({
      where: { 
        isActive: true,
        category: {
          isActive: true
        }
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true
      }
    });

    res.json({
      success: true,
      data: subcategories,
      count: subcategories.length
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all subcategories by category ID (public)
export const getSubcategoriesByCategoryId = async (req: Request, res: Response<ApiResponse<Subcategory[]>>) => {
  try {
    const { categoryId } = req.params;
    
    const subcategories = await prisma.subcategory.findMany({
      where: { 
        categoryId,
        isActive: true
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true
      }
    });
    
    res.json({
      success: true,
      data: subcategories,
      count: subcategories.length
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all subcategories (admin)
export const getAdminSubcategories = async (req: Request, res: Response<ApiResponse<Subcategory[]>>) => {
  try {
    const subcategories = await prisma.subcategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true
      }
    });
    
    console.log('Admin subcategories response:', subcategories);

    res.json({
      success: true,
      data: subcategories,
      count: subcategories.length
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get subcategory by ID
export const getSubcategoryById = async (req: Request, res: Response<ApiResponse<Subcategory>>) => {
  try {
    const { id } = req.params;
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
    
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    res.json({
      success: true,
      data: subcategory
    });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategory',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create subcategory
export const createSubcategory = async (req: Request<{}, ApiResponse<Subcategory>, CreateSubcategoryRequest>, res: Response<ApiResponse<Subcategory>>) => {
  try {
    const {
      name,
      categoryId,
      isActive = true,
      sortOrder = 0
    } = req.body;

    // Validate that category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Convert various types to actual boolean
    let isActiveBoolean = true;
    if (typeof isActive === 'string') {
      isActiveBoolean = isActive === 'true';
    } else if (typeof isActive === 'number') {
      isActiveBoolean = isActive === 1;
    } else if (typeof isActive === 'boolean') {
      isActiveBoolean = isActive;
    }
    
    // Convert string to number for sortOrder
    const sortOrderNumber = typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0;
    
    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        categoryId,
        isActive: isActiveBoolean,
        sortOrder: sortOrderNumber
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: subcategory
    });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subcategory',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update subcategory
export const updateSubcategory = async (req: Request<{ id: string }, ApiResponse<Subcategory>, UpdateSubcategoryRequest>, res: Response<ApiResponse<Subcategory>>) => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };

    // Convert various types to actual boolean if present
    if (updateData.isActive !== undefined) {
      if (typeof updateData.isActive === 'string') {
        updateData.isActive = updateData.isActive === 'true';
      } else if (typeof updateData.isActive === 'number') {
        updateData.isActive = updateData.isActive === 1;
      } else if (typeof updateData.isActive === 'boolean') {
        updateData.isActive = updateData.isActive;
      }
    }
    
    // Convert string to number for sortOrder
    if (updateData.sortOrder !== undefined) {
      updateData.sortOrder = typeof updateData.sortOrder === 'string' ? parseInt(updateData.sortOrder, 10) : updateData.sortOrder;
    }

    // Validate that category exists if provided
    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoryId }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    res.json({
      success: true,
      message: 'Subcategory updated successfully',
      data: subcategory
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subcategory',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete subcategory
export const deleteSubcategory = async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { id } = req.params;

    await prisma.subcategory.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle subcategory status
export const toggleSubcategoryStatus = async (req: Request<{ id: string }>, res: Response<ApiResponse<Subcategory>>) => {
  try {
    const { id } = req.params;

    // Find the subcategory
    const subcategory = await prisma.subcategory.findUnique({
      where: { id }
    });

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    // Toggle the isActive status
    const updatedSubcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        isActive: !subcategory.isActive
      },
      include: {
        category: true
      }
    });

    res.json({
      success: true,
      message: `Subcategory ${updatedSubcategory.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedSubcategory
    });
  } catch (error) {
    console.error('Error toggling subcategory status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subcategory status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};