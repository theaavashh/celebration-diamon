import express from 'express';
import { body } from 'express-validator';
import {
  getAllMidBanners,
  getAdminMidBanners,
  getMidBannerById,
  createMidBanner,
  updateMidBanner,
  deleteMidBanner,
  toggleMidBannerStatus
} from '../controllers/midBannerController';
import { authMiddleware } from '../middleware/authMiddleware';
import upload from '../middleware/upload';

const router = express.Router();

// Validation rules
const midBannerValidation = [
  // Title removed from client; server uses fixed title
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Banner text is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Banner text must be between 1 and 200 characters'),
  
  body('linkText')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Link text must be less than 50 characters'),
  
  body('linkUrl')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === undefined) return true;
      if (typeof val !== 'string') return false;
      const trimmed = val.trim();
      if (trimmed === '') return true;
      const isInternalPath = /^\/[A-Za-z0-9_\-\/.?&#=%]*$/i.test(trimmed);
      return isInternalPath;
    })
    .withMessage('Link URL must be an internal path starting with /'),
  
  body('backgroundColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Background color must be a valid hex color'),
  
  body('textColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Text color must be a valid hex color'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('priority')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Priority must be a non-negative integer'),
  
  body('startDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  body('leftImage')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === undefined) return true;
      if (typeof val !== 'string') return false;
      const trimmed = val.trim();
      if (trimmed === '') return true;
      const isAbsoluteUrl = /^https?:\/\//i.test(trimmed);
      const isUploadsPath = /^\/uploads\//i.test(trimmed);
      return isAbsoluteUrl || isUploadsPath;
    })
    .withMessage('Left image must be an absolute URL or /uploads path'),
  
  body('rightImage')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === undefined) return true;
      if (typeof val !== 'string') return false;
      const trimmed = val.trim();
      if (trimmed === '') return true;
      const isAbsoluteUrl = /^https?:\/\//i.test(trimmed);
      const isUploadsPath = /^\/uploads\//i.test(trimmed);
      return isAbsoluteUrl || isUploadsPath;
    })
    .withMessage('Right image must be an absolute URL or /uploads path'),
  
  body('leftImageHeight')
    .optional()
    .isInt({ min: 50, max: 1000 })
    .withMessage('Left image height must be between 50 and 1000 pixels'),
  
  body('rightImageHeight')
    .optional()
    .isInt({ min: 50, max: 1000 })
    .withMessage('Right image height must be between 50 and 1000 pixels')
];

// Public routes
router.get('/', getAllMidBanners);
router.get('/:id', getMidBannerById);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAdminMidBanners);
router.post('/', authMiddleware, midBannerValidation, createMidBanner);
router.put('/:id', authMiddleware, midBannerValidation, updateMidBanner);
router.delete('/:id', authMiddleware, deleteMidBanner);
router.patch('/:id/toggle', authMiddleware, toggleMidBannerStatus);

// Image upload route for mid-banners
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }
    const imageUrl = `/uploads/mid-banners/${req.file.filename}`;
    return res.status(200).json({ success: true, data: { imageUrl } });
  } catch (error) {
    console.error('Mid banner image upload error:', error);
    return res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
});

export default router;
