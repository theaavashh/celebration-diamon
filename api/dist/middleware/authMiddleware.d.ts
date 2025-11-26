import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
export declare const authMiddleware: (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authMiddleware.d.ts.map