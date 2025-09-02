import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '@/src/config';
import { storage } from '@/src/utils/storage';
import { logger } from '@/src/utils/logger';
import { STORAGE_KEYS, ERROR_MESSAGES } from '@/src/constants';
import { ApiResponse, ApiError } from '@/src/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        logger.debug('API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle responses and errors
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        logger.debug('API Response:', response.status, response.config.url);
        return response;
      },
      async (error) => {
        logger.error('API Error:', error.response?.status, error.config?.url, error.message);

        if (error.response?.status === 401) {
          // Handle token expiration
          await this.handleUnauthorized();
        }

        const apiError: ApiError = {
          message: error.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR,
          status: error.response?.status || 0,
          code: error.response?.data?.code,
        };

        return Promise.reject(apiError);
      }
    );
  }

  private async handleUnauthorized() {
    // Clear auth data and redirect to login
    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await storage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // TODO: Navigate to login screen
    // NavigationService.navigate('Login');
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }
}

export const apiClient = new ApiClient();