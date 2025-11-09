import express from 'express';
import { body } from 'express-validator';
import {
  getAllStores,
  getAdminStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  toggleStoreStatus
} from '../controllers/storeController';
import { authMiddleware } from '../middleware/authMiddleware';
import upload from '../middleware/upload';

const router = express.Router();

// Validation rules
const storeValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Location must be between 1 and 500 characters'),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone must be less than 50 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address'),
  
  body('hours')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Hours must be less than 200 characters'),
  
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  
  body('mediaType')
    .optional()
    .isIn(['image', 'video'])
    .withMessage('Media type must be either "image" or "video"'),
  
  body('videoUrl')
    .optional()
    .isURL()
    .withMessage('Video URL must be a valid URL'),
  
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
router.get('/', getAllStores);
router.get('/:id', getStoreById);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAdminStores);
router.post('/', authMiddleware, upload.single('image'), storeValidation, createStore);
router.put('/:id', authMiddleware, upload.single('image'), storeValidation, updateStore);
router.delete('/:id', authMiddleware, deleteStore);
router.patch('/:id/toggle', authMiddleware, toggleStoreStatus);

export default router;





