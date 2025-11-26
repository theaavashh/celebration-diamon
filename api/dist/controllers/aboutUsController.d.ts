import { Request, Response } from 'express';
import { ApiResponse } from '../types';
export declare const getAboutUs: (req: Request, res: Response<ApiResponse<any>>) => Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
export declare const getAdminAboutUs: (req: Request, res: Response<ApiResponse<any>>) => Promise<void>;
export declare const upsertAboutUs: (req: Request, res: Response<ApiResponse<any>>) => Promise<void>;
export declare const getTeamMembers: (req: Request, res: Response<ApiResponse<any>>) => Promise<void>;
export declare const createTeamMember: (req: Request, res: Response<ApiResponse<any>>) => Promise<void>;
export declare const updateTeamMember: (req: Request, res: Response<ApiResponse<any>>) => Promise<void>;
export declare const deleteTeamMember: (req: Request, res: Response<ApiResponse<void>>) => Promise<void>;
export declare const toggleTeamMemberStatus: (req: Request, res: Response<ApiResponse<any>>) => Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
//# sourceMappingURL=aboutUsController.d.ts.map