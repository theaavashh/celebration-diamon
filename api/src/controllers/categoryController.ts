import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types';

// Get all categories (public)
export const getAllCategories = async (req: Request, res: Response<ApiResponse<Category[]>>) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all categories (admin)
export const getAdminCategories = async (req: Request, res: Response<ApiResponse<Category[]>>) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response<ApiResponse<Category>>) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create category
export const createCategory = async (req: Request<{}, ApiResponse<Category>, CreateCategoryRequest>, res: Response<ApiResponse<Category>>) => {
  try {
    const {
      title,
      link,
      isActive = true,
      sortOrder = 0
    } = req.body;

    // Convert string boolean to actual boolean
    const isActiveBoolean = isActive === 'true' || isActive === true;
    
    // Convert string to number for sortOrder
    const sortOrderNumber = typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0;

    // Get uploaded file path
    const imageUrl = req.file ? `/uploads/categories/${req.file.filename}` : null;

    const category = await prisma.category.create({
      data: {
        title,
        imageUrl,
        link: link || null,
        isActive: isActiveBoolean,
        sortOrder: sortOrderNumber
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update category
export const updateCategory = async (req: Request<{ id: string }, ApiResponse<Category>, UpdateCategoryRequest>, res: Response<ApiResponse<Category>>) => {
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
    const imageUrl = req.file ? `/uploads/categories/${req.file.filename}` : updateData.imageUrl;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...updateData,
        imageUrl: imageUrl || null,
        link: updateData.link || null
      }
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response<ApiResponse<null>>) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle category status
export const toggleCategoryStatus = async (req: Request, res: Response<ApiResponse<Category>>) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { isActive: !category.isActive }
    });

    res.json({
      success: true,
      message: `Category ${updatedCategory.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error toggling category status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle category status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
