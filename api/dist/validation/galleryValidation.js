"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryListResponseSchema = exports.GalleryResponseSchema = exports.GalleryItemResponseSchema = exports.GalleryQuerySchema = exports.GalleryItemIdSchema = exports.GalleryIdSchema = exports.UpdateGalleryRequestSchema = exports.CreateGalleryRequestSchema = exports.GallerySchema = exports.GalleryItemSchema = void 0;
const zod_1 = require("zod");
exports.GalleryItemSchema = zod_1.z.object({
    imageUrl: zod_1.z.string()
        .min(1, 'Image URL is required')
        .refine((url) => {
        return url.startsWith('blob:') || /^https?:\/\/.+/.test(url) || url.startsWith('/');
    }, 'Image URL must be a valid URL or file path')
        .trim(),
    sortOrder: zod_1.z.number()
        .int('Sort order must be an integer')
        .min(0, 'Sort order must be non-negative'),
    isActive: zod_1.z.boolean().optional().default(true)
});
exports.GallerySchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters')
        .trim(),
    subtitle: zod_1.z.string()
        .min(1, 'Subtitle is required')
        .max(500, 'Subtitle must be less than 500 characters')
        .trim(),
    sortOrder: zod_1.z.number()
        .int('Sort order must be an integer')
        .min(0, 'Sort order must be non-negative')
        .optional()
        .default(0),
    isActive: zod_1.z.boolean().optional().default(true),
    galleryItems: zod_1.z.array(exports.GalleryItemSchema).optional().default([])
});
exports.CreateGalleryRequestSchema = exports.GallerySchema;
exports.UpdateGalleryRequestSchema = exports.GallerySchema.partial().extend({
    galleryItems: zod_1.z.array(exports.GalleryItemSchema).optional()
});
exports.GalleryIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'Gallery ID is required')
});
exports.GalleryItemIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'Gallery item ID is required')
});
exports.GalleryQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(10),
    sortBy: zod_1.z.enum(['createdAt', 'updatedAt', 'sortOrder', 'title']).optional().default('sortOrder'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('asc'),
    isActive: zod_1.z.coerce.boolean().optional(),
    search: zod_1.z.string().trim().optional()
});
exports.GalleryItemResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    galleryId: zod_1.z.string(),
    imageUrl: zod_1.z.string(),
    isActive: zod_1.z.boolean(),
    sortOrder: zod_1.z.number().int(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.GalleryResponseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    subtitle: zod_1.z.string(),
    isActive: zod_1.z.boolean(),
    sortOrder: zod_1.z.number().int(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    galleryItems: zod_1.z.array(exports.GalleryItemResponseSchema)
});
exports.GalleryListResponseSchema = zod_1.z.object({
    galleries: zod_1.z.array(exports.GalleryResponseSchema),
    pagination: zod_1.z.object({
        page: zod_1.z.number().int(),
        limit: zod_1.z.number().int(),
        total: zod_1.z.number().int(),
        totalPages: zod_1.z.number().int()
    }).optional()
});
//# sourceMappingURL=galleryValidation.js.map