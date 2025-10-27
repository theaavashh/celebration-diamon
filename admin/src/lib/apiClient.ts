import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
console.log('🔧 API_BASE_URL configured as:', API_BASE_URL);

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add authentication token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔑 Adding auth token to request:', token.substring(0, 20) + '...');
        } else {
          console.warn('⚠️ No auth token found in localStorage');
        }
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        const fullUrl = `${config.baseURL}${config.url}`;
        console.log(`🚀 ${config.method?.toUpperCase()} ${fullUrl}`, {
          baseURL: config.baseURL,
          url: config.url,
          params: config.params,
          data: config.data,
          headers: config.headers,
        });
      }

      return config;
    },
    (error: AxiosError) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    (error: AxiosError) => {
      // Handle common error scenarios
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            // Unauthorized - redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
            break;
          case 403:
            console.error('Forbidden: Insufficient permissions');
            break;
          case 400:
            console.error('Bad request:', data);
            break;
          case 404:
            console.error('Resource not found');
            break;
          case 422:
            console.error('Validation error:', data);
            break;
          case 500:
            console.error('Internal server error');
            break;
          default:
            console.error(`HTTP Error ${status}:`, data);
        }

        console.error(` ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status,
          data,
        });
      } else if (error.request) {
        console.error('Network error:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create default client
export const apiClient = createApiClient();

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Generic API methods
export class ApiService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance = apiClient) {
    this.client = client;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

// Gallery-specific API service
export class GalleryApiService extends ApiService {
  private basePath = '/galleries';

  async getGalleries(query?: any): Promise<ApiResponse<any[]>> {
    return this.get(`${this.basePath}`, { params: query });
  }

  async getGallery(id: string): Promise<ApiResponse<any>> {
    return this.get(`${this.basePath}/${id}`);
  }

  async createGallery(data: any): Promise<ApiResponse<any>> {
    return this.post(`${this.basePath}`, data);
  }

  async updateGallery(id: string, data: any): Promise<ApiResponse<any>> {
    return this.put(`${this.basePath}/${id}`, data);
  }

  async deleteGallery(id: string): Promise<ApiResponse<void>> {
    return this.delete(`${this.basePath}/${id}`);
  }

  async toggleGalleryStatus(id: string): Promise<ApiResponse<any>> {
    return this.patch(`${this.basePath}/${id}/toggle`);
  }

  // Admin endpoints
  async getGalleriesAdmin(query?: any): Promise<ApiResponse<any[]>> {
    return this.get(`${this.basePath}/admin`, { params: query });
  }
}

// Export gallery API service
export const galleryApi = new GalleryApiService();

// Default API service
export const apiService = new ApiService();

export default apiClient;