"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const storeController_1 = require("../controllers/storeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
const storeValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Location must be between 1 and 500 characters'),
    (0, express_validator_1.body)('phone')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Phone must be less than 50 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Email must be a valid email address'),
    (0, express_validator_1.body)('hours')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Hours must be less than 200 characters'),
    (0, express_validator_1.body)('latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),
    (0, express_validator_1.body)('longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Description must be less than 2000 characters'),
    (0, express_validator_1.body)('mediaType')
        .optional()
        .isIn(['image', 'video'])
        .withMessage('Media type must be either "image" or "video"'),
    (0, express_validator_1.body)('videoUrl')
        .optional()
        .isURL()
        .withMessage('Video URL must be a valid URL'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Sort order must be a non-negative integer')
];
router.get('/', storeController_1.getAllStores);
router.get('/:id', storeController_1.getStoreById);
router.get('/admin/all', authMiddleware_1.authMiddleware, storeController_1.getAdminStores);
router.post('/', authMiddleware_1.authMiddleware, upload_1.default.single('image'), storeValidation, storeController_1.createStore);
router.put('/:id', authMiddleware_1.authMiddleware, upload_1.default.single('image'), storeValidation, storeController_1.updateStore);
router.delete('/:id', authMiddleware_1.authMiddleware, storeController_1.deleteStore);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, storeController_1.toggleStoreStatus);
exports.default = router;
//# sourceMappingURL=storeRoutes.js.map