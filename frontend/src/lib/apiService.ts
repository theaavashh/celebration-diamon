import { getApiBaseUrl } from './api';

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageUrl: string;
  images: ProductImage[];
  rating: number;
  reviews: number;
  description: string;
  fullDescription: string;
  details: string;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  metal: string;
  purity: string;
  caratWeight: string;
  clarity: string;
  color: string;
  cut: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  certification?: string;
  warranty?: string;
  stock: number;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API response interfaces
interface ApiProduct {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageUrl: string;
  images: ProductImage[];
  rating: number;
  reviews: number;
  description: string;
  fullDescription: string;
  details: string;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  metal: string;
  purity: string;
  caratWeight: string;
  clarity: string;
  color: string;
  cut: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  certification?: string;
  warranty?: string;
  stock: number;
  isActive: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const response = await this.request<ApiProduct[]>('/products');
      // Map API response to our Product interface
      const products: Product[] = response.data.map(product => ({
        ...product,
        subcategory: product.subCategory,
        image: product.imageUrl || (product.images && product.images.length > 0 ? product.images[0].url : '') || product.image || ''
      }));
      return products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Return empty array as fallback
      return [];
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await this.request<ApiProduct[]>(`/products?category=${category}`);
      // Map API response to our Product interface
      const products: Product[] = response.data.map(product => ({
        ...product,
        subcategory: product.subCategory,
        image: product.imageUrl || (product.images && product.images.length > 0 ? product.images[0].url : '') || product.image || ''
      }));
      return products;
    } catch (error) {
      console.error(`Failed to fetch products for category ${category}:`, error);
      // Return empty array as fallback
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await this.request<ApiProduct>(`/products/${id}`);
      // Map API response to our Product interface
      const product: Product = {
        ...response.data,
        subcategory: response.data.subCategory,
        image: response.data.imageUrl || (response.data.images && response.data.images.length > 0 ? response.data.images[0].url : '') || response.data.image || ''
      };
      return product;
    } catch (error) {
      console.error(`Failed to fetch product with id ${id}:`, error);
      return null;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await this.request<ApiProduct[]>(`/products/search?q=${encodeURIComponent(query)}`);
      // Map API response to our Product interface
      const products: Product[] = response.data.map(product => ({
        ...product,
        subcategory: product.subCategory,
        image: product.imageUrl || (product.images && product.images.length > 0 ? product.images[0].url : '') || product.image || ''
      }));
      return products;
    } catch (error) {
      console.error(`Failed to search products with query ${query}:`, error);
      return [];
    }
  }
}

export const apiService = new ApiService();
export type { Product };