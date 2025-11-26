import { Request, Response } from 'express';
import { ApiResponse, Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types';
export declare const getAllCategories: (req: Request, res: Response<ApiResponse<Category[]>>) => Promise<void>;
export declare const getAdminCategories: (req: Request, res: Response<ApiResponse<Category[]>>) => Promise<void>;
export declare const getCategoryById: (req: Request, res: Response<ApiResponse<Category>>) => Promise<Response<ApiResponse<Category>, Record<string, any>> | undefined>;
export declare const createCategory: (req: Request<{}, ApiResponse<Category>, CreateCategoryRequest>, res: Response<ApiResponse<Category>>) => Promise<void>;
export declare const updateCategory: (req: Request<{
    id: string;
}, ApiResponse<Category>, UpdateCategoryRequest>, res: Response<ApiResponse<Category>>) => Promise<void>;
export declare const deleteCategory: (req: Request, res: Response<ApiResponse<null>>) => Promise<void>;
export declare const toggleCategoryStatus: (req: Request, res: Response<ApiResponse<Category>>) => Promise<Response<ApiResponse<Category>, Record<string, any>> | undefined>;
//# sourceMappingURL=categoryController.d.ts.map