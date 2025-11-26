"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const testimonialSectionController_1 = require("../controllers/testimonialSectionController");
const router = (0, express_1.Router)();
router.get('/', testimonialSectionController_1.getAllTestimonialSections);
router.get('/:id', testimonialSectionController_1.getTestimonialSectionById);
router.get('/admin/all', authMiddleware_1.authMiddleware, testimonialSectionController_1.getAllTestimonialSectionsAdmin);
router.post('/', authMiddleware_1.authMiddleware, testimonialSectionController_1.createTestimonialSection);
router.put('/:id', authMiddleware_1.authMiddleware, testimonialSectionController_1.updateTestimonialSection);
router.delete('/:id', authMiddleware_1.authMiddleware, testimonialSectionController_1.deleteTestimonialSection);
router.patch('/:id/toggle-status', authMiddleware_1.authMiddleware, testimonialSectionController_1.toggleTestimonialSectionStatus);
exports.default = router;
//# sourceMappingURL=testimonialSectionRoutes.js.map