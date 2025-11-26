"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const subcategoryController_1 = require("../controllers/subcategoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const subcategoryValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('categoryId')
        .notEmpty()
        .withMessage('Category ID is required'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Sort order must be a non-negative integer')
];
router.get('/', subcategoryController_1.getAllSubcategories);
router.get('/category/:categoryId', subcategoryController_1.getSubcategoriesByCategoryId);
router.get('/:id', subcategoryController_1.getSubcategoryById);
router.get('/admin/all', authMiddleware_1.authMiddleware, subcategoryController_1.getAdminSubcategories);
router.post('/', authMiddleware_1.authMiddleware, subcategoryValidation, subcategoryController_1.createSubcategory);
router.put('/:id', authMiddleware_1.authMiddleware, subcategoryValidation, subcategoryController_1.updateSubcategory);
router.delete('/:id', authMiddleware_1.authMiddleware, subcategoryController_1.deleteSubcategory);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, subcategoryController_1.toggleSubcategoryStatus);
exports.default = router;
//# sourceMappingURL=subcategoryRoutes.js.map