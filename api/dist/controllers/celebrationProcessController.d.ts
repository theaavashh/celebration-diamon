import { Request, Response } from 'express';
export declare const getAllCelebrationProcesses: (req: Request, res: Response) => Promise<void>;
export declare const getAllCelebrationProcessesAdmin: (req: Request, res: Response) => Promise<void>;
export declare const getCelebrationProcessById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createCelebrationProcess: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCelebrationProcess: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCelebrationProcess: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleCelebrationProcessStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=celebrationProcessController.d.ts.map