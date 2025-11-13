"use strict";

import express from 'express';
import { getFaqSettings, updateFaqSettings } from '../controllers/faqSettingsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getFaqSettings);
router.get('/admin', authMiddleware, getFaqSettings);
router.put('/', authMiddleware, updateFaqSettings);
router.put('/admin', authMiddleware, updateFaqSettings);

export default router;






