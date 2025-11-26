"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
const productValidation = [
    (0, express_validator_1.body)('productCode')
        .trim()
        .notEmpty()
        .withMessage('Product code is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Product code must be between 1 and 50 characters'),
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Product name must be between 1 and 200 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Description must be between 1 and 1000 characters'),
    (0, express_validator_1.body)('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Category must be between 1 and 100 characters'),
    (0, express_validator_1.body)('price')
        .optional()
        .isNumeric()
        .withMessage('Price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    (0, express_validator_1.body)('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('diamondQuantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Diamond quantity must be a non-negative integer'),
    (0, express_validator_1.body)('digitalBrowser')
        .optional()
        .isBoolean()
        .withMessage('Digital Browser must be a boolean'),
    (0, express_validator_1.body)('website')
        .optional()
        .isBoolean()
        .withMessage('Website must be a boolean'),
    (0, express_validator_1.body)('distributor')
        .optional()
        .isBoolean()
        .withMessage('Distributor must be a boolean')
];
router.get('/', productController_1.getAllProducts);
router.get('/categories', productController_1.getProductCategories);
router.get('/:id', productController_1.getProductById);
router.get('/admin/all', authMiddleware_1.authMiddleware, productController_1.getAdminProducts);
router.post('/', authMiddleware_1.authMiddleware, upload_1.uploadProductImages, productValidation, productController_1.createProduct);
router.put('/:id', authMiddleware_1.authMiddleware, upload_1.uploadProductImages, productValidation, productController_1.updateProduct);
router.delete('/:id', authMiddleware_1.authMiddleware, productController_1.deleteProduct);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, productController_1.toggleProductStatus);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map