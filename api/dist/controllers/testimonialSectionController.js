"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTestimonialSectionStatus = exports.deleteTestimonialSection = exports.updateTestimonialSection = exports.createTestimonialSection = exports.getTestimonialSectionById = exports.getAllTestimonialSectionsAdmin = exports.getAllTestimonialSections = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllTestimonialSections = async (req, res) => {
    try {
        const sections = await prisma.testimonialSection.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });
        res.json({
            success: true,
            data: sections,
            message: 'Testimonial sections retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching testimonial sections:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch testimonial sections'
        });
    }
};
exports.getAllTestimonialSections = getAllTestimonialSections;
const getAllTestimonialSectionsAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const status = req.query.status || 'all';
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { subtitle: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status !== 'all') {
            where.isActive = status === 'active';
        }
        const [sections, total] = await Promise.all([
            prisma.testimonialSection.findMany({
                where,
                orderBy: { createdAt: 'asc' },
                skip,
                take: limit
            }),
            prisma.testimonialSection.count({ where })
        ]);
        const totalPages = Math.ceil(total / limit);
        res.json({
            success: true,
            data: sections,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: 'Testimonial sections retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching testimonial sections:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch testimonial sections'
        });
    }
};
exports.getAllTestimonialSectionsAdmin = getAllTestimonialSectionsAdmin;
const getTestimonialSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await prisma.testimonialSection.findUnique({
            where: { id }
        });
        if (!section) {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Testimonial section not found'
            });
        }
        res.json({
            success: true,
            data: section,
            message: 'Testimonial section retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error fetching testimonial section:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch testimonial section'
        });
    }
};
exports.getTestimonialSectionById = getTestimonialSectionById;
const createTestimonialSection = async (req, res) => {
    try {
        const { title, subtitle, isActive } = req.body;
        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                message: 'Title is required'
            });
        }
        const data = {
            title: title.trim(),
            subtitle: subtitle?.trim() || null,
            isActive: isActive !== undefined ? Boolean(isActive) : true
        };
        const section = await prisma.testimonialSection.create({
            data
        });
        res.status(201).json({
            success: true,
            data: section,
            message: 'Testimonial section created successfully'
        });
    }
    catch (error) {
        console.error('Error creating testimonial section:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to create testimonial section'
        });
    }
};
exports.createTestimonialSection = createTestimonialSection;
const updateTestimonialSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, isActive } = req.body;
        const data = {};
        if (title !== undefined) {
            if (!title || title.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation error',
                    message: 'Title cannot be empty'
                });
            }
            data.title = title.trim();
        }
        if (subtitle !== undefined) {
            data.subtitle = subtitle?.trim() || null;
        }
        if (isActive !== undefined) {
            data.isActive = Boolean(isActive);
        }
        const section = await prisma.testimonialSection.update({
            where: { id },
            data
        });
        res.json({
            success: true,
            data: section,
            message: 'Testimonial section updated successfully'
        });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Testimonial section not found'
            });
        }
        console.error('Error updating testimonial section:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to update testimonial section'
        });
    }
};
exports.updateTestimonialSection = updateTestimonialSection;
const deleteTestimonialSection = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await prisma.testimonialSection.findUnique({
            where: { id }
        });
        if (!section) {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Testimonial section not found'
            });
        }
        await prisma.testimonialSection.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Testimonial section deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting testimonial section:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to delete testimonial section'
        });
    }
};
exports.deleteTestimonialSection = deleteTestimonialSection;
const toggleTestimonialSectionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await prisma.testimonialSection.findUnique({
            where: { id }
        });
        if (!section) {
            return res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Testimonial section not found'
            });
        }
        const updatedSection = await prisma.testimonialSection.update({
            where: { id },
            data: { isActive: !section.isActive }
        });
        res.json({
            success: true,
            data: updatedSection,
            message: `Testimonial section ${updatedSection.isActive ? 'activated' : 'deactivated'} successfully`
        });
    }
    catch (error) {
        console.error('Error toggling testimonial section status:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to toggle testimonial section status'
        });
    }
};
exports.toggleTestimonialSectionStatus = toggleTestimonialSectionStatus;
//# sourceMappingURL=testimonialSectionController.js.map