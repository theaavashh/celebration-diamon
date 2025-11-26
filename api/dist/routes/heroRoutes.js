"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const heroController_1 = require("../controllers/heroController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const heroValidation = [
    (0, express_validator_1.body)('heading')
        .trim()
        .notEmpty()
        .withMessage('Heading is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Heading must be between 1 and 200 characters'),
    (0, express_validator_1.body)('subHeading')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Sub-heading must be less than 200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('ctaTitle')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('CTA title must be less than 50 characters'),
    (0, express_validator_1.body)('ctaLink')
        .optional()
        .matches(/^\/[a-zA-Z0-9\-\/]*$/)
        .withMessage('CTA link must be a valid internal path (e.g., /products, /about)'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean')
];
router.get('/', heroController_1.getAllHeroSections);
router.get('/admin/all', authMiddleware_1.authMiddleware, heroController_1.getAdminHeroSections);
router.get('/:id', heroController_1.getHeroSectionById);
router.post('/', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, heroValidation, heroController_1.createHeroSection);
router.put('/:id', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, heroValidation, heroController_1.updateHeroSection);
router.delete('/:id', authMiddleware_1.authMiddleware, heroController_1.deleteHeroSection);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, heroController_1.toggleHeroSectionStatus);
exports.default = router;
//# sourceMappingURL=heroRoutes.js.map