import { z } from 'zod';

// Helper function to convert empty strings to null
const emptyStringToNull = z.string().transform((val) => val === '' ? null : val).nullable();

// Schema for category creation/update
export const categorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be between 1 and 100 characters'),
  link: z.string().regex(/^\/[a-zA-Z0-9\-\/]*$/, 'Link must be a valid internal path (e.g., /products, /about)').optional().nullable(),
  iconUrl: emptyStringToNull.optional(),
  imageUrl: emptyStringToNull.optional(),
  navImage1Url: emptyStringToNull.optional(),
  navImage2Url: emptyStringToNull.optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().nonnegative().optional().default(0),
});

// Schema for subcategory
export const subcategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be between 1 and 100 characters'),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().nonnegative().optional().default(0),
});

// Schema for creating category with subcategories
export const createCategoryWithSubcategoriesSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be between 1 and 100 characters'),
  link: z.string().regex(/^\/[a-zA-Z0-9\-\/]*$/, 'Link must be a valid internal path (e.g., /products, /about)').optional().nullable(),
  iconUrl: emptyStringToNull.optional(),
  imageUrl: emptyStringToNull.optional(),
  navImage1Url: emptyStringToNull.optional(),
  navImage2Url: emptyStringToNull.optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().nonnegative().optional().default(0),
  subcategories: z.array(subcategorySchema).optional().default([]),
});

// Schema for updating category
export const updateCategorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be between 1 and 100 characters').optional(),
  link: z.string().regex(/^\/[a-zA-Z0-9\-\/]*$/, 'Link must be a valid internal path (e.g., /products, /about)').optional().nullable(),
  iconUrl: emptyStringToNull.optional(),
  imageUrl: emptyStringToNull.optional(),
  navImage1Url: emptyStringToNull.optional(),
  navImage2Url: emptyStringToNull.optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
}).partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type SubcategoryInput = z.infer<typeof subcategorySchema>;
export type CreateCategoryWithSubcategoriesInput = z.infer<typeof createCategoryWithSubcategoriesSchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;