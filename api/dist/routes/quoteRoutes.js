"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const quoteController_1 = require("../controllers/quoteController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', quoteController_1.getAllQuotes);
router.get('/admin', authMiddleware_1.authMiddleware, quoteController_1.getAllQuotesAdmin);
router.get('/:id', authMiddleware_1.authMiddleware, quoteController_1.getQuoteById);
router.post('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('text')
        .notEmpty()
        .withMessage('Quote text is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Quote text must be between 1 and 1000 characters'),
    (0, express_validator_1.body)('author')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Author name must be less than 100 characters'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer')
], quoteController_1.createQuote);
router.put('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('text')
        .notEmpty()
        .withMessage('Quote text is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Quote text must be between 1 and 1000 characters'),
    (0, express_validator_1.body)('author')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Author name must be less than 100 characters'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer')
], quoteController_1.updateQuote);
router.delete('/:id', authMiddleware_1.authMiddleware, quoteController_1.deleteQuote);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, quoteController_1.toggleQuoteStatus);
exports.default = router;
//# sourceMappingURL=quoteRoutes.js.map