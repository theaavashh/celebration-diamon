import express from 'express';
import { body } from 'express-validator';
import {
  getAllQuotes,
  getAllQuotesAdmin,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  toggleQuoteStatus
} from '../controllers/quoteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllQuotes);

// Admin routes (protected)
router.get('/admin', authMiddleware, getAllQuotesAdmin);
router.get('/:id', authMiddleware, getQuoteById);

router.post('/', 
  authMiddleware,
  [
    body('text')
      .notEmpty()
      .withMessage('Quote text is required')
      .isLength({ min: 1, max: 1000 })
      .withMessage('Quote text must be between 1 and 1000 characters'),
    body('author')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Author name must be less than 100 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  createQuote
);

router.put('/:id',
  authMiddleware,
  [
    body('text')
      .notEmpty()
      .withMessage('Quote text is required')
      .isLength({ min: 1, max: 1000 })
      .withMessage('Quote text must be between 1 and 1000 characters'),
    body('author')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Author name must be less than 100 characters'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer')
  ],
  updateQuote
);

router.delete('/:id', authMiddleware, deleteQuote);
router.patch('/:id/toggle', authMiddleware, toggleQuoteStatus);

export default router;
