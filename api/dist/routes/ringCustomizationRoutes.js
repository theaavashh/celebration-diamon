"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const ringCustomizationController_1 = require("../controllers/ringCustomizationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', ringCustomizationController_1.getAllRingCustomizations);
router.get('/admin', authMiddleware_1.authMiddleware, ringCustomizationController_1.getAllRingCustomizationsAdmin);
router.get('/:id', authMiddleware_1.authMiddleware, ringCustomizationController_1.getRingCustomizationById);
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
    (0, express_validator_1.body)('processImageUrl')
        .optional()
        .isURL()
        .withMessage('Process image URL must be a valid URL'),
    (0, express_validator_1.body)('example1Title')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Example 1 title must be less than 100 characters'),
    (0, express_validator_1.body)('example1Desc')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Example 1 description must be less than 200 characters'),
    (0, express_validator_1.body)('example1ImageUrl')
        .optional()
        .isURL()
        .withMessage('Example 1 image URL must be a valid URL'),
    (0, express_validator_1.body)('example2Title')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Example 2 title must be less than 100 characters'),
    (0, express_validator_1.body)('example2Desc')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Example 2 description must be less than 200 characters'),
    (0, express_validator_1.body)('example2ImageUrl')
        .optional()
        .isURL()
        .withMessage('Example 2 image URL must be a valid URL'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer')
], ringCustomizationController_1.createRingCustomization);
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
    (0, express_validator_1.body)('processImageUrl')
        .optional()
        .isURL()
        .withMessage('Process image URL must be a valid URL'),
    (0, express_validator_1.body)('example1Title')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Example 1 title must be less than 100 characters'),
    (0, express_validator_1.body)('example1Desc')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Example 1 description must be less than 200 characters'),
    (0, express_validator_1.body)('example1ImageUrl')
        .optional()
        .isURL()
        .withMessage('Example 1 image URL must be a valid URL'),
    (0, express_validator_1.body)('example2Title')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Example 2 title must be less than 100 characters'),
    (0, express_validator_1.body)('example2Desc')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Example 2 description must be less than 200 characters'),
    (0, express_validator_1.body)('example2ImageUrl')
        .optional()
        .isURL()
        .withMessage('Example 2 image URL must be a valid URL'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer')
], ringCustomizationController_1.updateRingCustomization);
router.delete('/:id', authMiddleware_1.authMiddleware, ringCustomizationController_1.deleteRingCustomization);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, ringCustomizationController_1.toggleRingCustomizationStatus);
exports.default = router;
//# sourceMappingURL=ringCustomizationRoutes.js.map