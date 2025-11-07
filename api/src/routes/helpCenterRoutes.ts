import express from 'express';
import { body } from 'express-validator';
import {
  getActiveHelpCenter,
  getAllHelpCenters,
  getHelpCenterById,
  createHelpCenter,
  updateHelpCenter,
  deleteHelpCenter
} from '../controllers/helpCenterController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Validation rules
const helpCenterValidation = [
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
router.get('/', getActiveHelpCenter);

// Admin routes
router.get('/admin/all', authMiddleware, getAllHelpCenters);
router.get('/admin/:id', authMiddleware, getHelpCenterById);
router.post('/admin', authMiddleware, ...helpCenterValidation, createHelpCenter);
router.put('/admin/:id', authMiddleware, ...helpCenterValidation, updateHelpCenter);
router.delete('/admin/:id', authMiddleware, deleteHelpCenter);

export default router;
