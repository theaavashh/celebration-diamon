import { Request, Response } from 'express';
import { ApiResponse, PopupImage } from '../types';
import multer from 'multer';
declare const upload: multer.Multer;
export { upload };
export declare const getActivePopupImage: (req: Request, res: Response<ApiResponse<PopupImage>>) => Promise<Response<ApiResponse<PopupImage>, Record<string, any>> | undefined>;
export declare const getAllPopupImages: (req: Request, res: Response<ApiResponse<PopupImage[]>>) => Promise<void>;
export declare const uploadPopupImage: (req: Request, res: Response<ApiResponse<PopupImage>>) => Promise<Response<ApiResponse<PopupImage>, Record<string, any>> | undefined>;
export declare const togglePopupImageStatus: (req: Request<{
    id: string;
}>, res: Response<ApiResponse<PopupImage>>) => Promise<Response<ApiResponse<PopupImage>, Record<string, any>> | undefined>;
export declare const deletePopupImage: (req: Request<{
    id: string;
}>, res: Response<ApiResponse>) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=popupController.d.ts.map