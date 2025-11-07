import express from 'express';
import { body } from 'express-validator';
import {
  getActiveTerms,
  getAllTerms,
  getTermsById,
  createTerms,
  updateTerms,
  deleteTerms
} from '../controllers/termsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Validation rules
const termsValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Public routes
router.get('/', getActiveTerms);

// Admin routes
router.get('/admin/all', authMiddleware, getAllTerms);
router.get('/admin/:id', authMiddleware, getTermsById);
router.post('/admin', authMiddleware, ...termsValidation, createTerms);
router.put('/admin/:id', authMiddleware, ...termsValidation, updateTerms);
router.delete('/admin/:id', authMiddleware, deleteTerms);

export default router;

