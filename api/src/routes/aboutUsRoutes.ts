import express from 'express';
import { body } from 'express-validator';
import {
  getAboutUs,
  getAdminAboutUs,
  upsertAboutUs,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus
} from '../controllers/aboutUsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadHeroImage } from '../middleware/upload';

const router = express.Router();

// Validation rules for About Us
const aboutUsValidation = [
  body('heroTitle')
    .trim()
    .notEmpty()
    .withMessage('Hero title is required'),
  
  body('storyTitle')
    .trim()
    .notEmpty()
    .withMessage('Story title is required'),
  
  body('storyContent')
    .trim()
    .notEmpty()
    .withMessage('Story content is required'),
  
  body('missionTitle')
    .trim()
    .notEmpty()
    .withMessage('Mission title is required'),
  
  body('missionContent')
    .trim()
    .notEmpty()
    .withMessage('Mission content is required'),
  
  body('visionTitle')
    .trim()
    .notEmpty()
    .withMessage('Vision title is required'),
  
  body('visionContent')
    .trim()
    .notEmpty()
    .withMessage('Vision content is required'),
];

// Validation rules for Team Member
const teamMemberValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required'),
  
  body('bio')
    .trim()
    .notEmpty()
    .withMessage('Bio is required'),
];

// Public routes
router.get('/', getAboutUs);

// Admin routes (protected)
router.get('/admin', authMiddleware, getAdminAboutUs);
router.post('/admin', authMiddleware, uploadHeroImage, aboutUsValidation, upsertAboutUs);
router.put('/admin', authMiddleware, uploadHeroImage, aboutUsValidation, upsertAboutUs);

// Team member routes (admin)
router.get('/admin/team', authMiddleware, getTeamMembers);
router.post('/admin/team', authMiddleware, uploadHeroImage, teamMemberValidation, createTeamMember);
router.put('/admin/team/:id', authMiddleware, uploadHeroImage, teamMemberValidation, updateTeamMember);
router.delete('/admin/team/:id', authMiddleware, deleteTeamMember);
router.patch('/admin/team/:id/toggle', authMiddleware, toggleTeamMemberStatus);

export default router;

