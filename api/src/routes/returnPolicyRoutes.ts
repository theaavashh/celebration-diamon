import express from 'express';
import { body } from 'express-validator';
import {
  getActiveReturnPolicy,
  getAllReturnPolicies,
  getReturnPolicyById,
  createReturnPolicy,
  updateReturnPolicy,
  deleteReturnPolicy
} from '../controllers/returnPolicyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Validation rules
const returnPolicyValidation = [
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
router.get('/', getActiveReturnPolicy);

// Admin routes
router.get('/admin/all', authMiddleware, getAllReturnPolicies);
router.get('/admin/:id', authMiddleware, getReturnPolicyById);
router.post('/admin', authMiddleware, ...returnPolicyValidation, createReturnPolicy);
router.put('/admin/:id', authMiddleware, ...returnPolicyValidation, updateReturnPolicy);
router.delete('/admin/:id', authMiddleware, deleteReturnPolicy);

export default router;
