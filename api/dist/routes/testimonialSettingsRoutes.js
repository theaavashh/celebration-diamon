"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/admin', async (_req, res) => {
    try {
        let section = await prisma.testimonialSection.findFirst({
            orderBy: { createdAt: 'asc' }
        });
        if (!section) {
            section = await prisma.testimonialSection.create({
                data: {
                    title: 'Testimonials',
                    subtitle: 'What our clients say about us',
                    isActive: true
                }
            });
        }
        res.json({
            success: true,
            data: section
        });
    }
    catch (error) {
        console.error('Error fetching testimonial settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching testimonial settings'
        });
    }
});
router.put('/admin', async (req, res) => {
    try {
        let section = await prisma.testimonialSection.findFirst({
            orderBy: { createdAt: 'asc' }
        });
        const { title, subtitle, isActive } = req.body;
        if (!section) {
            section = await prisma.testimonialSection.create({
                data: {
                    title: title || 'Testimonials',
                    subtitle: subtitle || null,
                    isActive: isActive !== undefined ? Boolean(isActive) : true
                }
            });
        }
        else {
            section = await prisma.testimonialSection.update({
                where: { id: section.id },
                data: {
                    title: title || section.title,
                    subtitle: subtitle !== undefined ? subtitle : section.subtitle,
                    isActive: isActive !== undefined ? Boolean(isActive) : section.isActive
                }
            });
        }
        res.json({
            success: true,
            data: section,
            message: 'Testimonial settings updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating testimonial settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating testimonial settings'
        });
    }
});
exports.default = router;
//# sourceMappingURL=testimonialSettingsRoutes.js.map