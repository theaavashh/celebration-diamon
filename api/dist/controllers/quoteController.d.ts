import { Request, Response } from 'express';
export declare const getAllQuotes: (req: Request, res: Response) => Promise<void>;
export declare const getAllQuotesAdmin: (req: Request, res: Response) => Promise<void>;
export declare const getQuoteById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createQuote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateQuote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteQuote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleQuoteStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=quoteController.d.ts.map