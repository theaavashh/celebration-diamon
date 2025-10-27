import express from 'express';
import { body } from 'express-validator';
import {
  getAllFAQs,
  getAllFAQsAdmin,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus
} from '../controllers/faqController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllFAQs);

// Admin routes (protected)
router.get('/admin', authMiddleware, getAllFAQsAdmin);
router.get('/:id', authMiddleware, getFAQById);

router.post('/', 
  authMiddleware,
  [
    body('question')
      .notEmpty()
      .withMessage('Question is required')
      .isLength({ min: 1, max: 500 })
      .withMessage('Question must be between 1 and 500 characters'),
    body('answer')
      .notEmpty()
      .withMessage('Answer is required')
      .isLength({ min: 1, max: 2000 })
      .withMessage('Answer must be between 1 and 2000 characters'),
    body('category')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Category must be less than 100 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  createFAQ
);

router.put('/:id',
  authMiddleware,
  [
    body('question')
      .notEmpty()
      .withMessage('Question is required')
      .isLength({ min: 1, max: 500 })
      .withMessage('Question must be between 1 and 500 characters'),
    body('answer')
      .notEmpty()
      .withMessage('Answer is required')
      .isLength({ min: 1, max: 2000 })
      .withMessage('Answer must be between 1 and 2000 characters'),
    body('category')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Category must be less than 100 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  updateFAQ
);

router.delete('/:id', authMiddleware, deleteFAQ);
router.patch('/:id/toggle', authMiddleware, toggleFAQStatus);

export default router;

















