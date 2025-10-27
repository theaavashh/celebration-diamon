import { Request } from 'express';

// Database Models
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
  imageUrl: string | null;
  link: string | null;
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
  imageUrl?: string; // Legacy field for backward compatibility
  fileName?: string; // Uploaded file name (image or video)
  originalName?: string; // Original file name when uploaded
  fileType?: string; // "image" or "video"
  fileSize?: number; // File size in bytes
  mimeType?: string; // MIME type (image/jpeg, video/mp4, etc.)
  filePath?: string; // Path to the uploaded file
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
  category: string;
  subCategory?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
  goldWeight?: string;
  diamondDetails?: string;
  diamondQuantity?: number;
  diamondSize?: string;
  diamondWeight?: string;
  diamondQuality?: string;
  otherGemstones?: string;
  orderDuration?: string;
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

// API Request/Response Types
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

// Request Body Types
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

export interface UpdateBannerRequest extends Partial<CreateBannerRequest> {}

export interface CreateHeroRequest {
  heading: string;
  subHeading?: string;
  description?: string;
  ctaTitle?: string;
  ctaLink?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateHeroRequest extends Partial<CreateHeroRequest> {}

export interface CreateCategoryRequest {
  title: string;
  imageUrl?: string;
  link?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface CreateServiceRequest {
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {}

export interface CreateQuoteRequest {
  text: string;
  author?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateQuoteRequest extends Partial<CreateQuoteRequest> {}

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

export interface UpdateWeddingPlannerRequest extends Partial<CreateWeddingPlannerRequest> {}

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

export interface UpdateCultureRequest extends Partial<CreateCultureRequest> {}

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

export interface UpdateRingCustomizationRequest extends Partial<CreateRingCustomizationRequest> {}

export interface CreateDiamondCertificationRequest {
  title: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
  imageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateDiamondCertificationRequest extends Partial<CreateDiamondCertificationRequest> {}

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

export interface UpdateCelebrationProcessRequest extends Partial<CreateCelebrationProcessRequest> {}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateFAQRequest extends Partial<CreateFAQRequest> {}

export interface CreateGalleryItemRequest {
  title: string;
  imageUrl?: string; // Legacy field for backward compatibility
  fileName?: string; // Uploaded file name (image or video)
  originalName?: string; // Original file name when uploaded
  fileType?: string; // "image" or "video"
  fileSize?: number; // File size in bytes
  mimeType?: string; // MIME type (image/jpeg, video/mp4, etc.)
  filePath?: string; // Path to the uploaded file
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

export interface UpdateGalleryRequest extends Partial<CreateGalleryRequest> {}

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

// JWT Payload
export interface JWTPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extended Request with Auth
export interface AuthenticatedRequest extends Request {
  admin?: Admin;
  user?: Admin;
}

// Environment Variables
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

// Error Types
export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Health Check Response
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
