"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const privacyPolicyController_1 = require("../controllers/privacyPolicyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const privacyPolicyValidation = [
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
router.get('/', privacyPolicyController_1.getActivePrivacyPolicy);
router.get('/admin/all', authMiddleware_1.authMiddleware, privacyPolicyController_1.getAllPrivacyPolicies);
router.get('/admin/:id', authMiddleware_1.authMiddleware, privacyPolicyController_1.getPrivacyPolicyById);
router.post('/admin', authMiddleware_1.authMiddleware, ...privacyPolicyValidation, privacyPolicyController_1.createPrivacyPolicy);
router.put('/admin/:id', authMiddleware_1.authMiddleware, ...privacyPolicyValidation, privacyPolicyController_1.updatePrivacyPolicy);
router.delete('/admin/:id', authMiddleware_1.authMiddleware, privacyPolicyController_1.deletePrivacyPolicy);
exports.default = router;
//# sourceMappingURL=privacyPolicyRoutes.js.map