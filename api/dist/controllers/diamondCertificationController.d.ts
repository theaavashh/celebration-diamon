import { Request, Response } from 'express';
export declare const getAllDiamondCertifications: (req: Request, res: Response) => Promise<void>;
export declare const getAllDiamondCertificationsAdmin: (req: Request, res: Response) => Promise<void>;
export declare const getDiamondCertificationById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createDiamondCertification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateDiamondCertification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteDiamondCertification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleDiamondCertificationStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=diamondCertificationController.d.ts.map