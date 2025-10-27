import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getAllTestimonialSections,
  getAllTestimonialSectionsAdmin,
  getTestimonialSectionById,
  createTestimonialSection,
  updateTestimonialSection,
  deleteTestimonialSection,
  toggleTestimonialSectionStatus
} from '../controllers/testimonialSectionController';

const router = Router();

// Public routes
router.get('/', getAllTestimonialSections);
router.get('/:id', getTestimonialSectionById);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAllTestimonialSectionsAdmin);
router.post('/', authMiddleware, createTestimonialSection);
router.put('/:id', authMiddleware, updateTestimonialSection);
router.delete('/:id', authMiddleware, deleteTestimonialSection);
router.patch('/:id/toggle-status', authMiddleware, toggleTestimonialSectionStatus);

export default router;