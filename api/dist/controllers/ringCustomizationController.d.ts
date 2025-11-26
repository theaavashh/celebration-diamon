import { Request, Response } from 'express';
export declare const getAllRingCustomizations: (req: Request, res: Response) => Promise<void>;
export declare const getAllRingCustomizationsAdmin: (req: Request, res: Response) => Promise<void>;
export declare const getRingCustomizationById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createRingCustomization: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateRingCustomization: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteRingCustomization: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleRingCustomizationStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=ringCustomizationController.d.ts.map