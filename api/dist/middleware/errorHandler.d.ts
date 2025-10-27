import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '@/types';
export declare const errorHandler: (err: ApiError, _req: Request, res: Response<ApiResponse>, _next: NextFunction) => Response<ApiResponse<any>, Record<string, any>> | undefined;
//# sourceMappingURL=errorHandler.d.ts.map