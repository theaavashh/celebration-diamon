import { Request, Response } from 'express';
import { ApiResponse } from '../types';
export interface Review {
    id: string;
    productId: string;
    customerName: string;
    rating: number;
    comment?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const getProductReviews: (req: Request, res: Response<ApiResponse<Review[]>>) => Promise<void>;
export declare const getAllReviews: (req: Request, res: Response<ApiResponse<Review[]>>) => Promise<void>;
export declare const createReview: (req: Request, res: Response<ApiResponse<Review>>) => Promise<Response<ApiResponse<Review>, Record<string, any>> | undefined>;
export declare const updateReview: (req: Request, res: Response<ApiResponse<Review>>) => Promise<void>;
export declare const deleteReview: (req: Request, res: Response) => Promise<void>;
export declare const toggleReviewStatus: (req: Request, res: Response<ApiResponse<Review>>) => Promise<Response<ApiResponse<Review>, Record<string, any>> | undefined>;
//# sourceMappingURL=reviewController.d.ts.map