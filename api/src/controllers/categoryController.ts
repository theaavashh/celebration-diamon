import { Request, Response } from 'express';
import prisma from '../config/database';
import { Category, Subcategory, Prisma } from '@prisma/client';
// Import Zod types
import { 
  CreateCategoryWithSubcategoriesInput, 
  UpdateCategoryInput, 
  SubcategoryInput 
} from '../validation/categorySchema';

// Define response types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
}

// Get all categories (public)
export const getAllCategories = async (req: Request<{}, ApiResponse<Category[]>>, res: Response<ApiResponse<Category[]>>) => {
  try {
    // @ts-ignore - Prisma client needs to be regenerated after schema update
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

// Get all categories with subcategories (admin)
export const getAdminCategories = async (req: Request<{}, ApiResponse<CategoryWithSubcategories[]>>, res: Response<ApiResponse<CategoryWithSubcategories[]>>) => {
  try {
    // @ts-ignore - Prisma client needs to be regenerated after schema update
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        subcategories: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    res.json({
      success: true,
      data: categories as CategoryWithSubcategories[],
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
export const getCategoryById = async (req: Request<{ id: string }, ApiResponse<Category>, {}>, res: Response<ApiResponse<Category>>) => {
  try {
    const { id } = req.params;
    // @ts-ignore - Prisma client needs to be regenerated after schema update
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

// Create category with subcategories in a single transaction
export const createCategoryWithSubcategories = async (req: Request<{}, ApiResponse<CategoryWithSubcategories>, CreateCategoryWithSubcategoriesInput>, res: Response<ApiResponse<CategoryWithSubcategories>>) => {
  try {
    const isActiveValue = req.body.isActive;
    const isActive = typeof isActiveValue === 'string'
      ? isActiveValue.toLowerCase() === 'true'
      : (typeof isActiveValue === 'boolean' ? isActiveValue : true);

    let subcategories = Array.isArray(req.body.subcategories) ? req.body.subcategories : [];
    
    const {
      title,
      link,
      iconUrl: iconUrlFromBody,
      imageUrl: imageUrlFromBody,
      navImage1Url: navImage1UrlFromBody,
      navImage2Url: navImage2UrlFromBody,
      sortOrder = 0
    } = req.body;

    // Handle file uploads
    let iconUrl = iconUrlFromBody || null;
    let imageUrl = imageUrlFromBody || null;
    let navImage1Url = navImage1UrlFromBody || null;
    let navImage2Url = navImage2UrlFromBody || null;
    
    // Check for uploaded files
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.icon && files.icon[0]) {
        iconUrl = `/uploads/categories/icons/${files.icon[0].filename}`;
      }
      if (files.image && files.image[0]) {
        imageUrl = `/uploads/categories/images/${files.image[0].filename}`;
      }
      // Handle navigation image uploads
      if (files.navImage1 && files.navImage1[0]) {
        navImage1Url = `/uploads/categories/nav-images/${files.navImage1[0].filename}`;
      }
      if (files.navImage2 && files.navImage2[0]) {
        navImage2Url = `/uploads/categories/nav-images/${files.navImage2[0].filename}`;
      }
    }

    const createTransaction = async (includeNavFields: boolean) => {
      return prisma.$transaction(async (tx) => {
        const data: any = {
          title,
          iconUrl,
          imageUrl,
          link: link || null,
          isActive,
          sortOrder: typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder || 0
        };

        if (includeNavFields) {
          if (navImage1Url) data.navImage1Url = navImage1Url;
          if (navImage2Url) data.navImage2Url = navImage2Url;
        }

        const category = await tx.category.create({
          data
        });

        if (subcategories.length > 0) {
          const subcategoryData = subcategories.map((sub: SubcategoryInput, index: number) => ({
            name: sub.name,
            categoryId: category.id,
            isActive: sub.isActive !== undefined ? sub.isActive : true,
            sortOrder: sub.sortOrder !== undefined ? sub.sortOrder : index
          }));

          await tx.subcategory.createMany({
            data: subcategoryData
          });
        }

        const completeCategory = await tx.category.findUnique({
          where: { id: category.id },
          include: {
            subcategories: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        });

        return completeCategory as CategoryWithSubcategories;
      });
    };

    let result: CategoryWithSubcategories | null = null;
    try {
      result = await createTransaction(true);
    } catch (err: any) {
      const isValidationError = err instanceof Prisma.PrismaClientValidationError;
      const message = err?.message || '';
      const unknownNavArg = isValidationError && (message.includes('Unknown arg') || message.includes('Unknown argument')) && (message.includes('navImage1Url') || message.includes('navImage2Url'));
      if (unknownNavArg) {
        result = await createTransaction(false);
      } else {
        throw err;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Category and subcategories created successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category with subcategories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update category
export const updateCategory = async (req: Request<{ id: string }, ApiResponse<Category>, UpdateCategoryInput>, res: Response<ApiResponse<Category>>) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle file uploads
    let iconUrl: string | null | undefined = updateData.iconUrl;
    let imageUrl: string | null | undefined = updateData.imageUrl;
    let navImage1Url: string | null | undefined = updateData.navImage1Url;
    let navImage2Url: string | null | undefined = updateData.navImage2Url;
    
    // Check for uploaded files
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.icon && files.icon[0]) {
        iconUrl = `/uploads/categories/icons/${files.icon[0].filename}`;
      }
      if (files.image && files.image[0]) {
        imageUrl = `/uploads/categories/images/${files.image[0].filename}`;
      }
      // Handle navigation image uploads
      if (files.navImage1 && files.navImage1[0]) {
        navImage1Url = `/uploads/categories/nav-images/${files.navImage1[0].filename}`;
      }
      if (files.navImage2 && files.navImage2[0]) {
        navImage2Url = `/uploads/categories/nav-images/${files.navImage2[0].filename}`;
      }
    }

    const dataToUpdate: any = {};
    
    // Only include fields that were actually provided
    if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
    if (updateData.link !== undefined) {
      dataToUpdate.link = updateData.link === '' ? null : updateData.link;
    }
    if (updateData.isActive !== undefined) {
      dataToUpdate.isActive = typeof updateData.isActive === 'string'
        ? updateData.isActive.toLowerCase() === 'true'
        : updateData.isActive;
    }
    if (updateData.sortOrder !== undefined) {
      const parsed = typeof updateData.sortOrder === 'string' ? parseInt(updateData.sortOrder, 10) : updateData.sortOrder;
      dataToUpdate.sortOrder = Number.isNaN(parsed as any) ? 0 : parsed;
    }
    
    // Handle file URLs separately to preserve existing values
    if (iconUrl !== undefined) dataToUpdate.iconUrl = iconUrl === '' ? null : iconUrl;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl === '' ? null : imageUrl;
    if (navImage1Url !== undefined) dataToUpdate.navImage1Url = navImage1Url === '' ? null : navImage1Url;
    if (navImage2Url !== undefined) dataToUpdate.navImage2Url = navImage2Url === '' ? null : navImage2Url;

    const tryUpdate = async (includeNavFields: boolean) => {
      const data: any = { ...dataToUpdate };
      if (!includeNavFields) {
        delete data.navImage1Url;
        delete data.navImage2Url;
      }
      return prisma.category.update({
        where: { id },
        data
      });
    };

    let category: Category | null = null;
    try {
      category = await tryUpdate(true);
    } catch (err: any) {
      const isValidationError = err instanceof Prisma.PrismaClientValidationError;
      const message = err?.message || '';
      const unknownNavArg = isValidationError && (message.includes('Unknown arg') || message.includes('Unknown argument')) && (message.includes('navImage1Url') || message.includes('navImage2Url'));
      if (unknownNavArg) {
        category = await tryUpdate(false);
      } else {
        throw err;
      }
    }

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
export const deleteCategory = async (req: Request<{ id: string }, ApiResponse<{}>, {}>, res: Response<ApiResponse<{}>>) => {
  try {
    const { id } = req.params;
    
    // Delete subcategories first, then the category
    await prisma.$transaction([
      prisma.subcategory.deleteMany({
        where: { categoryId: id }
      }),
      prisma.category.delete({
        where: { id }
      })
    ]);

    res.json({
      success: true,
      message: 'Category and associated subcategories deleted successfully'
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
export const toggleCategoryStatus = async (req: Request<{ id: string }, ApiResponse<Category>, {}>, res: Response<ApiResponse<Category>>) => {
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

// Get subcategories by category ID
export const getSubcategoriesByCategory = async (req: Request<{ categoryId: string }, ApiResponse<Subcategory[]>, {}>, res: Response<ApiResponse<Subcategory[]>>) => {
  try {
    const { categoryId } = req.params;
    
    const subcategories = await prisma.subcategory.findMany({
      where: { 
        categoryId,
        isActive: true
      },
      orderBy: { sortOrder: 'asc' }
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

// Get subcategory by ID
export const getSubcategoryById = async (req: Request<{ id: string }, ApiResponse<Subcategory>, {}>, res: Response<ApiResponse<Subcategory>>) => {
  try {
    const { id } = req.params;
    
    const subcategory = await prisma.subcategory.findUnique({
      where: { id }
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
export const createSubcategory = async (req: Request<{ categoryId: string }, ApiResponse<Subcategory>, SubcategoryInput>, res: Response<ApiResponse<Subcategory>>) => {
  try {
    const { categoryId } = req.params;
    const { name, isActive = true, sortOrder = 0 } = req.body;

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        categoryId,
        isActive,
        sortOrder
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
export const updateSubcategory = async (req: Request<{ id: string }, ApiResponse<Subcategory>, SubcategoryInput>, res: Response<ApiResponse<Subcategory>>) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: updateData
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
export const deleteSubcategory = async (req: Request<{ id: string }, ApiResponse<{}>, {}>, res: Response<ApiResponse<{}>>) => {
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
export const toggleSubcategoryStatus = async (req: Request<{ id: string }, ApiResponse<Subcategory>, {}>, res: Response<ApiResponse<Subcategory>>) => {
  try {
    const { id } = req.params;
    const subcategory = await prisma.subcategory.findUnique({
      where: { id }
    });

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: { id },
      data: { isActive: !subcategory.isActive }
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
      message: 'Failed to toggle subcategory status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
