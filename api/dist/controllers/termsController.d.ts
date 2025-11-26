import { Request, Response } from 'express';
import { ApiResponse } from '../types';
export interface Terms {
    id: string;
    title: string;
    content: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const getActiveTerms: (req: Request, res: Response<ApiResponse<Terms>>) => Promise<Response<ApiResponse<Terms>, Record<string, any>> | undefined>;
export declare const getAllTerms: (req: Request, res: Response<ApiResponse<Terms[]>>) => Promise<void>;
export declare const getTermsById: (req: Request, res: Response<ApiResponse<Terms>>) => Promise<Response<ApiResponse<Terms>, Record<string, any>> | undefined>;
export declare const createTerms: (req: Request, res: Response<ApiResponse<Terms>>) => Promise<void>;
export declare const updateTerms: (req: Request, res: Response<ApiResponse<Terms>>) => Promise<Response<ApiResponse<Terms>, Record<string, any>> | undefined>;
export declare const deleteTerms: (req: Request, res: Response<ApiResponse>) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=termsController.d.ts.map