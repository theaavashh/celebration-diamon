import express from 'express';
import { body } from 'express-validator';
import {
  getAllServices,
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus
} from '../controllers/serviceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadHeroImage } from '../middleware/upload';

const router = express.Router();

// Validation rules
const serviceValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  
  body('link')
    .optional()
    .matches(/^\/[a-zA-Z0-9\-\/]*$/)
    .withMessage('Link must be a valid internal path (e.g., /services, /about)'),
  
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
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAdminServices);
router.post('/', authMiddleware, uploadHeroImage, serviceValidation, createService);
router.put('/:id', authMiddleware, uploadHeroImage, serviceValidation, updateService);
router.delete('/:id', authMiddleware, deleteService);
router.patch('/:id/toggle', authMiddleware, toggleServiceStatus);

export default router;


















