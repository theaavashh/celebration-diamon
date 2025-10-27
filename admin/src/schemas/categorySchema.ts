import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must be less than 100 characters'),
  
  image: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      return val.startsWith('data:image/') || val.startsWith('http') || val.startsWith('https://res.cloudinary.com');
    }, 'Please provide a valid image URL, data URL, or Cloudinary URL'),
  
  internalLink: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      return val.startsWith('/') || val.startsWith('http') || val.startsWith('https');
    }, 'Internal link must start with /, http, or https'),
  
  status: z
    .enum(['active', 'inactive'], {
      required_error: 'Status is required',
    }),
  
  isSubCategory: z.boolean(),
  
  parentId: z
    .string()
    .optional(),
}).superRefine((data, ctx) => {
  // If isSubCategory is true, parentId is required
  if (data.isSubCategory && !data.parentId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Parent category is required for subcategories',
      path: ['parentId'],
    });
  }
  
  // Internal link is required only for main categories (not subcategories)
  if (!data.isSubCategory && (!data.internalLink || data.internalLink.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Internal link is required for main categories',
      path: ['internalLink'],
    });
  }
});

export type CategoryFormData = z.infer<typeof categorySchema>;
