import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get testimonial settings (returns first section or creates default)
router.get('/admin', async (_req, res) => {
  try {
    let section = await prisma.testimonialSection.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    if (!section) {
      // Create a default section if none exists
      section = await prisma.testimonialSection.create({
        data: {
          title: 'Testimonials',
          subtitle: 'What our clients say about us',
          isActive: true
        }
      });
    }

    res.json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Error fetching testimonial settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonial settings'
    });
  }
});

// Update testimonial settings
router.put('/admin', async (req, res) => {
  try {
    let section = await prisma.testimonialSection.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    const { title, subtitle, isActive } = req.body;

    if (!section) {
      // Create new section
      section = await prisma.testimonialSection.create({
        data: {
          title: title || 'Testimonials',
          subtitle: subtitle || null,
          isActive: isActive !== undefined ? Boolean(isActive) : true
        }
      });
    } else {
      // Update existing section
      section = await prisma.testimonialSection.update({
        where: { id: section.id },
        data: {
          title: title || section.title,
          subtitle: subtitle !== undefined ? subtitle : section.subtitle,
          isActive: isActive !== undefined ? Boolean(isActive) : section.isActive
        }
      });
    }

    res.json({
      success: true,
      data: section,
      message: 'Testimonial settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating testimonial settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial settings'
    });
  }
});

export default router;


