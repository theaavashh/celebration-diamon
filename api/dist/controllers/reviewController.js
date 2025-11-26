"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleReviewStatus = exports.deleteReview = exports.updateReview = exports.createReview = exports.getAllReviews = exports.getProductReviews = void 0;
const database_1 = __importDefault(require("../config/database"));
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await database_1.default.review.findMany({
            where: {
                productId,
                isActive: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json({
            success: true,
            data: reviews,
            count: reviews.length,
        });
    }
    catch (error) {
        console.error('Error fetching product reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
        });
    }
};
exports.getProductReviews = getProductReviews;
const getAllReviews = async (req, res) => {
    try {
        const reviews = await database_1.default.review.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json({
            success: true,
            data: reviews,
            count: reviews.length,
        });
    }
    catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
        });
    }
};
exports.getAllReviews = getAllReviews;
const createReview = async (req, res) => {
    try {
        const { productId, customerName, rating, comment } = req.body;
        if (!productId || !customerName || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }
        const product = await database_1.default.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        const review = await database_1.default.review.create({
            data: {
                productId,
                customerName,
                rating,
                comment: comment || '',
            },
        });
        res.json({
            success: true,
            data: review,
            message: 'Review created successfully',
        });
    }
    catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating review',
        });
    }
};
exports.createReview = createReview;
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, rating, comment, isActive } = req.body;
        const review = await database_1.default.review.update({
            where: { id },
            data: {
                customerName,
                rating,
                comment: comment !== undefined ? comment : undefined,
                isActive,
            },
        });
        res.json({
            success: true,
            data: review,
            message: 'Review updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review',
        });
    }
};
exports.updateReview = updateReview;
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.review.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: 'Review deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
        });
    }
};
exports.deleteReview = deleteReview;
const toggleReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await database_1.default.review.findUnique({
            where: { id },
        });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }
        const updatedReview = await database_1.default.review.update({
            where: { id },
            data: {
                isActive: !review.isActive,
            },
        });
        res.json({
            success: true,
            data: updatedReview,
            message: 'Review status updated successfully',
        });
    }
    catch (error) {
        console.error('Error toggling review status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review status',
        });
    }
};
exports.toggleReviewStatus = toggleReviewStatus;
//# sourceMappingURL=reviewController.js.map