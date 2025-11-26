import { Request, Response } from 'express';
import { ApiResponse, Hero, CreateHeroRequest, UpdateHeroRequest } from '../types';
export declare const getAllHeroSections: (req: Request, res: Response<ApiResponse<Hero[]>>) => Promise<void>;
export declare const getAdminHeroSections: (req: Request, res: Response<ApiResponse<Hero[]>>) => Promise<void>;
export declare const getHeroSectionById: (req: Request, res: Response<ApiResponse<Hero>>) => Promise<Response<ApiResponse<Hero>, Record<string, any>> | undefined>;
export declare const createHeroSection: (req: Request<{}, ApiResponse<Hero>, CreateHeroRequest>, res: Response<ApiResponse<Hero>>) => Promise<void>;
export declare const updateHeroSection: (req: Request<{
    id: string;
}, ApiResponse<Hero>, UpdateHeroRequest>, res: Response<ApiResponse<Hero>>) => Promise<void>;
export declare const deleteHeroSection: (req: Request, res: Response<ApiResponse<null>>) => Promise<void>;
export declare const toggleHeroSectionStatus: (req: Request, res: Response<ApiResponse<Hero>>) => Promise<Response<ApiResponse<Hero>, Record<string, any>> | undefined>;
//# sourceMappingURL=heroController.d.ts.map