import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Determine destination based on the field name or route
    const fieldName = file.fieldname;
    let destination = 'uploads/';
    
    if (fieldName === 'image' && (req.path.includes('/hero') || req.originalUrl.includes('/hero'))) {
      destination = 'uploads/hero/';
    } else if (fieldName === 'image' && (req.path.includes('/categories') || req.originalUrl.includes('/categories'))) {
      destination = 'uploads/categories/';
    } else if (fieldName === 'image' && (req.path.includes('/products') || req.originalUrl.includes('/products'))) {
      destination = 'uploads/products/';
    } else if (fieldName === 'image' && (req.path.includes('/services') || req.originalUrl.includes('/services'))) {
      destination = 'uploads/services/';
    } else if (fieldName === 'image' && (req.path.includes('/testimonials') || req.originalUrl.includes('/testimonials'))) {
      destination = 'uploads/testimonials/';
    } else {
      destination = 'uploads/';
    }
    cb(null, destination);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export const uploadHeroImage = upload.single('image');

export default upload;