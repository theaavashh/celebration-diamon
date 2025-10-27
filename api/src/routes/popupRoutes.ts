import express from 'express';
import {
  getActivePopupImage,
  getAllPopupImages,
  uploadPopupImage,
  togglePopupImageStatus,
  deletePopupImage,
  upload
} from '../controllers/popupController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/active', getActivePopupImage);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAllPopupImages);
router.post('/upload', authMiddleware, upload.single('image'), uploadPopupImage);
router.patch('/:id/toggle', authMiddleware, togglePopupImageStatus);
router.delete('/:id', authMiddleware, deletePopupImage);

export default router;
