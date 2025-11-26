import { Request, Response } from 'express';
export declare const getAnalyticsOverview: (req: Request, res: Response) => Promise<void>;
export declare const trackPageView: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const trackEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const trackSession: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getRealTimeAnalytics: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=analyticsController.d.ts.map