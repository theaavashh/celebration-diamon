"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = __importDefault(require("../middleware/upload"));
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const categorySchema_1 = require("../validation/categorySchema");
const router = express_1.default.Router();
router.get('/', categoryController_1.getAllCategories);
router.get('/:id', categoryController_1.getCategoryById);
router.get('/admin/all', authMiddleware_1.authMiddleware, categoryController_1.getAdminCategories);
router.post('/with-subcategories', authMiddleware_1.authMiddleware, upload_1.default.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'navImage1', maxCount: 1 },
    { name: 'navImage2', maxCount: 1 }
]), (0, validationMiddleware_1.validateRequest)(categorySchema_1.createCategoryWithSubcategoriesSchema), categoryController_1.createCategoryWithSubcategories);
router.route('/:id')
    .put(authMiddleware_1.authMiddleware, upload_1.default.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'navImage1', maxCount: 1 },
    { name: 'navImage2', maxCount: 1 }
]), (0, validationMiddleware_1.validateRequest)(categorySchema_1.updateCategorySchema), categoryController_1.updateCategory)
    .delete(authMiddleware_1.authMiddleware, categoryController_1.deleteCategory)
    .patch(authMiddleware_1.authMiddleware, categoryController_1.toggleCategoryStatus);
router.get('/:categoryId/subcategories', categoryController_1.getSubcategoriesByCategory);
router.get('/subcategories/:id', categoryController_1.getSubcategoryById);
router.post('/:categoryId/subcategories', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.validateRequest)(categorySchema_1.subcategorySchema), categoryController_1.createSubcategory);
router.route('/subcategories/:id')
    .put(authMiddleware_1.authMiddleware, (0, validationMiddleware_1.validateRequest)(categorySchema_1.subcategorySchema), categoryController_1.updateSubcategory)
    .delete(authMiddleware_1.authMiddleware, categoryController_1.deleteSubcategory)
    .patch(authMiddleware_1.authMiddleware, categoryController_1.toggleSubcategoryStatus);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map