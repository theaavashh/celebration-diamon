"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const diamondCertificationController_1 = require("../controllers/diamondCertificationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', diamondCertificationController_1.getAllDiamondCertifications);
router.get('/admin', authMiddleware_1.authMiddleware, diamondCertificationController_1.getAllDiamondCertificationsAdmin);
router.get('/:id', authMiddleware_1.authMiddleware, diamondCertificationController_1.getDiamondCertificationById);
router.post('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 1, max: 2000 })
        .withMessage('Description must be between 1 and 2000 characters'),
    (0, express_validator_1.body)('ctaText')
        .notEmpty()
        .withMessage('CTA text is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('CTA text must be between 1 and 100 characters'),
    (0, express_validator_1.body)('ctaLink')
        .optional()
        .isURL()
        .withMessage('CTA link must be a valid URL'),
    (0, express_validator_1.body)('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer')
], diamondCertificationController_1.createDiamondCertification);
router.put('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 1, max: 2000 })
        .withMessage('Description must be between 1 and 2000 characters'),
    (0, express_validator_1.body)('ctaText')
        .notEmpty()
        .withMessage('CTA text is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('CTA text must be between 1 and 100 characters'),
    (0, express_validator_1.body)('ctaLink')
        .optional()
        .isURL()
        .withMessage('CTA link must be a valid URL'),
    (0, express_validator_1.body)('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer')
], diamondCertificationController_1.updateDiamondCertification);
router.delete('/:id', authMiddleware_1.authMiddleware, diamondCertificationController_1.deleteDiamondCertification);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, diamondCertificationController_1.toggleDiamondCertificationStatus);
exports.default = router;
//# sourceMappingURL=diamondCertificationRoutes.js.map