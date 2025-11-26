import { Request, Response } from 'express';
export declare const getAllWeddingPlanners: (req: Request, res: Response) => Promise<void>;
export declare const getAllWeddingPlannersAdmin: (req: Request, res: Response) => Promise<void>;
export declare const getWeddingPlannerById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createWeddingPlanner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateWeddingPlanner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteWeddingPlanner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleWeddingPlannerStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=weddingPlannerController.d.ts.map