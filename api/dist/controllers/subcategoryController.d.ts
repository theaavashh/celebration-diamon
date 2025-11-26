import { Request, Response } from 'express';
import { ApiResponse, Subcategory, CreateSubcategoryRequest, UpdateSubcategoryRequest } from '../types';
export declare const getAllSubcategories: (req: Request, res: Response<ApiResponse<Subcategory[]>>) => Promise<void>;
export declare const getSubcategoriesByCategoryId: (req: Request, res: Response<ApiResponse<Subcategory[]>>) => Promise<void>;
export declare const getAdminSubcategories: (req: Request, res: Response<ApiResponse<Subcategory[]>>) => Promise<void>;
export declare const getSubcategoryById: (req: Request, res: Response<ApiResponse<Subcategory>>) => Promise<Response<ApiResponse<Subcategory>, Record<string, any>> | undefined>;
export declare const createSubcategory: (req: Request<{}, ApiResponse<Subcategory>, CreateSubcategoryRequest>, res: Response<ApiResponse<Subcategory>>) => Promise<Response<ApiResponse<Subcategory>, Record<string, any>> | undefined>;
export declare const updateSubcategory: (req: Request<{
    id: string;
}, ApiResponse<Subcategory>, UpdateSubcategoryRequest>, res: Response<ApiResponse<Subcategory>>) => Promise<Response<ApiResponse<Subcategory>, Record<string, any>> | undefined>;
export declare const deleteSubcategory: (req: Request, res: Response<ApiResponse<null>>) => Promise<void>;
export declare const toggleSubcategoryStatus: (req: Request, res: Response<ApiResponse<Subcategory>>) => Promise<Response<ApiResponse<Subcategory>, Record<string, any>> | undefined>;
//# sourceMappingURL=subcategoryController.d.ts.map