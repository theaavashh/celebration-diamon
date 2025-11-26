import { Request, Response } from 'express';
import { ApiResponse } from '../types';
export interface HelpCenter {
    id: string;
    title: string;
    content: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const getActiveHelpCenter: (req: Request, res: Response<ApiResponse<HelpCenter>>) => Promise<Response<ApiResponse<HelpCenter>, Record<string, any>> | undefined>;
export declare const getAllHelpCenters: (req: Request, res: Response<ApiResponse<HelpCenter[]>>) => Promise<void>;
export declare const getHelpCenterById: (req: Request, res: Response<ApiResponse<HelpCenter>>) => Promise<Response<ApiResponse<HelpCenter>, Record<string, any>> | undefined>;
export declare const createHelpCenter: (req: Request, res: Response<ApiResponse<HelpCenter>>) => Promise<void>;
export declare const updateHelpCenter: (req: Request, res: Response<ApiResponse<HelpCenter>>) => Promise<Response<ApiResponse<HelpCenter>, Record<string, any>> | undefined>;
export declare const deleteHelpCenter: (req: Request, res: Response<ApiResponse>) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=helpCenterController.d.ts.map