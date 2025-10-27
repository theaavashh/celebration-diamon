import express from 'express';
import { body } from 'express-validator';
import {
  getAllHeroSections,
  getAdminHeroSections,
  getHeroSectionById,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  toggleHeroSectionStatus
} from '../controllers/heroController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadHeroImage } from '../middleware/upload';

const router = express.Router();

// Validation rules
const heroValidation = [
  body('heading')
    .trim()
    .notEmpty()
    .withMessage('Heading is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Heading must be between 1 and 200 characters'),
  
  body('subHeading')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Sub-heading must be less than 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('ctaTitle')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('CTA title must be less than 50 characters'),
  
  body('ctaLink')
    .optional()
    .matches(/^\/[a-zA-Z0-9\-\/]*$/)
    .withMessage('CTA link must be a valid internal path (e.g., /products, /about)'),
  
  // imageUrl validation removed as we're using file upload
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Public routes
router.get('/', getAllHeroSections);
router.get('/:id', getHeroSectionById);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAdminHeroSections);
router.post('/', authMiddleware, uploadHeroImage, heroValidation, createHeroSection);
router.put('/:id', authMiddleware, uploadHeroImage, heroValidation, updateHeroSection);
router.delete('/:id', authMiddleware, deleteHeroSection);
router.patch('/:id/toggle', authMiddleware, toggleHeroSectionStatus);

export default router;
