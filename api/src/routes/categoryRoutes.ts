import express from 'express';
import { body } from 'express-validator';
import {
  getAllCategories,
  getAdminCategories,
  getAdminCategoriesWithSubcategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';
import upload from '../middleware/upload';

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('link')
    .optional()
    .matches(/^\/[a-zA-Z0-9\-\/]*$/)
    .withMessage('Link must be a valid internal path (e.g., /products, /about)'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer')
];

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAdminCategories);
router.get('/admin/with-subcategories', authMiddleware, getAdminCategoriesWithSubcategories);
router.post('/', authMiddleware, upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }]), categoryValidation, createCategory);
router.put('/:id', authMiddleware, upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }]), categoryValidation, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);
router.patch('/:id/toggle', authMiddleware, toggleCategoryStatus);

export default router;