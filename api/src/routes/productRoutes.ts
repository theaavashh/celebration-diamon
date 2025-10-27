import express from 'express';
import { body } from 'express-validator';
import {
  getAllProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getProductCategories
} from '../controllers/productController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadHeroImage } from '../middleware/upload';

const router = express.Router();

// Validation rules
const productValidation = [
  body('productCode')
    .trim()
    .notEmpty()
    .withMessage('Product code is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Product code must be between 1 and 50 characters'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('diamondQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Diamond quantity must be a non-negative integer'),
  
  body('digitalBrowser')
    .optional()
    .isBoolean()
    .withMessage('Digital Browser must be a boolean'),
  
  body('website')
    .optional()
    .isBoolean()
    .withMessage('Website must be a boolean'),
  
  body('distributor')
    .optional()
    .isBoolean()
    .withMessage('Distributor must be a boolean')
];

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getProductCategories);
router.get('/:id', getProductById);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAdminProducts);
router.post('/', authMiddleware, uploadHeroImage, productValidation, createProduct);
router.put('/:id', authMiddleware, uploadHeroImage, productValidation, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.patch('/:id/toggle', authMiddleware, toggleProductStatus);

export default router;
