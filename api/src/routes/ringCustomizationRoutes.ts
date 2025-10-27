import express from 'express';
import { body } from 'express-validator';
import {
  getAllRingCustomizations,
  getAllRingCustomizationsAdmin,
  getRingCustomizationById,
  createRingCustomization,
  updateRingCustomization,
  deleteRingCustomization,
  toggleRingCustomizationStatus
} from '../controllers/ringCustomizationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllRingCustomizations);

// Admin routes (protected)
router.get('/admin', authMiddleware, getAllRingCustomizationsAdmin);
router.get('/:id', authMiddleware, getRingCustomizationById);

router.post('/', 
  authMiddleware,
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 1, max: 2000 })
      .withMessage('Description must be between 1 and 2000 characters'),
    body('ctaText')
      .notEmpty()
      .withMessage('CTA text is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('CTA text must be between 1 and 100 characters'),
    body('ctaLink')
      .optional()
      .isURL()
      .withMessage('CTA link must be a valid URL'),
    body('processImageUrl')
      .optional()
      .isURL()
      .withMessage('Process image URL must be a valid URL'),
    body('example1Title')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Example 1 title must be less than 100 characters'),
    body('example1Desc')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Example 1 description must be less than 200 characters'),
    body('example1ImageUrl')
      .optional()
      .isURL()
      .withMessage('Example 1 image URL must be a valid URL'),
    body('example2Title')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Example 2 title must be less than 100 characters'),
    body('example2Desc')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Example 2 description must be less than 200 characters'),
    body('example2ImageUrl')
      .optional()
      .isURL()
      .withMessage('Example 2 image URL must be a valid URL'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  createRingCustomization
);

router.put('/:id',
  authMiddleware,
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 1, max: 2000 })
      .withMessage('Description must be between 1 and 2000 characters'),
    body('ctaText')
      .notEmpty()
      .withMessage('CTA text is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('CTA text must be between 1 and 100 characters'),
    body('ctaLink')
      .optional()
      .isURL()
      .withMessage('CTA link must be a valid URL'),
    body('processImageUrl')
      .optional()
      .isURL()
      .withMessage('Process image URL must be a valid URL'),
    body('example1Title')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Example 1 title must be less than 100 characters'),
    body('example1Desc')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Example 1 description must be less than 200 characters'),
    body('example1ImageUrl')
      .optional()
      .isURL()
      .withMessage('Example 1 image URL must be a valid URL'),
    body('example2Title')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Example 2 title must be less than 100 characters'),
    body('example2Desc')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Example 2 description must be less than 200 characters'),
    body('example2ImageUrl')
      .optional()
      .isURL()
      .withMessage('Example 2 image URL must be a valid URL'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  updateRingCustomization
);

router.delete('/:id', authMiddleware, deleteRingCustomization);
router.patch('/:id/toggle', authMiddleware, toggleRingCustomizationStatus);

export default router;

















