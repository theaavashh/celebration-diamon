"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const aboutUsController_1 = require("../controllers/aboutUsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const aboutUsValidation = [
    (0, express_validator_1.body)('heroTitle')
        .trim()
        .notEmpty()
        .withMessage('Hero title is required'),
    (0, express_validator_1.body)('storyTitle')
        .trim()
        .notEmpty()
        .withMessage('Story title is required'),
    (0, express_validator_1.body)('storyContent')
        .trim()
        .notEmpty()
        .withMessage('Story content is required'),
    (0, express_validator_1.body)('missionTitle')
        .trim()
        .notEmpty()
        .withMessage('Mission title is required'),
    (0, express_validator_1.body)('missionContent')
        .trim()
        .notEmpty()
        .withMessage('Mission content is required'),
    (0, express_validator_1.body)('visionTitle')
        .trim()
        .notEmpty()
        .withMessage('Vision title is required'),
    (0, express_validator_1.body)('visionContent')
        .trim()
        .notEmpty()
        .withMessage('Vision content is required'),
];
const teamMemberValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
    (0, express_validator_1.body)('role')
        .trim()
        .notEmpty()
        .withMessage('Role is required'),
    (0, express_validator_1.body)('bio')
        .trim()
        .notEmpty()
        .withMessage('Bio is required'),
];
router.get('/', aboutUsController_1.getAboutUs);
router.get('/admin', authMiddleware_1.authMiddleware, aboutUsController_1.getAdminAboutUs);
router.post('/admin', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, aboutUsValidation, aboutUsController_1.upsertAboutUs);
router.put('/admin', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, aboutUsValidation, aboutUsController_1.upsertAboutUs);
router.get('/admin/team', authMiddleware_1.authMiddleware, aboutUsController_1.getTeamMembers);
router.post('/admin/team', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, teamMemberValidation, aboutUsController_1.createTeamMember);
router.put('/admin/team/:id', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, teamMemberValidation, aboutUsController_1.updateTeamMember);
router.delete('/admin/team/:id', authMiddleware_1.authMiddleware, aboutUsController_1.deleteTeamMember);
router.patch('/admin/team/:id/toggle', authMiddleware_1.authMiddleware, aboutUsController_1.toggleTeamMemberStatus);
exports.default = router;
//# sourceMappingURL=aboutUsRoutes.js.map