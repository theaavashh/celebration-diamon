import express from 'express';
import { body } from 'express-validator';
import {
  getActivePrivacyPolicy,
  getAllPrivacyPolicies,
  getPrivacyPolicyById,
  createPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy
} from '../controllers/privacyPolicyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Validation rules
const privacyPolicyValidation = [
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
router.get('/', getActivePrivacyPolicy);

// Admin routes
router.get('/admin/all', authMiddleware, getAllPrivacyPolicies);
router.get('/admin/:id', authMiddleware, getPrivacyPolicyById);
router.post('/admin', authMiddleware, ...privacyPolicyValidation, createPrivacyPolicy);
router.put('/admin/:id', authMiddleware, ...privacyPolicyValidation, updatePrivacyPolicy);
router.delete('/admin/:id', authMiddleware, deletePrivacyPolicy);

export default router;
