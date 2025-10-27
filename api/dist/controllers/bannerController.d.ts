import { Request, Response } from 'express';
import { ApiResponse, Banner, BannerQueryParams, CreateBannerRequest, UpdateBannerRequest } from '@/types';
export declare const getAllBanners: (req: Request<{}, ApiResponse<Banner[]>, {}, BannerQueryParams>, res: Response<ApiResponse<Banner[]>>) => Promise<void>;
export declare const getAdminBanners: (_req: Request, res: Response<ApiResponse<Banner[]>>) => Promise<void>;
export declare const getBannerById: (req: Request<{
    id: string;
}>, res: Response<ApiResponse<Banner>>) => Promise<Response<ApiResponse<Banner>, Record<string, any>> | undefined>;
export declare const createBanner: (req: Request<{}, ApiResponse<Banner>, CreateBannerRequest>, res: Response<ApiResponse<Banner>>) => Promise<Response<ApiResponse<Banner>, Record<string, any>> | undefined>;
export declare const updateBanner: (req: Request<{
    id: string;
}, ApiResponse<Banner>, UpdateBannerRequest>, res: Response<ApiResponse<Banner>>) => Promise<Response<ApiResponse<Banner>, Record<string, any>> | undefined>;
export declare const deleteBanner: (req: Request<{
    id: string;
}>, res: Response<ApiResponse>) => Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
export declare const toggleBannerStatus: (req: Request<{
    id: string;
}>, res: Response<ApiResponse<Banner>>) => Promise<Response<ApiResponse<Banner>, Record<string, any>> | undefined>;
//# sourceMappingURL=bannerController.d.ts.map