"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const helpCenterController_1 = require("../controllers/helpCenterController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const helpCenterValidation = [
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
router.get('/', helpCenterController_1.getActiveHelpCenter);
router.get('/admin/all', authMiddleware_1.authMiddleware, helpCenterController_1.getAllHelpCenters);
router.get('/admin/:id', authMiddleware_1.authMiddleware, helpCenterController_1.getHelpCenterById);
router.post('/admin', authMiddleware_1.authMiddleware, ...helpCenterValidation, helpCenterController_1.createHelpCenter);
router.put('/admin/:id', authMiddleware_1.authMiddleware, ...helpCenterValidation, helpCenterController_1.updateHelpCenter);
router.delete('/admin/:id', authMiddleware_1.authMiddleware, helpCenterController_1.deleteHelpCenter);
exports.default = router;
//# sourceMappingURL=helpCenterRoutes.js.map