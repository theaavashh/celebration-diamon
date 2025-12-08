import { Request } from 'express';
export interface Admin {
    id: string;
    fullname: string;
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
export interface Hero {
    id: string;
    heading: string;
    subHeading: string | null;
    description: string | null;
    ctaTitle: string | null;
    ctaLink: string | null;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Category {
    id: string;
    title: string;
    iconUrl: string | null;
    imageUrl: string | null;
    link: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    navImage1Url: string | null;
    navImage2Url: string | null;
}
export interface Subcategory {
    id: string;
    name: string;
    categoryId: string;
    category: Category;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Service {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    link: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Quote {
    id: string;
    text: string;
    author: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface WeddingPlanner {
    id: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string | null;
    imageUrl: string | null;
    badgeText: string | null;
    badgeSubtext: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Culture {
    id: string;
    name: string;
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string | null;
    imageUrl: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface RingCustomization {
    id: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string | null;
    processImageUrl: string | null;
    example1Title: string | null;
    example1Desc: string | null;
    example1ImageUrl: string | null;
    example2Title: string | null;
    example2Desc: string | null;
    example2ImageUrl: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface DiamondCertification {
    id: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string | null;
    imageUrl: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CelebrationProcessStep {
    id: string;
    celebrationProcessId: string;
    title: string;
    description: string;
    icon: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CelebrationProcess {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    steps: CelebrationProcessStep[];
}
export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface GalleryItem {
    id: string;
    galleryId: string;
    title: string;
    imageUrl?: string;
    fileName?: string;
    originalName?: string;
    fileType?: string;
    fileSize?: number;
    mimeType?: string;
    filePath?: string;
    description: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Gallery {
    id: string;
    title: string;
    subtitle: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    galleryItems: GalleryItem[];
}
export interface PopupImage {
    id: string;
    fileName: string;
    originalName: string;
    filePath: string;
    mimeType: string;
    fileSize: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Product {
    id: string;
    productCode: string;
    name: string;
    description: string;
    briefDescription?: string;
    fullDescription?: string;
    category: string;
    subCategory?: string;
    price: number;
    imageUrl?: string;
    stock: number;
    isActive: boolean;
    status: string;
    goldWeight?: string;
    goldPurity?: string;
    goldType?: string;
    goldCraftsmanship?: string;
    goldDesignDescription?: string;
    goldFinishedType?: string;
    goldStones?: string;
    goldStoneQuality?: string;
    diamondType?: string;
    diamondShapeCut?: string;
    diamondColorGrade?: string;
    diamondClarityGrade?: string;
    diamondCutGrade?: string;
    diamondMetalDetails?: string;
    diamondCertification?: string;
    diamondOrigin?: string;
    diamondCaratWeight?: string;
    diamondDetails?: string;
    diamondQuantity?: number;
    diamondSize?: string;
    diamondWeight?: string;
    diamondQuality?: string;
    platinumWeight?: string;
    platinumType?: string;
    silverWeight?: string;
    silverType?: string;
    otherGemstones?: string;
    orderDuration?: string;
    stoneWeight?: string;
    caret?: string;
    jewelryType?: string;
    materialType?: string;
    metalType?: string;
    stoneType?: string;
    settingType?: string;
    size?: string;
    color?: string;
    finish?: string;
    digitalBrowser?: boolean;
    website?: boolean;
    distributor?: boolean;
    culture?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    seoSlug?: string;
    videoUrl?: string;
    images?: ProductImage[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    altText?: string;
    order: number;
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
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    stack?: string;
    count?: number;
    total?: number;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
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
export interface CreateHeroRequest {
    heading: string;
    subHeading?: string;
    description?: string;
    ctaTitle?: string;
    ctaLink?: string;
    imageUrl?: string;
    isActive?: boolean;
}
export interface UpdateHeroRequest extends Partial<CreateHeroRequest> {
}
export interface CreateCategoryRequest {
    title: string;
    iconUrl?: string;
    imageUrl?: string;
    link?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
}
export interface CreateSubcategoryRequest {
    name: string;
    categoryId: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateSubcategoryRequest extends Partial<CreateSubcategoryRequest> {
}
export interface CreateServiceRequest {
    title: string;
    description: string;
    imageUrl?: string;
    link?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
}
export interface CreateQuoteRequest {
    text: string;
    author?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateQuoteRequest extends Partial<CreateQuoteRequest> {
}
export interface CreateWeddingPlannerRequest {
    title: string;
    description: string;
    ctaText: string;
    ctaLink?: string;
    imageUrl?: string;
    badgeText?: string;
    badgeSubtext?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateWeddingPlannerRequest extends Partial<CreateWeddingPlannerRequest> {
}
export interface CreateCultureRequest {
    name: string;
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink?: string;
    imageUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateCultureRequest extends Partial<CreateCultureRequest> {
}
export interface CreateRingCustomizationRequest {
    title: string;
    description: string;
    ctaText: string;
    ctaLink?: string;
    processImageUrl?: string;
    example1Title?: string;
    example1Desc?: string;
    example1ImageUrl?: string;
    example2Title?: string;
    example2Desc?: string;
    example2ImageUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateRingCustomizationRequest extends Partial<CreateRingCustomizationRequest> {
}
export interface CreateDiamondCertificationRequest {
    title: string;
    description: string;
    ctaText: string;
    ctaLink?: string;
    imageUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateDiamondCertificationRequest extends Partial<CreateDiamondCertificationRequest> {
}
export interface CreateCelebrationProcessStepRequest {
    title: string;
    description: string;
    icon: string;
    order: number;
    isActive?: boolean;
}
export interface CreateCelebrationProcessRequest {
    title: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
    steps?: CreateCelebrationProcessStepRequest[];
}
export interface UpdateCelebrationProcessRequest extends Partial<CreateCelebrationProcessRequest> {
}
export interface CreateFAQRequest {
    question: string;
    answer: string;
    category?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export interface UpdateFAQRequest extends Partial<CreateFAQRequest> {
}
export interface CreateGalleryItemRequest {
    title: string;
    imageUrl?: string;
    fileName?: string;
    originalName?: string;
    fileType?: string;
    fileSize?: number;
    mimeType?: string;
    filePath?: string;
    description?: string | null;
    sortOrder: number;
    isActive?: boolean;
}
export interface CreateGalleryRequest {
    title: string;
    subtitle: string;
    isActive?: boolean;
    sortOrder?: number;
    galleryItems?: CreateGalleryItemRequest[];
}
export interface UpdateGalleryRequest extends Partial<CreateGalleryRequest> {
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    fullname: string;
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