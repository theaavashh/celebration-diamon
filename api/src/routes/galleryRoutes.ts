import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getAllGalleries,
  getAllGalleriesAdmin,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
  toggleGalleryStatus
} from '../controllers/galleryController';
import { authMiddleware } from '../middleware/authMiddleware';
import { 
  CreateGalleryRequestSchema,
  UpdateGalleryRequestSchema,
  GalleryIdSchema,
  GalleryQuerySchema
} from '../validation/galleryValidation';
import { z } from 'zod';

const router = express.Router();

/**
 * Configure multer for gallery item image/video uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gallery');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
    const allowedVideoTypes = /mp4|webm|ogg|mov/;
    const extname = path.extname(file.originalname).toLowerCase();
    const isImage = allowedImageTypes.test(extname) && file.mimetype.startsWith('image/');
    const isVideo = allowedVideoTypes.test(extname) && file.mimetype.startsWith('video/');
    
    if (isImage || isVideo) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

/**
 * Validation middleware factory
 */
const validateRequest = (schema: z.ZodSchema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError && error.errors) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errorMessages,
          issues: error.errors
        });
      }
      next(error);
    }
  };
};

/**
 * Query validation middleware
 */
const validateQuery = (schema: z.ZodSchema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError && error.errors) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        
        return res.status(400).json({
          success: false,
          error: 'Query validation failed',
          details: errorMessages,
          issues: error.errors
        });
      }
      next(error);
    }
  };
};

/**
 * Parameter validation middleware
 */
const validateParams = (schema: z.ZodSchema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError && error.errors) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        
        return res.status(400).json({
          success: false,
          error: 'Parameter validation failed',
          details: errorMessages,
          issues: error.errors
        });
      }
      next(error);
    }
  };
};

/**
 * Public routes
 */

/**
 * @route   GET /api/galleries
 * @desc    Get all active galleries with pagination and filtering
 * @access  Public
 * @query   page, limit, sortBy, sortOrder, search
 */
router.get('/', 
  validateQuery(GalleryQuerySchema),
  getAllGalleries
);

/**
 * Admin routes (protected) - Must come before /:id route
 */

/**
 * @route   GET /api/galleries/admin
 * @desc    Get all galleries (admin) with advanced filtering
 * @access  Private (Admin)
 * @query   page, limit, sortBy, sortOrder, isActive, search
 */
router.get('/admin', 
  authMiddleware,
  validateQuery(GalleryQuerySchema),
  getAllGalleriesAdmin
);

/**
 * @route   GET /api/galleries/:id
 * @desc    Get gallery by ID
 * @access  Public
 * @params  id - Gallery ID
 */
router.get('/:id', 
  validateParams(GalleryIdSchema),
  getGalleryById
);

/**
 * @route   POST /api/galleries
 * @desc    Create new gallery
 * @access  Private (Admin)
 * @body    CreateGalleryRequestSchema
 */
router.post('/', 
  authMiddleware,
  validateRequest(CreateGalleryRequestSchema),
  createGallery
);

/**
 * @route   PUT /api/galleries/:id
 * @desc    Update gallery
 * @access  Private (Admin)
 * @params  id - Gallery ID
 * @body    UpdateGalleryRequestSchema
 */
router.put('/:id',
  authMiddleware,
  validateParams(GalleryIdSchema),
  validateRequest(UpdateGalleryRequestSchema),
  updateGallery
);

/**
 * @route   DELETE /api/galleries/:id
 * @desc    Delete gallery
 * @access  Private (Admin)
 * @params  id - Gallery ID
 */
router.delete('/:id', 
  authMiddleware,
  validateParams(GalleryIdSchema),
  deleteGallery
);

/**
 * @route   PATCH /api/galleries/:id/toggle
 * @desc    Toggle gallery active status
 * @access  Private (Admin)
 * @params  id - Gallery ID
 */
router.patch('/:id/toggle', 
  authMiddleware,
  validateParams(GalleryIdSchema),
  toggleGalleryStatus
);

/**
 * @route   POST /api/galleries/upload-image
 * @desc    Upload gallery item image or video
 * @access  Private (Admin)
 * @body    image/video file
 */
router.post('/upload-image', 
  authMiddleware,
  upload.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file provided'
        });
      }

      const fileUrl = `/uploads/gallery/${req.file.filename}`;
      const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
      
      res.status(200).json({
        success: true,
        data: {
          imageUrl: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
          fileType: fileType
        },
        message: 'File uploaded successfully'
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload file'
      });
    }
  }
);

export default router;