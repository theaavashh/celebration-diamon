import { Request, Response } from 'express';
import { ApiResponse } from '../types';
export interface ReturnPolicy {
    id: string;
    title: string;
    content: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const getActiveReturnPolicy: (req: Request, res: Response<ApiResponse<ReturnPolicy>>) => Promise<Response<ApiResponse<ReturnPolicy>, Record<string, any>> | undefined>;
export declare const getAllReturnPolicies: (req: Request, res: Response<ApiResponse<ReturnPolicy[]>>) => Promise<void>;
export declare const getReturnPolicyById: (req: Request, res: Response<ApiResponse<ReturnPolicy>>) => Promise<Response<ApiResponse<ReturnPolicy>, Record<string, any>> | undefined>;
export declare const createReturnPolicy: (req: Request, res: Response<ApiResponse<ReturnPolicy>>) => Promise<void>;
export declare const updateReturnPolicy: (req: Request, res: Response<ApiResponse<ReturnPolicy>>) => Promise<Response<ApiResponse<ReturnPolicy>, Record<string, any>> | undefined>;
export declare const deleteReturnPolicy: (req: Request, res: Response<ApiResponse>) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=returnPolicyController.d.ts.map