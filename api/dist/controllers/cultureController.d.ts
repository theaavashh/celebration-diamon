import { Request, Response } from 'express';
export declare const getAllCultures: (req: Request, res: Response) => Promise<void>;
export declare const getAllCulturesAdmin: (req: Request, res: Response) => Promise<void>;
export declare const getCultureById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createCulture: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCulture: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCulture: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleCultureStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=cultureController.d.ts.map