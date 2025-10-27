"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bannerController_1 = require("@/controllers/bannerController");
const authMiddleware_1 = require("@/middleware/authMiddleware");
const router = express_1.default.Router();
const bannerValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    (0, express_validator_1.body)('text')
        .trim()
        .notEmpty()
        .withMessage('Banner text is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Banner text must be between 1 and 200 characters'),
    (0, express_validator_1.body)('linkText')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Link text must be less than 50 characters'),
    (0, express_validator_1.body)('linkUrl')
        .optional()
        .isURL()
        .withMessage('Link URL must be a valid URL'),
    (0, express_validator_1.body)('backgroundColor')
        .optional()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Background color must be a valid hex color'),
    (0, express_validator_1.body)('textColor')
        .optional()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Text color must be a valid hex color'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Priority must be a non-negative integer'),
    (0, express_validator_1.body)('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
    (0, express_validator_1.body)('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO 8601 date')
];
router.get('/', bannerController_1.getAllBanners);
router.get('/:id', bannerController_1.getBannerById);
router.get('/admin/all', authMiddleware_1.authMiddleware, bannerController_1.getAdminBanners);
router.post('/', authMiddleware_1.authMiddleware, bannerValidation, bannerController_1.createBanner);
router.put('/:id', authMiddleware_1.authMiddleware, bannerValidation, bannerController_1.updateBanner);
router.delete('/:id', authMiddleware_1.authMiddleware, bannerController_1.deleteBanner);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, bannerController_1.toggleBannerStatus);
exports.default = router;
//# sourceMappingURL=bannerRoutes.js.map