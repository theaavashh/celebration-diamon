import { Request, Response } from 'express';
export declare const getActiveTopBanners: (req: Request, res: Response) => Promise<void>;
export declare const getAllTopBanners: (req: Request, res: Response) => Promise<void>;
export declare const createTopBanner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTopBanner: (req: Request, res: Response) => Promise<void>;
export declare const deleteTopBanner: (req: Request, res: Response) => Promise<void>;
export declare const toggleTopBannerStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=topBannerController.d.ts.map