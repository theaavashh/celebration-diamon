"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialListResponseSchema = exports.TestimonialResponseSchema = exports.TestimonialQuerySchema = exports.TestimonialIdSchema = exports.UpdateTestimonialRequestSchema = exports.CreateTestimonialRequestSchema = exports.TestimonialSchema = void 0;
const zod_1 = require("zod");
exports.TestimonialSchema = zod_1.z.object({
    clientName: zod_1.z.string()
        .min(1, 'Client name is required')
        .max(100, 'Client name must be less than 100 characters')
        .trim(),
    clientTitle: zod_1.z.string()
        .max(100, 'Client title must be less than 100 characters')
        .optional()
        .nullable()
        .transform(val => val?.trim() || null),
    company: zod_1.z.string()
        .max(100, 'Company name must be less than 100 characters')
        .optional()
        .nullable()
        .transform(val => val?.trim() || null),
    content: zod_1.z.string()
        .min(1, 'Testimonial content is required')
        .max(1000, 'Testimonial content must be less than 1000 characters')
        .trim(),
    rating: zod_1.z.number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5')
        .optional()
        .nullable(),
    imageUrl: zod_1.z.string()
        .min(1, 'Image URL is required')
        .refine((url) => {
        return url.startsWith('blob:') || /^https?:\/\/.+/.test(url) || url.startsWith('/');
    }, 'Image URL must be a valid URL or file path')
        .optional()
        .nullable()
        .transform(val => val?.trim() || null),
    sortOrder: zod_1.z.number()
        .int('Sort order must be an integer')
        .min(0, 'Sort order must be non-negative')
        .optional()
        .default(0),
    isActive: zod_1.z.boolean().optional().default(true)
});
exports.CreateTestimonialRequestSchema = exports.TestimonialSchema;
exports.UpdateTestimonialRequestSchema = exports.TestimonialSchema.partial();
exports.TestimonialIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'Testimonial ID is required')
});
exports.TestimonialQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(10),
    sortBy: zod_1.z.enum(['createdAt', 'updatedAt', 'sortOrder', 'clientName', 'rating']).optional().default('sortOrder'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('asc'),
    isActive: zod_1.z.coerce.boolean().optional(),
    search: zod_1.z.string().trim().optional()
});
exports.TestimonialResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    clientName: zod_1.z.string(),
    clientTitle: zod_1.z.string().nullable(),
    company: zod_1.z.string().nullable(),
    content: zod_1.z.string(),
    rating: zod_1.z.number().int().nullable(),
    imageUrl: zod_1.z.string().nullable(),
    isActive: zod_1.z.boolean(),
    sortOrder: zod_1.z.number().int(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.TestimonialListResponseSchema = zod_1.z.object({
    testimonials: zod_1.z.array(exports.TestimonialResponseSchema),
    pagination: zod_1.z.object({
        page: zod_1.z.number().int(),
        limit: zod_1.z.number().int(),
        total: zod_1.z.number().int(),
        totalPages: zod_1.z.number().int()
    }).optional()
});
//# sourceMappingURL=testimonialValidation.js.map