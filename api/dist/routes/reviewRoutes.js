"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/product/:productId', reviewController_1.getProductReviews);
router.post('/', reviewController_1.createReview);
router.get('/all', authMiddleware_1.authMiddleware, reviewController_1.getAllReviews);
router.put('/:id', authMiddleware_1.authMiddleware, reviewController_1.updateReview);
router.delete('/:id', authMiddleware_1.authMiddleware, reviewController_1.deleteReview);
router.patch('/:id/toggle', authMiddleware_1.authMiddleware, reviewController_1.toggleReviewStatus);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map