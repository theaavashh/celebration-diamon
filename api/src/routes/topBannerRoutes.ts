import express from 'express';
import {
  getActiveTopBanners,
  getAllTopBanners,
  createTopBanner,
  updateTopBanner,
  deleteTopBanner,
  toggleTopBannerStatus
} from '../controllers/topBannerController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/active', getActiveTopBanners);

// Admin routes (protected)
router.get('/admin/all', authMiddleware, getAllTopBanners);
router.post('/admin/create', authMiddleware, createTopBanner);
router.put('/admin/:id', authMiddleware, updateTopBanner);
router.delete('/admin/:id', authMiddleware, deleteTopBanner);
router.patch('/admin/:id/toggle', authMiddleware, toggleTopBannerStatus);

export default router;
