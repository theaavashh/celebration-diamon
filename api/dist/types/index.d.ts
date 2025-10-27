import { Request } from 'express';
export interface Admin {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Banner {
    id: string;
    title: string;
    description: string | null;
    text: string;
    linkText: string | null;
    linkUrl: string | null;
    backgroundColor: string | null;
    textColor: string | null;
    isActive: boolean;
    priority: number;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface QuoteRequest {
    id: string;
    productId: string;
    product: Product;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Collection {
    id: string;
    name: string;
    description?: string;
    userId: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface SavedProduct {
    id: string;
    productId: string;
    product: Product;
    collectionId: string;
    collection: Collection;
    savedAt: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
    error?: string | undefined;
    errors?: any[];
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface BannerQueryParams extends PaginationParams {
    active_only?: 'true' | 'false';
    priority?: number;
    startDate?: string;
    endDate?: string;
}
export interface CreateBannerRequest {
    title: string;
    description?: string;
    text: string;
    linkText?: string;
    linkUrl?: string;
    backgroundColor?: string;
    textColor?: string;
    isActive?: boolean;
    priority?: number;
    startDate?: string;
    endDate?: string;
}
export interface UpdateBannerRequest extends Partial<CreateBannerRequest> {
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}
export interface JWTPayload {
    id: string;
    username: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
export interface AuthenticatedRequest extends Request {
    admin?: Admin;
    user?: Admin;
}
export interface EnvironmentVariables {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: number;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    RATE_LIMIT_WINDOW_MS?: number;
    RATE_LIMIT_MAX_REQUESTS?: number;
}
export interface ApiError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export interface ValidationError {
    field: string;
    message: string;
    value?: any;
}
export interface HealthCheckResponse {
    status: 'OK' | 'ERROR';
    timestamp: string;
    uptime: number;
    environment: string;
    database?: 'connected' | 'disconnected';
    memory?: {
        used: number;
        total: number;
        percentage: number;
    };
}
//# sourceMappingURL=index.d.ts.map