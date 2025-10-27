import express from 'express';
import { body } from 'express-validator';
import {
  getAllCelebrationProcesses,
  getAllCelebrationProcessesAdmin,
  getCelebrationProcessById,
  createCelebrationProcess,
  updateCelebrationProcess,
  deleteCelebrationProcess,
  toggleCelebrationProcessStatus
} from '../controllers/celebrationProcessController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllCelebrationProcesses);

// Admin routes (protected)
router.get('/admin', authMiddleware, getAllCelebrationProcessesAdmin);
router.get('/:id', authMiddleware, getCelebrationProcessById);

router.post('/', 
  authMiddleware,
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer'),
    body('steps')
      .optional()
      .isArray()
      .withMessage('Steps must be an array'),
    body('steps.*.title')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Step title must be between 1 and 100 characters'),
    body('steps.*.description')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Step description must be between 1 and 200 characters'),
    body('steps.*.icon')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Step icon must be between 1 and 50 characters'),
    body('steps.*.order')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Step order must be a positive integer'),
    body('steps.*.isActive')
      .optional()
      .isBoolean()
      .withMessage('Step isActive must be a boolean')
  ],
  createCelebrationProcess
);

router.put('/:id',
  authMiddleware,
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('imageUrl')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer'),
    body('steps')
      .optional()
      .isArray()
      .withMessage('Steps must be an array'),
    body('steps.*.title')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Step title must be between 1 and 100 characters'),
    body('steps.*.description')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Step description must be between 1 and 200 characters'),
    body('steps.*.icon')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Step icon must be between 1 and 50 characters'),
    body('steps.*.order')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Step order must be a positive integer'),
    body('steps.*.isActive')
      .optional()
      .isBoolean()
      .withMessage('Step isActive must be a boolean')
  ],
  updateCelebrationProcess
);

router.delete('/:id', authMiddleware, deleteCelebrationProcess);
router.patch('/:id/toggle', authMiddleware, toggleCelebrationProcessStatus);

export default router;

















