"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const serviceController_1 = require("../controllers/serviceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const serviceValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Description must be between 1 and 1000 characters'),
    (0, express_validator_1.body)('link')
        .optional()
        .matches(/^\/[a-zA-Z0-9\-\/]*$/)
        .withMessage('Link must be a valid internal path (e.g., /services, /about)'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Sort order must be a non-negative integer')
];
router.get('/', serviceController_1.getAllServices);
router.get('/:id', serviceController_1.getServiceById);
router.get('/admin/all', authMiddleware_1.authMiddleware, serviceController_1.getAdminServices);
router.post('/', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, serviceValidation, serviceController_1.createService);
router.put('/:id', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, serviceValidation, serviceController_1.updateService);
router.delete('/:id', authMiddleware_1.authMiddleware, serviceController_1.deleteService);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, serviceController_1.toggleServiceStatus);
exports.default = router;
//# sourceMappingURL=serviceRoutes.js.map