import { Request, Response } from 'express';
import { ApiResponse, Service, CreateServiceRequest, UpdateServiceRequest } from '../types';
export declare const getAllServices: (req: Request, res: Response<ApiResponse<Service[]>>) => Promise<void>;
export declare const getAdminServices: (req: Request, res: Response<ApiResponse<Service[]>>) => Promise<void>;
export declare const getServiceById: (req: Request, res: Response<ApiResponse<Service>>) => Promise<Response<ApiResponse<Service>, Record<string, any>> | undefined>;
export declare const createService: (req: Request<{}, ApiResponse<Service>, CreateServiceRequest>, res: Response<ApiResponse<Service>>) => Promise<void>;
export declare const updateService: (req: Request<{
    id: string;
}, ApiResponse<Service>, UpdateServiceRequest>, res: Response<ApiResponse<Service>>) => Promise<void>;
export declare const deleteService: (req: Request, res: Response<ApiResponse<null>>) => Promise<void>;
export declare const toggleServiceStatus: (req: Request, res: Response<ApiResponse<Service>>) => Promise<Response<ApiResponse<Service>, Record<string, any>> | undefined>;
//# sourceMappingURL=serviceController.d.ts.map