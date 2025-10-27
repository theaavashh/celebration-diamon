import { z } from 'zod';

// Gallery Item Validation Schema
export const GalleryItemSchema = z.object({
  title: z.string()
    .max(100, 'Title must be less than 100 characters')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  imageUrl: z.string()
    .min(1, 'Image URL is required')
    .refine((url) => {
      // Allow blob URLs for file uploads or regular URLs
      return url.startsWith('blob:') || /^https?:\/\/.+/.test(url) || url.startsWith('/');
    }, 'Image URL must be a valid URL or file path')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  sortOrder: z.number()
    .int('Sort order must be an integer')
    .min(0, 'Sort order must be non-negative'),
  isActive: z.boolean().optional().default(true)
});

// Gallery Validation Schema
export const GallerySchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  subtitle: z.string()
    .min(1, 'Subtitle is required')
    .max(500, 'Subtitle must be less than 500 characters')
    .trim(),
  sortOrder: z.number()
    .int('Sort order must be an integer')
    .min(0, 'Sort order must be non-negative')
    .optional()
    .default(0),
  isActive: z.boolean().optional().default(true),
  galleryItems: z.array(GalleryItemSchema).optional().default([])
});

// Create Gallery Request Schema
export const CreateGalleryRequestSchema = GallerySchema;

// Update Gallery Request Schema
export const UpdateGalleryRequestSchema = GallerySchema.partial().extend({
  galleryItems: z.array(GalleryItemSchema).optional()
});

// Gallery ID Parameter Schema
export const GalleryIdSchema = z.object({
  id: z.string().min(1, 'Gallery ID is required')
});

// Gallery Item ID Parameter Schema
export const GalleryItemIdSchema = z.object({
  id: z.string().min(1, 'Gallery item ID is required')
});

// Query Parameters Schema
export const GalleryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'sortOrder', 'title']).optional().default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  isActive: z.coerce.boolean().optional(),
  search: z.string().trim().optional()
});

// Response Schemas
export const GalleryItemResponseSchema = z.object({
  id: z.string(),
  galleryId: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const GalleryResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  galleryItems: z.array(GalleryItemResponseSchema)
});

export const GalleryListResponseSchema = z.object({
  galleries: z.array(GalleryResponseSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int()
  }).optional()
});

// Type exports
export type CreateGalleryRequest = z.infer<typeof CreateGalleryRequestSchema>;
export type UpdateGalleryRequest = z.infer<typeof UpdateGalleryRequestSchema>;
export type GalleryQuery = z.infer<typeof GalleryQuerySchema>;
export type GalleryResponse = z.infer<typeof GalleryResponseSchema>;
export type GalleryItemResponse = z.infer<typeof GalleryItemResponseSchema>;
export type GalleryListResponse = z.infer<typeof GalleryListResponseSchema>;