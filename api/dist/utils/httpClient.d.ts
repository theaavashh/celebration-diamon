import { AxiosRequestConfig } from 'axios';
export declare const httpClient: AxiosInstance;
export declare const createCustomClient: (baseURL: string) => AxiosInstance;
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
export declare class ApiClient {
    private client;
    constructor(baseURL?: string);
    get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
}
export declare const apiClient: ApiClient;
export declare class GalleryApiClient extends ApiClient {
    private basePath;
    getGalleries(query?: any): Promise<ApiResponse<unknown>>;
    getGallery(id: string): Promise<ApiResponse<unknown>>;
    createGallery(data: any): Promise<ApiResponse<unknown>>;
    updateGallery(id: string, data: any): Promise<ApiResponse<unknown>>;
    deleteGallery(id: string): Promise<ApiResponse<unknown>>;
    toggleGalleryStatus(id: string): Promise<ApiResponse<unknown>>;
    getGalleriesAdmin(query?: any): Promise<ApiResponse<unknown>>;
}
export declare const galleryApi: GalleryApiClient;
export default httpClient;
//# sourceMappingURL=httpClient.d.ts.map