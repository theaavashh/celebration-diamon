"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testimonialController_1 = require("../controllers/testimonialController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.get('/', testimonialController_1.getAllTestimonials);
router.get('/:id', testimonialController_1.getTestimonialById);
router.get('/admin/all', authMiddleware_1.authMiddleware, testimonialController_1.getAllTestimonialsAdmin);
router.post('/', authMiddleware_1.authMiddleware, testimonialController_1.createTestimonial);
router.put('/:id', authMiddleware_1.authMiddleware, testimonialController_1.updateTestimonial);
router.delete('/:id', authMiddleware_1.authMiddleware, testimonialController_1.deleteTestimonial);
router.patch('/:id/toggle-status', authMiddleware_1.authMiddleware, testimonialController_1.toggleTestimonialStatus);
router.post('/upload-image', authMiddleware_1.authMiddleware, upload_1.default.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }
        const imageUrl = `/uploads/testimonials/${req.file.filename}`;
        res.status(200).json({
            success: true,
            data: {
                imageUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimeType: req.file.mimetype
            },
            message: 'Image uploaded successfully'
        });
    }
    catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload image'
        });
    }
});
exports.default = router;
//# sourceMappingURL=testimonialRoutes.js.map