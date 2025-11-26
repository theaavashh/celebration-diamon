"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const termsController_1 = require("../controllers/termsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const termsValidation = [
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 1 })
        .withMessage('Content cannot be empty'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean')
];
router.get('/', termsController_1.getActiveTerms);
router.get('/admin/all', authMiddleware_1.authMiddleware, termsController_1.getAllTerms);
router.get('/admin/:id', authMiddleware_1.authMiddleware, termsController_1.getTermsById);
router.post('/admin', authMiddleware_1.authMiddleware, ...termsValidation, termsController_1.createTerms);
router.put('/admin/:id', authMiddleware_1.authMiddleware, ...termsValidation, termsController_1.updateTerms);
router.delete('/admin/:id', authMiddleware_1.authMiddleware, termsController_1.deleteTerms);
exports.default = router;
//# sourceMappingURL=termsRoutes.js.map