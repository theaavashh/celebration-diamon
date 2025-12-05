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
    
    console.log('Public categories response:', categories);

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
    
    console.log('Admin categories response:', categories);

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

// Get all categories with subcategories (admin)
export const getAdminCategoriesWithSubcategories = async (req: Request, res: Response<ApiResponse<any[]>>) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        subcategories: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    
    console.log('Admin categories with subcategories response:', categories);

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories with subcategories',
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
      iconUrl: iconUrlFromBody,
      imageUrl: imageUrlFromBody,
      link,
      isActive = true,
      sortOrder = 0
    } = req.body;

    // Convert string boolean to actual boolean
    const isActiveBoolean = typeof isActive === 'string' ? isActive === 'true' : isActive;
    
    // Convert string to number for sortOrder
    const sortOrderNumber = typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0;

    // Get uploaded file paths
    const iconUrl = req.files && (req.files as any).icon ? `/uploads/categories/icons/${(req.files as any).icon[0].filename}` : (iconUrlFromBody || null);
    const imageUrl = req.files && (req.files as any).image ? `/uploads/categories/images/${(req.files as any).image[0].filename}` : (imageUrlFromBody || null);

    const category = await prisma.category.create({
      data: {
        title,
        iconUrl,
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
    const {
      title,
      iconUrl: iconUrlFromBody,
      imageUrl: imageUrlFromBody,
      link,
      isActive,
      sortOrder
    } = req.body;

    // Prepare update data
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (link !== undefined) updateData.link = link || null;
    if (isActive !== undefined) {
      updateData.isActive = typeof isActive === 'string' ? isActive === 'true' : isActive;
    }
    if (sortOrder !== undefined) {
      updateData.sortOrder = typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder;
    }

    // Get uploaded file paths if new files are uploaded
    let iconUrl = iconUrlFromBody || null;
    let imageUrl = imageUrlFromBody || null;

    if (req.files) {
      if ((req.files as any).icon) {
        iconUrl = `/uploads/categories/icons/${(req.files as any).icon[0].filename}`;
      }
      if ((req.files as any).image) {
        imageUrl = `/uploads/categories/images/${(req.files as any).image[0].filename}`;
      }
    }

    // Add file URLs to update data if they exist
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const category = await prisma.category.update({
      where: { id },
      data: updateData
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
