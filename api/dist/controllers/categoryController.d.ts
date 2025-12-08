import { Request, Response } from 'express';
import { Category, Subcategory } from '@prisma/client';
import { CreateCategoryWithSubcategoriesInput, UpdateCategoryInput, SubcategoryInput } from '../validation/categorySchema';
interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
    error?: string;
}
interface CategoryWithSubcategories extends Category {
    subcategories: Subcategory[];
}
export declare const getAllCategories: (req: Request<{}, ApiResponse<Category[]>>, res: Response<ApiResponse<Category[]>>) => Promise<void>;
export declare const getAdminCategories: (req: Request<{}, ApiResponse<CategoryWithSubcategories[]>>, res: Response<ApiResponse<CategoryWithSubcategories[]>>) => Promise<void>;
export declare const getCategoryById: (req: Request<{
    id: string;
}, ApiResponse<Category>, {}>, res: Response<ApiResponse<Category>>) => Promise<Response<ApiResponse<{
    title: string;
    isActive: boolean;
    imageUrl: string | null;
    iconUrl: string | null;
    link: string | null;
    sortOrder: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    navImage1Url: string | null;
    navImage2Url: string | null;
}>, Record<string, any>> | undefined>;
export declare const createCategoryWithSubcategories: (req: Request<{}, ApiResponse<CategoryWithSubcategories>, CreateCategoryWithSubcategoriesInput>, res: Response<ApiResponse<CategoryWithSubcategories>>) => Promise<void>;
export declare const updateCategory: (req: Request<{
    id: string;
}, ApiResponse<Category>, UpdateCategoryInput>, res: Response<ApiResponse<Category>>) => Promise<void>;
export declare const deleteCategory: (req: Request<{
    id: string;
}, ApiResponse<{}>, {}>, res: Response<ApiResponse<{}>>) => Promise<void>;
export declare const toggleCategoryStatus: (req: Request<{
    id: string;
}, ApiResponse<Category>, {}>, res: Response<ApiResponse<Category>>) => Promise<Response<ApiResponse<{
    title: string;
    isActive: boolean;
    imageUrl: string | null;
    iconUrl: string | null;
    link: string | null;
    sortOrder: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    navImage1Url: string | null;
    navImage2Url: string | null;
}>, Record<string, any>> | undefined>;
export declare const getSubcategoriesByCategory: (req: Request<{
    categoryId: string;
}, ApiResponse<Subcategory[]>, {}>, res: Response<ApiResponse<Subcategory[]>>) => Promise<void>;
export declare const getSubcategoryById: (req: Request<{
    id: string;
}, ApiResponse<Subcategory>, {}>, res: Response<ApiResponse<Subcategory>>) => Promise<Response<ApiResponse<{
    isActive: boolean;
    sortOrder: number;
    name: string;
    categoryId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}>, Record<string, any>> | undefined>;
export declare const createSubcategory: (req: Request<{
    categoryId: string;
}, ApiResponse<Subcategory>, SubcategoryInput>, res: Response<ApiResponse<Subcategory>>) => Promise<void>;
export declare const updateSubcategory: (req: Request<{
    id: string;
}, ApiResponse<Subcategory>, SubcategoryInput>, res: Response<ApiResponse<Subcategory>>) => Promise<void>;
export declare const deleteSubcategory: (req: Request<{
    id: string;
}, ApiResponse<{}>, {}>, res: Response<ApiResponse<{}>>) => Promise<void>;
export declare const toggleSubcategoryStatus: (req: Request<{
    id: string;
}, ApiResponse<Subcategory>, {}>, res: Response<ApiResponse<Subcategory>>) => Promise<Response<ApiResponse<{
    isActive: boolean;
    sortOrder: number;
    name: string;
    categoryId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
}>, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=categoryController.d.ts.map