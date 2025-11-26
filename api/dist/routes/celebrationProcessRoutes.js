"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const celebrationProcessController_1 = require("../controllers/celebrationProcessController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', celebrationProcessController_1.getAllCelebrationProcesses);
router.get('/admin', authMiddleware_1.authMiddleware, celebrationProcessController_1.getAllCelebrationProcessesAdmin);
router.get('/:id', authMiddleware_1.authMiddleware, celebrationProcessController_1.getCelebrationProcessById);
router.post('/', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer'),
    (0, express_validator_1.body)('steps')
        .optional()
        .isArray()
        .withMessage('Steps must be an array'),
    (0, express_validator_1.body)('steps.*.title')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Step title must be between 1 and 100 characters'),
    (0, express_validator_1.body)('steps.*.description')
        .optional()
        .isLength({ min: 1, max: 200 })
        .withMessage('Step description must be between 1 and 200 characters'),
    (0, express_validator_1.body)('steps.*.icon')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Step icon must be between 1 and 50 characters'),
    (0, express_validator_1.body)('steps.*.order')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Step order must be a positive integer'),
    (0, express_validator_1.body)('steps.*.isActive')
        .optional()
        .isBoolean()
        .withMessage('Step isActive must be a boolean')
], celebrationProcessController_1.createCelebrationProcess);
router.put('/:id', authMiddleware_1.authMiddleware, [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sortOrder must be a non-negative integer'),
    (0, express_validator_1.body)('steps')
        .optional()
        .isArray()
        .withMessage('Steps must be an array'),
    (0, express_validator_1.body)('steps.*.title')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Step title must be between 1 and 100 characters'),
    (0, express_validator_1.body)('steps.*.description')
        .optional()
        .isLength({ min: 1, max: 200 })
        .withMessage('Step description must be between 1 and 200 characters'),
    (0, express_validator_1.body)('steps.*.icon')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Step icon must be between 1 and 50 characters'),
    (0, express_validator_1.body)('steps.*.order')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Step order must be a positive integer'),
    (0, express_validator_1.body)('steps.*.isActive')
        .optional()
        .isBoolean()
        .withMessage('Step isActive must be a boolean')
], celebrationProcessController_1.updateCelebrationProcess);
router.delete('/:id', authMiddleware_1.authMiddleware, celebrationProcessController_1.deleteCelebrationProcess);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, celebrationProcessController_1.toggleCelebrationProcessStatus);
exports.default = router;
//# sourceMappingURL=celebrationProcessRoutes.js.map