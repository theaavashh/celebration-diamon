"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryApi = exports.GalleryApiClient = exports.apiClient = exports.ApiClient = exports.createCustomClient = exports.httpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const createHttpClient = (baseURL) => {
    const client = axios_1.default.create({
        baseURL: baseURL || process.env.API_BASE_URL || 'http://localhost:5000',
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    client.interceptors.request.use((config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
                params: config.params,
                data: config.data,
            });
        }
        return config;
    }, (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    });
    client.interceptors.response.use((response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data,
            });
        }
        return response;
    }, (error) => {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
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
        }
        else if (error.request) {
            console.error('Network error:', error.request);
        }
        else {
            console.error('Request setup error:', error.message);
        }
        return Promise.reject(error);
    });
    return client;
};
exports.httpClient = createHttpClient();
const createCustomClient = (baseURL) => createHttpClient(baseURL);
exports.createCustomClient = createCustomClient;
class ApiClient {
    constructor(baseURL) {
        this.client = createHttpClient(baseURL);
    }
    async get(url, config) {
        const response = await this.client.get(url, config);
        return response.data;
    }
    async post(url, data, config) {
        const response = await this.client.post(url, data, config);
        return response.data;
    }
    async put(url, data, config) {
        const response = await this.client.put(url, data, config);
        return response.data;
    }
    async patch(url, data, config) {
        const response = await this.client.patch(url, data, config);
        return response.data;
    }
    async delete(url, config) {
        const response = await this.client.delete(url, config);
        return response.data;
    }
}
exports.ApiClient = ApiClient;
exports.apiClient = new ApiClient();
class GalleryApiClient extends ApiClient {
    constructor() {
        super(...arguments);
        this.basePath = '/api/galleries';
    }
    async getGalleries(query) {
        return this.get(`${this.basePath}`, { params: query });
    }
    async getGallery(id) {
        return this.get(`${this.basePath}/${id}`);
    }
    async createGallery(data) {
        return this.post(`${this.basePath}`, data);
    }
    async updateGallery(id, data) {
        return this.put(`${this.basePath}/${id}`, data);
    }
    async deleteGallery(id) {
        return this.delete(`${this.basePath}/${id}`);
    }
    async toggleGalleryStatus(id) {
        return this.patch(`${this.basePath}/${id}/toggle`);
    }
    async getGalleriesAdmin(query) {
        return this.get(`${this.basePath}/admin`, { params: query });
    }
}
exports.GalleryApiClient = GalleryApiClient;
exports.galleryApi = new GalleryApiClient();
exports.default = exports.httpClient;
//# sourceMappingURL=httpClient.js.map