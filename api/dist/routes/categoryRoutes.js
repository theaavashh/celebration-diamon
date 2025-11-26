"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const categoryValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),
    (0, express_validator_1.body)('link')
        .optional()
        .matches(/^\/[a-zA-Z0-9\-\/]*$/)
        .withMessage('Link must be a valid internal path (e.g., /products, /about)'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Sort order must be a non-negative integer')
];
router.get('/', categoryController_1.getAllCategories);
router.get('/:id', categoryController_1.getCategoryById);
router.get('/admin/all', authMiddleware_1.authMiddleware, categoryController_1.getAdminCategories);
router.post('/', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, categoryValidation, categoryController_1.createCategory);
router.put('/:id', authMiddleware_1.authMiddleware, upload_1.uploadHeroImage, categoryValidation, categoryController_1.updateCategory);
router.delete('/:id', authMiddleware_1.authMiddleware, categoryController_1.deleteCategory);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, categoryController_1.toggleCategoryStatus);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map