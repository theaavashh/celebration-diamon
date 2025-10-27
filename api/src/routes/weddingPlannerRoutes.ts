import express from 'express';
import { body } from 'express-validator';
import {
  getAllWeddingPlanners,
  getAllWeddingPlannersAdmin,
  getWeddingPlannerById,
  createWeddingPlanner,
  updateWeddingPlanner,
  deleteWeddingPlanner,
  toggleWeddingPlannerStatus
} from '../controllers/weddingPlannerController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllWeddingPlanners);

// Admin routes (protected)
router.get('/admin', authMiddleware, getAllWeddingPlannersAdmin);
router.get('/:id', authMiddleware, getWeddingPlannerById);

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
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    body('badgeText')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Badge text must be less than 50 characters'),
    body('badgeSubtext')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Badge subtext must be less than 50 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  createWeddingPlanner
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
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    body('badgeText')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Badge text must be less than 50 characters'),
    body('badgeSubtext')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Badge subtext must be less than 50 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  updateWeddingPlanner
);

router.delete('/:id', authMiddleware, deleteWeddingPlanner);
router.patch('/:id/toggle', authMiddleware, toggleWeddingPlannerStatus);

export default router;

















