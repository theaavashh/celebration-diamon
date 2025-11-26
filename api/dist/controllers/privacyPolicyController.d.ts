import { Request, Response } from 'express';
import { ApiResponse } from '../types';
export interface PrivacyPolicy {
    id: string;
    title: string;
    content: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const getActivePrivacyPolicy: (req: Request, res: Response<ApiResponse<PrivacyPolicy>>) => Promise<Response<ApiResponse<PrivacyPolicy>, Record<string, any>> | undefined>;
export declare const getAllPrivacyPolicies: (req: Request, res: Response<ApiResponse<PrivacyPolicy[]>>) => Promise<void>;
export declare const getPrivacyPolicyById: (req: Request, res: Response<ApiResponse<PrivacyPolicy>>) => Promise<Response<ApiResponse<PrivacyPolicy>, Record<string, any>> | undefined>;
export declare const createPrivacyPolicy: (req: Request, res: Response<ApiResponse<PrivacyPolicy>>) => Promise<void>;
export declare const updatePrivacyPolicy: (req: Request, res: Response<ApiResponse<PrivacyPolicy>>) => Promise<Response<ApiResponse<PrivacyPolicy>, Record<string, any>> | undefined>;
export declare const deletePrivacyPolicy: (req: Request, res: Response<ApiResponse>) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=privacyPolicyController.d.ts.map