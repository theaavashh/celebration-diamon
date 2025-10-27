import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { 
  CreateTestimonialRequestSchema, 
  UpdateTestimonialRequestSchema, 
  TestimonialIdSchema, 
  TestimonialQuerySchema,
  type CreateTestimonialRequest,
  type UpdateTestimonialRequest,
  type TestimonialQuery,
  type TestimonialResponse,
  type TestimonialListResponse
} from '../validation/testimonialValidation';
import { z } from 'zod';

const prisma = new PrismaClient();

/**
 * Custom error classes for better error handling
 */
class TestimonialNotFoundError extends Error {
  constructor(id: string) {
    super(`Testimonial with ID ${id} not found`);
    this.name = 'TestimonialNotFoundError';
  }
}

class TestimonialValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestimonialValidationError';
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
      throw new TestimonialValidationError(`Validation failed: ${errorMessages.join(', ')}`);
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
 * Get all testimonials (public endpoint)
 */
export const getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = validateRequest(TestimonialQuerySchema, req.query);
    const { page, limit, sortBy, sortOrder, isActive, search } = queryParams;

    // Build where clause
    const where: Prisma.TestimonialWhereInput = {
      isActive: isActive ?? true, // Default to active testimonials only for public
      ...(search && {
        OR: [
          { clientName: { contains: search, mode: 'insensitive' } },
          { clientTitle: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    // Build order by clause
    const orderBy: Prisma.TestimonialOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      prisma.testimonial.count({ where })
    ]);

    const response = buildPaginationResponse(testimonials, total, page, limit);

    res.status(200).json({
      success: true,
      data: response.data,
      pagination: response.pagination,
      message: 'Testimonials retrieved successfully'
    });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    
    if (error instanceof TestimonialValidationError) {
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
 * Get all testimonials (admin endpoint)
 */
export const getAllTestimonialsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryParams = validateRequest(TestimonialQuerySchema, req.query);
    const { page, limit, sortBy, sortOrder, isActive, search } = queryParams;

    // Build where clause
    const where: Prisma.TestimonialWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { clientName: { contains: search, mode: 'insensitive' } },
          { clientTitle: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    // Build order by clause
    const orderBy: Prisma.TestimonialOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      prisma.testimonial.count({ where })
    ]);

    const response = buildPaginationResponse(testimonials, total, page, limit);

    res.status(200).json({
      success: true,
      data: response.data,
      pagination: response.pagination,
      message: 'Testimonials retrieved successfully'
    });
  } catch (error) {
    console.error('Get all testimonials admin error:', error);
    
    if (error instanceof TestimonialValidationError) {
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
 * Get testimonial by ID
 */
export const getTestimonialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = validateRequest(TestimonialIdSchema, req.params);

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      throw new TestimonialNotFoundError(id);
    }

    res.status(200).json({
      success: true,
      data: testimonial,
      message: 'Testimonial retrieved successfully'
    });
  } catch (error) {
    console.error('Get testimonial by ID error:', error);
    
    if (error instanceof TestimonialNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof TestimonialValidationError) {
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
 * Create new testimonial
 */
export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonialData = validateRequest(CreateTestimonialRequestSchema, req.body);

    const testimonial = await withTransaction(async (tx) => {
      const newTestimonial = await tx.testimonial.create({
        data: {
          clientName: testimonialData.clientName,
          clientTitle: testimonialData.clientTitle,
          company: testimonialData.company,
          content: testimonialData.content,
          rating: testimonialData.rating,
          imageUrl: testimonialData.imageUrl,
          isActive: testimonialData.isActive,
          sortOrder: testimonialData.sortOrder
        }
      });

      return newTestimonial;
    });

    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully'
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    
    if (error instanceof TestimonialValidationError) {
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
 * Update testimonial
 */
export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = validateRequest(TestimonialIdSchema, req.params);
    const updateData = validateRequest(UpdateTestimonialRequestSchema, req.body);

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existingTestimonial) {
      throw new TestimonialNotFoundError(id);
    }

    const testimonial = await withTransaction(async (tx) => {
      const updatedTestimonial = await tx.testimonial.update({
        where: { id },
        data: {
          clientName: updateData.clientName,
          clientTitle: updateData.clientTitle,
          company: updateData.company,
          content: updateData.content,
          rating: updateData.rating,
          imageUrl: updateData.imageUrl,
          isActive: updateData.isActive,
          sortOrder: updateData.sortOrder
        }
      });

      return updatedTestimonial;
    });

    res.status(200).json({
      success: true,
      data: testimonial,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    
    if (error instanceof TestimonialNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof TestimonialValidationError) {
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
 * Delete testimonial
 */
export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = validateRequest(TestimonialIdSchema, req.params);

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existingTestimonial) {
      throw new TestimonialNotFoundError(id);
    }

    await withTransaction(async (tx) => {
      await tx.testimonial.delete({
        where: { id }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    
    if (error instanceof TestimonialNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof TestimonialValidationError) {
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
 * Toggle testimonial status
 */
export const toggleTestimonialStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = validateRequest(TestimonialIdSchema, req.params);

    const testimonial = await withTransaction(async (tx) => {
      // Get current testimonial
      const currentTestimonial = await tx.testimonial.findUnique({
        where: { id }
      });

      if (!currentTestimonial) {
        throw new TestimonialNotFoundError(id);
      }

      // Update status
      const updatedTestimonial = await tx.testimonial.update({
        where: { id },
        data: {
          isActive: !currentTestimonial.isActive
        }
      });

      return updatedTestimonial;
    });

    res.status(200).json({
      success: true,
      data: testimonial,
      message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle testimonial status error:', error);
    
    if (error instanceof TestimonialNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message
      });
      return;
    }

    if (error instanceof TestimonialValidationError) {
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
