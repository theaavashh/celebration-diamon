import { Request, Response } from 'express';
import { Product, ApiResponse } from '../types';
export declare const getAllProducts: (req: Request, res: Response<ApiResponse<Product[]>>) => Promise<void>;
export declare const getAdminProducts: (req: Request, res: Response<ApiResponse<Product[]>>) => Promise<void>;
export declare const getProductById: (req: Request, res: Response<ApiResponse<Product>>) => Promise<Response<ApiResponse<Product>, Record<string, any>> | undefined>;
export declare const createProduct: (req: Request, res: Response<ApiResponse<Product>>) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response<ApiResponse<Product>>) => Promise<Response<ApiResponse<Product>, Record<string, any>> | undefined>;
export declare const deleteProduct: (req: Request, res: Response<ApiResponse<null>>) => Promise<void>;
export declare const toggleProductStatus: (req: Request, res: Response<ApiResponse<Product>>) => Promise<Response<ApiResponse<Product>, Record<string, any>> | undefined>;
export declare const getProductCategories: (req: Request, res: Response<ApiResponse<any[]>>) => Promise<void>;
//# sourceMappingURL=productController.d.ts.map