import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { ApiResponse, PopupImage } from '../types';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/popup');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `popup-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export { upload };

// Get active popup image (public endpoint)
export const getActivePopupImage = async (req: Request, res: Response<ApiResponse<PopupImage>>) => {
  try {
    const popupImage = await prisma.popupImage.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!popupImage) {
      return res.status(404).json({
        success: false,
        message: 'No active popup image found'
      });
    }

    res.json({
      success: true,
      data: popupImage
    });
  } catch (error) {
    console.error('Error fetching active popup image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popup image',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Get all popup images for admin
export const getAllPopupImages = async (req: Request, res: Response<ApiResponse<PopupImage[]>>) => {
  try {
    const popupImages = await prisma.popupImage.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: popupImages,
      count: popupImages.length
    });
  } catch (error) {
    console.error('Error fetching popup images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popup images',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Upload new popup image
export const uploadPopupImage = async (req: Request, res: Response<ApiResponse<PopupImage>>) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Deactivate all existing popup images
    await prisma.popupImage.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Create new popup image record
    const popupImage = await prisma.popupImage.create({
      data: {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Popup image uploaded successfully',
      data: popupImage
    });
  } catch (error) {
    console.error('Error uploading popup image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload popup image',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Toggle popup image status
export const togglePopupImageStatus = async (req: Request<{ id: string }>, res: Response<ApiResponse<PopupImage>>) => {
  try {
    const { id } = req.params;

    const existingImage = await prisma.popupImage.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: 'Popup image not found'
      });
    }

    // If activating this image, deactivate all others first
    if (!existingImage.isActive) {
      await prisma.popupImage.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });
    }

    const updatedImage = await prisma.popupImage.update({
      where: { id },
      data: {
        isActive: !existingImage.isActive
      }
    });

    res.json({
      success: true,
      message: `Popup image ${updatedImage.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedImage
    });
  } catch (error) {
    console.error('Error toggling popup image status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle popup image status',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};

// Delete popup image
export const deletePopupImage = async (req: Request<{ id: string }>, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const existingImage = await prisma.popupImage.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: 'Popup image not found'
      });
    }

    // Delete the file from filesystem
    if (fs.existsSync(existingImage.filePath)) {
      fs.unlinkSync(existingImage.filePath);
    }

    // Delete from database
    await prisma.popupImage.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Popup image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting popup image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete popup image',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
    });
  }
};
