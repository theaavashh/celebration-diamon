import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with default configuration
const createHttpClient = (baseURL?: string): AxiosInstance => {
  const client = axios.create({
    baseURL: baseURL || process.env.API_BASE_URL || 'http://localhost:5000',
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
        }
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
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

        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
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
export const httpClient = createHttpClient();

// Create client with custom base URL
export const createCustomClient = (baseURL: string) => createHttpClient(baseURL);

// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Generic API methods
export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = createHttpClient(baseURL);
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

// Default API client instance
export const apiClient = new ApiClient();

// Gallery-specific API client
export class GalleryApiClient extends ApiClient {
  private basePath = '/api/galleries';

  async getGalleries(query?: any) {
    return this.get(`${this.basePath}`, { params: query });
  }

  async getGallery(id: string) {
    return this.get(`${this.basePath}/${id}`);
  }

  async createGallery(data: any) {
    return this.post(`${this.basePath}`, data);
  }

  async updateGallery(id: string, data: any) {
    return this.put(`${this.basePath}/${id}`, data);
  }

  async deleteGallery(id: string) {
    return this.delete(`${this.basePath}/${id}`);
  }

  async toggleGalleryStatus(id: string) {
    return this.patch(`${this.basePath}/${id}/toggle`);
  }

  // Admin endpoints
  async getGalleriesAdmin(query?: any) {
    return this.get(`${this.basePath}/admin`, { params: query });
  }
}

// Export gallery API client
export const galleryApi = new GalleryApiClient();

export default httpClient;

















