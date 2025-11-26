"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const cultureController_1 = require("../controllers/cultureController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', cultureController_1.getAllCultures);
router.get('/admin', authMiddleware_1.authMiddleware, cultureController_1.getAllCulturesAdmin);
router.get('/:id', authMiddleware_1.authMiddleware, cultureController_1.getCultureById);
router.post('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Culture name is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Culture name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('subtitle')
        .notEmpty()
        .withMessage('Subtitle is required')
        .isLength({ min: 1, max: 300 })
        .withMessage('Subtitle must be between 1 and 300 characters'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Description must be between 1 and 1000 characters'),
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
], cultureController_1.createCulture);
router.put('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Culture name is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Culture name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('subtitle')
        .notEmpty()
        .withMessage('Subtitle is required')
        .isLength({ min: 1, max: 300 })
        .withMessage('Subtitle must be between 1 and 300 characters'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Description must be between 1 and 1000 characters'),
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
], cultureController_1.updateCulture);
router.delete('/:id', authMiddleware_1.authMiddleware, cultureController_1.deleteCulture);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, cultureController_1.toggleCultureStatus);
exports.default = router;
//# sourceMappingURL=cultureRoutes.js.map