import express from 'express';
import { body } from 'express-validator';
import {
  getAllBanners,
  getAdminBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus
} from '../controllers/bannerController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Validation rules
const bannerValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Banner text is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Banner text must be between 1 and 200 characters'),
  
  body('linkText')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Link text must be less than 50 characters'),
  
  body('linkUrl')
    .optional()
    .isURL()
    .withMessage('Link URL must be a valid URL'),
  
  body('backgroundColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Background color must be a valid hex color'),
  
  body('textColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Text color must be a valid hex color'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('priority')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Priority must be a non-negative integer'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

// Public routes
router.get('/', getAllBanners);
router.get('/:id', getBannerById);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAdminBanners);
router.post('/', authMiddleware, bannerValidation, createBanner);
router.put('/:id', authMiddleware, bannerValidation, updateBanner);
router.delete('/:id', authMiddleware, deleteBanner);
router.patch('/:id/toggle', authMiddleware, toggleBannerStatus);

export default router;
