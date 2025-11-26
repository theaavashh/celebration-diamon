"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const faqController_1 = require("../controllers/faqController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', faqController_1.getAllFAQs);
router.get('/admin', authMiddleware_1.authMiddleware, faqController_1.getAllFAQsAdmin);
router.get('/:id', authMiddleware_1.authMiddleware, faqController_1.getFAQById);
router.post('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('question')
        .notEmpty()
        .withMessage('Question is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Question must be between 1 and 500 characters'),
    (0, express_validator_1.body)('answer')
        .notEmpty()
        .withMessage('Answer is required')
        .isLength({ min: 1, max: 2000 })
        .withMessage('Answer must be between 1 and 2000 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Category must be less than 100 characters'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer')
], faqController_1.createFAQ);
router.put('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('question')
        .notEmpty()
        .withMessage('Question is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Question must be between 1 and 500 characters'),
    (0, express_validator_1.body)('answer')
        .notEmpty()
        .withMessage('Answer is required')
        .isLength({ min: 1, max: 2000 })
        .withMessage('Answer must be between 1 and 2000 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Category must be less than 100 characters'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer')
], faqController_1.updateFAQ);
router.delete('/:id', authMiddleware_1.authMiddleware, faqController_1.deleteFAQ);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, faqController_1.toggleFAQStatus);
router.patch('/:id/toggle-status', authMiddleware_1.authMiddleware, faqController_1.toggleFAQStatus);
exports.default = router;
//# sourceMappingURL=faqRoutes.js.map