import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { 
  CreateGalleryRequestSchema, 
  UpdateGalleryRequestSchema, 
  GalleryIdSchema, 
  GalleryQuerySchema,
  type CreateGalleryRequest,
  type UpdateGalleryRequest,
  type GalleryQuery,
  type GalleryResponse,
  type GalleryListResponse
} from '../validation/galleryValidation';
import { z } from 'zod';

const prisma = new PrismaClient();

/**
 * Custom error classes for better error handling
 */
class GalleryNotFoundError extends Error {
  constructor(id: string) {
    super(`Gallery with ID ${id} not found`);
    this.name = 'GalleryNotFoundError';
  }
}

class GalleryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GalleryValidationError';
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Utility function to handle database transactions
 */
async function withTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    try {
      return await operation(tx);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseError(`Database operation failed: ${error.message}`);
      }
      throw error;
    }
  });
}

/**
 * Utility function to validate and parse request data
 */
function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError && error.errors) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new GalleryValidationError(`Validation failed: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
}

/**
 * Build pagination response
 */
function buildPaginationResponse(
  items: any[], 
  total: number, 
  page: number, 
  limit: number
) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

/**
 * Get all galleries (public endpoint)
 */
export const getAllGalleries = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = validateRequest(GalleryQuerySchema, req.query);
    const { page, limit, sortBy, sortOrder, isActive, search } = queryParams;

    // Build where clause
    const where: Prisma.GalleryWhereInput = {
      isActive: isActive ?? true, // Default to active galleries only for public
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
          { galleryItems: { some: { title: { contains: search, mode: 'insensitive' } } } }
        ]
      })
    };

    // Build order by clause
    const orderBy: Prisma.GalleryOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    const skip = (page - 1) * limit;

    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        include: {
          galleryItems: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.gallery.count({ where })
    ]);

    const response = buildPaginationResponse(galleries, total, page, limit);

    res.status(200).json({
      success: true,
      data: response.data,
      pagination: response.pagination,
      message: 'Galleries retrieved successfully'
    });
  } catch (error) {
    console.error('Get all galleries error:', error);
    
    if (error instanceof GalleryValidationError) {
      res.status(400).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get all galleries (admin endpoint)
 */
export const getAllGalleriesAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = validateRequest(GalleryQuerySchema, req.query);
    const { page, limit, sortBy, sortOrder, isActive, search } = queryParams;

    // Build where clause
    const where: Prisma.GalleryWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
          { galleryItems: { some: { title: { contains: search, mode: 'insensitive' } } } }
        ]
      })
    };

    // Build order by clause
    const orderBy: Prisma.GalleryOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    const skip = (page - 1) * limit;

    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        include: {
          galleryItems: {
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.gallery.count({ where })
    ]);

    const response = buildPaginationResponse(galleries, total, page, limit);

    res.status(200).json({
      success: true,
      data: response.data,
      pagination: response.pagination,
      message: 'Galleries retrieved successfully'
    });
  } catch (error) {
    console.error('Get all galleries admin error:', error);
    
    if (error instanceof GalleryValidationError) {
      res.status(400).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get gallery by ID
 */
export const getGalleryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = validateRequest(GalleryIdSchema, req.params);

    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: {
        galleryItems: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!gallery) {
      throw new GalleryNotFoundError(id);
    }

    res.status(200).json({
      success: true,
      data: gallery,
      message: 'Gallery retrieved successfully'
    });
  } catch (error) {
    console.error('Get gallery by ID error:', error);
    
    if (error instanceof GalleryNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof GalleryValidationError) {
      res.status(400).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Create new gallery
 */
export const createGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const galleryData = validateRequest(CreateGalleryRequestSchema, req.body);

    const gallery = await withTransaction(async (tx) => {
      // Create gallery
      const newGallery = await tx.gallery.create({
        data: {
          title: galleryData.title,
          subtitle: galleryData.subtitle,
          isActive: galleryData.isActive,
          sortOrder: galleryData.sortOrder,
          galleryItems: galleryData.galleryItems ? {
            create: galleryData.galleryItems.map((item, index) => ({
              title: item.title,
              imageUrl: item.imageUrl,
              description: item.description,
              sortOrder: item.sortOrder || index + 1,
              isActive: item.isActive
            }))
          } : undefined
        },
        include: {
          galleryItems: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      });

      return newGallery;
    });

    res.status(201).json({
      success: true,
      data: gallery,
      message: 'Gallery created successfully'
    });
  } catch (error) {
    console.error('Create gallery error:', error);
    
    if (error instanceof GalleryValidationError) {
      res.status(400).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof DatabaseError) {
      res.status(500).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Update gallery
 */
export const updateGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = validateRequest(GalleryIdSchema, req.params);
    const updateData = validateRequest(UpdateGalleryRequestSchema, req.body);

    // Check if gallery exists
    const existingGallery = await prisma.gallery.findUnique({
      where: { id },
      include: { galleryItems: true }
    });

    if (!existingGallery) {
      throw new GalleryNotFoundError(id);
    }

    const gallery = await withTransaction(async (tx) => {
      // Update gallery
      const updatedGallery = await tx.gallery.update({
        where: { id },
        data: {
          title: updateData.title,
          subtitle: updateData.subtitle,
          isActive: updateData.isActive,
          sortOrder: updateData.sortOrder
        }
      });

      // Update gallery items if provided
      if (updateData.galleryItems) {
        // Delete existing items
        await tx.galleryItem.deleteMany({
          where: { galleryId: id }
        });

        // Create new items
        await tx.galleryItem.createMany({
          data: updateData.galleryItems.map((item, index) => ({
            galleryId: id,
            title: item.title,
            imageUrl: item.imageUrl,
            description: item.description,
            sortOrder: item.sortOrder || index + 1,
            isActive: item.isActive
          }))
        });
      }

      // Return updated gallery with items
      return await tx.gallery.findUnique({
        where: { id },
        include: {
          galleryItems: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      data: gallery,
      message: 'Gallery updated successfully'
    });
  } catch (error) {
    console.error('Update gallery error:', error);
    
    if (error instanceof GalleryNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof GalleryValidationError) {
      res.status(400).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof DatabaseError) {
      res.status(500).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Delete gallery
 */
export const deleteGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = validateRequest(GalleryIdSchema, req.params);

    // Check if gallery exists
    const existingGallery = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!existingGallery) {
      throw new GalleryNotFoundError(id);
    }

    await withTransaction(async (tx) => {
      // Delete gallery (cascade will delete gallery items)
      await tx.gallery.delete({
        where: { id }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Gallery deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery error:', error);
    
    if (error instanceof GalleryNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof GalleryValidationError) {
      res.status(400).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof DatabaseError) {
      res.status(500).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Toggle gallery status
 */
export const toggleGalleryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = validateRequest(GalleryIdSchema, req.params);

    const gallery = await withTransaction(async (tx) => {
      // Get current gallery
      const currentGallery = await tx.gallery.findUnique({
        where: { id },
        include: { galleryItems: true }
      });

      if (!currentGallery) {
        throw new GalleryNotFoundError(id);
      }

      // Update status
      const updatedGallery = await tx.gallery.update({
        where: { id },
        data: {
          isActive: !currentGallery.isActive
        },
        include: {
          galleryItems: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      });

      return updatedGallery;
    });

    res.status(200).json({
      success: true,
      data: gallery,
      message: `Gallery ${gallery.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle gallery status error:', error);
    
    if (error instanceof GalleryNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof GalleryValidationError) {
      res.status(400).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof DatabaseError) {
      res.status(500).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
