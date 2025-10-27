import { z } from 'zod';

// Testimonial Validation Schema
export const TestimonialSchema = z.object({
  clientName: z.string()
    .min(1, 'Client name is required')
    .max(100, 'Client name must be less than 100 characters')
    .trim(),
  clientTitle: z.string()
    .max(100, 'Client title must be less than 100 characters')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  content: z.string()
    .min(1, 'Testimonial content is required')
    .max(1000, 'Testimonial content must be less than 1000 characters')
    .trim(),
  rating: z.number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional()
    .nullable(),
  imageUrl: z.string()
    .min(1, 'Image URL is required')
    .refine((url) => {
      // Allow blob URLs for file uploads or regular URLs
      return url.startsWith('blob:') || /^https?:\/\/.+/.test(url) || url.startsWith('/');
    }, 'Image URL must be a valid URL or file path')
    .optional()
    .nullable()
    .transform(val => val?.trim() || null),
  sortOrder: z.number()
    .int('Sort order must be an integer')
    .min(0, 'Sort order must be non-negative')
    .optional()
    .default(0),
  isActive: z.boolean().optional().default(true)
});

// Create Testimonial Request Schema
export const CreateTestimonialRequestSchema = TestimonialSchema;

// Update Testimonial Request Schema
export const UpdateTestimonialRequestSchema = TestimonialSchema.partial();

// Testimonial ID Parameter Schema
export const TestimonialIdSchema = z.object({
  id: z.string().min(1, 'Testimonial ID is required')
});

// Query Parameters Schema
export const TestimonialQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'sortOrder', 'clientName', 'rating']).optional().default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  isActive: z.coerce.boolean().optional(),
  search: z.string().trim().optional()
});

// Response Schemas
export const TestimonialResponseSchema = z.object({
  id: z.string(),
  clientName: z.string(),
  clientTitle: z.string().nullable(),
  company: z.string().nullable(),
  content: z.string(),
  rating: z.number().int().nullable(),
  imageUrl: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const TestimonialListResponseSchema = z.object({
  testimonials: z.array(TestimonialResponseSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int()
  }).optional()
});

// Type exports
export type CreateTestimonialRequest = z.infer<typeof CreateTestimonialRequestSchema>;
export type UpdateTestimonialRequest = z.infer<typeof UpdateTestimonialRequestSchema>;
export type TestimonialQuery = z.infer<typeof TestimonialQuerySchema>;
export type TestimonialResponse = z.infer<typeof TestimonialResponseSchema>;
export type TestimonialListResponse = z.infer<typeof TestimonialListResponseSchema>;
