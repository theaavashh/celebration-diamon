import express from 'express';
import { body } from 'express-validator';
import {
  getAllSubcategories,
  getSubcategoriesByCategoryId,
  getAdminSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  toggleSubcategoryStatus
} from '../controllers/subcategoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Validation rules
const subcategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID is required'),
  
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
router.get('/', getAllSubcategories);
router.get('/category/:categoryId', getSubcategoriesByCategoryId);
router.get('/:id', getSubcategoryById);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAdminSubcategories);
router.post('/', authMiddleware, subcategoryValidation, createSubcategory);
router.put('/:id', authMiddleware, subcategoryValidation, updateSubcategory);
router.delete('/:id', authMiddleware, deleteSubcategory);
router.patch('/:id/toggle', authMiddleware, toggleSubcategoryStatus);

export default router;