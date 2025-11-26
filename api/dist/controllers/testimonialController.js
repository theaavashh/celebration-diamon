"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTestimonialStatus = exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonialById = exports.getAllTestimonialsAdmin = exports.getAllTestimonials = void 0;
const client_1 = require("@prisma/client");
const testimonialValidation_1 = require("../validation/testimonialValidation");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
class TestimonialNotFoundError extends Error {
    constructor(id) {
        super(`Testimonial with ID ${id} not found`);
        this.name = 'TestimonialNotFoundError';
    }
}
class TestimonialValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TestimonialValidationError';
    }
}
class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
    }
}
async function withTransaction(operation) {
    return await prisma.$transaction(async (tx) => {
        try {
            return await operation(tx);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseError(`Database operation failed: ${error.message}`);
            }
            throw error;
        }
    });
}
function validateRequest(schema, data) {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError && error.errors) {
            const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
            throw new TestimonialValidationError(`Validation failed: ${errorMessages.join(', ')}`);
        }
        throw error;
    }
}
function buildPaginationResponse(items, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        data: items,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}
const getAllTestimonials = async (req, res) => {
    try {
        const queryParams = validateRequest(testimonialValidation_1.TestimonialQuerySchema, req.query);
        const { page, limit, sortBy, sortOrder, isActive, search } = queryParams;
        const where = {
            isActive: isActive ?? true,
            ...(search && {
                OR: [
                    { clientName: { contains: search, mode: 'insensitive' } },
                    { clientTitle: { contains: search, mode: 'insensitive' } },
                    { company: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } }
                ]
            })
        };
        const orderBy = {
            [sortBy]: sortOrder
        };
        const skip = (page - 1) * limit;
        const [testimonials, total] = await Promise.all([
            prisma.testimonial.findMany({
                where,
                orderBy,
                skip,
                take: limit
            }),
            prisma.testimonial.count({ where })
        ]);
        const response = buildPaginationResponse(testimonials, total, page, limit);
        res.status(200).json({
            success: true,
            data: response.data,
            pagination: response.pagination,
            message: 'Testimonials retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all testimonials error:', error);
        if (error instanceof TestimonialValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getAllTestimonials = getAllTestimonials;
const getAllTestimonialsAdmin = async (req, res) => {
    try {
        const queryParams = validateRequest(testimonialValidation_1.TestimonialQuerySchema, req.query);
        const { page, limit, sortBy, sortOrder, isActive, search } = queryParams;
        const where = {
            ...(isActive !== undefined && { isActive }),
            ...(search && {
                OR: [
                    { clientName: { contains: search, mode: 'insensitive' } },
                    { clientTitle: { contains: search, mode: 'insensitive' } },
                    { company: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } }
                ]
            })
        };
        const orderBy = {
            [sortBy]: sortOrder
        };
        const skip = (page - 1) * limit;
        const [testimonials, total] = await Promise.all([
            prisma.testimonial.findMany({
                where,
                orderBy,
                skip,
                take: limit
            }),
            prisma.testimonial.count({ where })
        ]);
        const response = buildPaginationResponse(testimonials, total, page, limit);
        res.status(200).json({
            success: true,
            data: response.data,
            pagination: response.pagination,
            message: 'Testimonials retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all testimonials admin error:', error);
        if (error instanceof TestimonialValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getAllTestimonialsAdmin = getAllTestimonialsAdmin;
const getTestimonialById = async (req, res) => {
    try {
        const { id } = validateRequest(testimonialValidation_1.TestimonialIdSchema, req.params);
        const testimonial = await prisma.testimonial.findUnique({
            where: { id }
        });
        if (!testimonial) {
            throw new TestimonialNotFoundError(id);
        }
        res.status(200).json({
            success: true,
            data: testimonial,
            message: 'Testimonial retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get testimonial by ID error:', error);
        if (error instanceof TestimonialNotFoundError) {
            res.status(404).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof TestimonialValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getTestimonialById = getTestimonialById;
const createTestimonial = async (req, res) => {
    try {
        const testimonialData = validateRequest(testimonialValidation_1.CreateTestimonialRequestSchema, req.body);
        const testimonial = await withTransaction(async (tx) => {
            const newTestimonial = await tx.testimonial.create({
                data: {
                    clientName: testimonialData.clientName,
                    clientTitle: testimonialData.clientTitle,
                    company: testimonialData.company,
                    content: testimonialData.content,
                    rating: testimonialData.rating,
                    imageUrl: testimonialData.imageUrl,
                    isActive: testimonialData.isActive,
                    sortOrder: testimonialData.sortOrder
                }
            });
            return newTestimonial;
        });
        res.status(201).json({
            success: true,
            data: testimonial,
            message: 'Testimonial created successfully'
        });
    }
    catch (error) {
        console.error('Create testimonial error:', error);
        if (error instanceof TestimonialValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof DatabaseError) {
            res.status(500).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.createTestimonial = createTestimonial;
const updateTestimonial = async (req, res) => {
    try {
        const { id } = validateRequest(testimonialValidation_1.TestimonialIdSchema, req.params);
        const updateData = validateRequest(testimonialValidation_1.UpdateTestimonialRequestSchema, req.body);
        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id }
        });
        if (!existingTestimonial) {
            throw new TestimonialNotFoundError(id);
        }
        const testimonial = await withTransaction(async (tx) => {
            const updatedTestimonial = await tx.testimonial.update({
                where: { id },
                data: {
                    clientName: updateData.clientName,
                    clientTitle: updateData.clientTitle,
                    company: updateData.company,
                    content: updateData.content,
                    rating: updateData.rating,
                    imageUrl: updateData.imageUrl,
                    isActive: updateData.isActive,
                    sortOrder: updateData.sortOrder
                }
            });
            return updatedTestimonial;
        });
        res.status(200).json({
            success: true,
            data: testimonial,
            message: 'Testimonial updated successfully'
        });
    }
    catch (error) {
        console.error('Update testimonial error:', error);
        if (error instanceof TestimonialNotFoundError) {
            res.status(404).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof TestimonialValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof DatabaseError) {
            res.status(500).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.updateTestimonial = updateTestimonial;
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = validateRequest(testimonialValidation_1.TestimonialIdSchema, req.params);
        const existingTestimonial = await prisma.testimonial.findUnique({
            where: { id }
        });
        if (!existingTestimonial) {
            throw new TestimonialNotFoundError(id);
        }
        await withTransaction(async (tx) => {
            await tx.testimonial.delete({
                where: { id }
            });
        });
        res.status(200).json({
            success: true,
            message: 'Testimonial deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete testimonial error:', error);
        if (error instanceof TestimonialNotFoundError) {
            res.status(404).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof TestimonialValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof DatabaseError) {
            res.status(500).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.deleteTestimonial = deleteTestimonial;
const toggleTestimonialStatus = async (req, res) => {
    try {
        const { id } = validateRequest(testimonialValidation_1.TestimonialIdSchema, req.params);
        const testimonial = await withTransaction(async (tx) => {
            const currentTestimonial = await tx.testimonial.findUnique({
                where: { id }
            });
            if (!currentTestimonial) {
                throw new TestimonialNotFoundError(id);
            }
            const updatedTestimonial = await tx.testimonial.update({
                where: { id },
                data: {
                    isActive: !currentTestimonial.isActive
                }
            });
            return updatedTestimonial;
        });
        res.status(200).json({
            success: true,
            data: testimonial,
            message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`
        });
    }
    catch (error) {
        console.error('Toggle testimonial status error:', error);
        if (error instanceof TestimonialNotFoundError) {
            res.status(404).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof TestimonialValidationError) {
            res.status(400).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (error instanceof DatabaseError) {
            res.status(500).json({
                success: false,
                error: error.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.toggleTestimonialStatus = toggleTestimonialStatus;
//# sourceMappingURL=testimonialController.js.map