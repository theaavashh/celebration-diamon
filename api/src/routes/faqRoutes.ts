import express from 'express';
import { body } from 'express-validator';
import {
  getAllFAQs,
  getAllFAQsAdmin,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
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
    
  ],
  updateFAQ
);

router.delete('/:id', authMiddleware, deleteFAQ);
 

export default router;




















