import { Request, Response } from 'express';
import { ApiResponse } from '../types';
export interface Store {
    id: string;
    title: string;
    location: string;
    phone: string | null;
    email: string | null;
    hours: string | null;
    latitude: number | null;
    longitude: number | null;
    description: string | null;
    mediaType: string;
    imageUrl: string | null;
    videoUrl: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const getAllStores: (req: Request, res: Response<ApiResponse<Store[]>>) => Promise<void>;
export declare const getAdminStores: (req: Request, res: Response<ApiResponse<Store[]>>) => Promise<void>;
export declare const getStoreById: (req: Request, res: Response<ApiResponse<Store>>) => Promise<Response<ApiResponse<Store>, Record<string, any>> | undefined>;
export declare const createStore: (req: Request, res: Response<ApiResponse<Store>>) => Promise<void>;
export declare const updateStore: (req: Request, res: Response<ApiResponse<Store>>) => Promise<Response<ApiResponse<Store>, Record<string, any>> | undefined>;
export declare const deleteStore: (req: Request, res: Response<ApiResponse>) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleStoreStatus: (req: Request, res: Response<ApiResponse<Store>>) => Promise<Response<ApiResponse<Store>, Record<string, any>> | undefined>;
//# sourceMappingURL=storeController.d.ts.map