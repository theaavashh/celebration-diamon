import express from 'express';
import { body } from 'express-validator';
import {
  getAllCultures,
  getAllCulturesAdmin,
  getCultureById,
  createCulture,
  updateCulture,
  deleteCulture,
  toggleCultureStatus
} from '../controllers/cultureController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllCultures);

// Admin routes (protected)
router.get('/admin', authMiddleware, getAllCulturesAdmin);
router.get('/:id', authMiddleware, getCultureById);

router.post('/', 
  authMiddleware,
  [
    body('name')
      .notEmpty()
      .withMessage('Culture name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Culture name must be between 1 and 100 characters'),
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('subtitle')
      .notEmpty()
      .withMessage('Subtitle is required')
      .isLength({ min: 1, max: 300 })
      .withMessage('Subtitle must be between 1 and 300 characters'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 1, max: 1000 })
      .withMessage('Description must be between 1 and 1000 characters'),
    body('ctaText')
      .notEmpty()
      .withMessage('CTA text is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('CTA text must be between 1 and 100 characters'),
    body('ctaLink')
      .optional()
      .isURL()
      .withMessage('CTA link must be a valid URL'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  createCulture
);

router.put('/:id',
  authMiddleware,
  [
    body('name')
      .notEmpty()
      .withMessage('Culture name is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Culture name must be between 1 and 100 characters'),
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('subtitle')
      .notEmpty()
      .withMessage('Subtitle is required')
      .isLength({ min: 1, max: 300 })
      .withMessage('Subtitle must be between 1 and 300 characters'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 1, max: 1000 })
      .withMessage('Description must be between 1 and 1000 characters'),
    body('ctaText')
      .notEmpty()
      .withMessage('CTA text is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('CTA text must be between 1 and 100 characters'),
    body('ctaLink')
      .optional()
      .isURL()
      .withMessage('CTA link must be a valid URL'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  updateCulture
);

router.delete('/:id', authMiddleware, deleteCulture);
router.patch('/:id/toggle', authMiddleware, toggleCultureStatus);

export default router;

















