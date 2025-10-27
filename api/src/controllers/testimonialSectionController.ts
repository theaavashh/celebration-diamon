import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all testimonial sections (public)
export const getAllTestimonialSections = async (req: Request, res: Response) => {
  try {
    const sections = await prisma.testimonialSection.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      data: sections,
      message: 'Testimonial sections retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching testimonial sections:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch testimonial sections'
    });
  }
};

// Get all testimonial sections (admin)
export const getAllTestimonialSectionsAdmin = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as 'all' | 'active' | 'inactive' || 'all';
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      where.isActive = status === 'active';
    }

    const [sections, total] = await Promise.all([
      prisma.testimonialSection.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit
      }),
      prisma.testimonialSection.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: sections,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      message: 'Testimonial sections retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching testimonial sections:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch testimonial sections'
    });
  }
};

// Get testimonial section by ID
export const getTestimonialSectionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const section = await prisma.testimonialSection.findUnique({
      where: { id }
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Testimonial section not found'
      });
    }

    res.json({
      success: true,
      data: section,
      message: 'Testimonial section retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching testimonial section:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch testimonial section'
    });
  }
};

// Create testimonial section
export const createTestimonialSection = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, isActive } = req.body;
    
    // Basic validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Title is required'
      });
    }
    
    const data = {
      title: title.trim(),
      subtitle: subtitle?.trim() || null,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    };

    const section = await prisma.testimonialSection.create({
      data
    });

    res.status(201).json({
      success: true,
      data: section,
      message: 'Testimonial section created successfully'
    });
  } catch (error) {
    console.error('Error creating testimonial section:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create testimonial section'
    });
  }
};

// Update testimonial section
export const updateTestimonialSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, isActive } = req.body;
    
    // Build update data object
    const data: any = {};
    
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Title cannot be empty'
        });
      }
      data.title = title.trim();
    }
    
    if (subtitle !== undefined) {
      data.subtitle = subtitle?.trim() || null;
    }
    
    if (isActive !== undefined) {
      data.isActive = Boolean(isActive);
    }

    const section = await prisma.testimonialSection.update({
      where: { id },
      data
    });

    res.json({
      success: true,
      data: section,
      message: 'Testimonial section updated successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Testimonial section not found'
      });
    }

    console.error('Error updating testimonial section:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update testimonial section'
    });
  }
};

// Delete testimonial section
export const deleteTestimonialSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const section = await prisma.testimonialSection.findUnique({
      where: { id }
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Testimonial section not found'
      });
    }

    await prisma.testimonialSection.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Testimonial section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial section:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete testimonial section'
    });
  }
};

// Toggle testimonial section status
export const toggleTestimonialSectionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const section = await prisma.testimonialSection.findUnique({
      where: { id }
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Testimonial section not found'
      });
    }

    const updatedSection = await prisma.testimonialSection.update({
      where: { id },
      data: { isActive: !section.isActive }
    });

    res.json({
      success: true,
      data: updatedSection,
      message: `Testimonial section ${updatedSection.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling testimonial section status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to toggle testimonial section status'
    });
  }
};