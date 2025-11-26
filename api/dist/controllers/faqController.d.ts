import { Request, Response } from 'express';
export declare const getAllFAQs: (req: Request, res: Response) => Promise<void>;
export declare const getAllFAQsAdmin: (req: Request, res: Response) => Promise<void>;
export declare const getFAQById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createFAQ: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateFAQ: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteFAQ: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleFAQStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=faqController.d.ts.map