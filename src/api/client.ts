import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import config from '@/src/config';
import { storage } from '@/src/utils/storage';
import { logger } from '@/src/utils/logger';
import { STORAGE_KEYS, ERROR_MESSAGES } from '@/src/constants';
import { ApiResponse, ApiError } from '@/src/types';
import { useAuthStore } from '@/src/store/authStore';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config().API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json', // 默认 GET/Raw 用 JSON
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

        const errorMessage = error.response?.data?.msg || error.response?.data?.message || '';
        if (errorMessage.includes('Session expired') || error.response?.status === 401) {
          await this.handleUnauthorized();
        }

        return Promise.reject(this.createApiError(error));
      }
    );
  }

  private createApiError(error: any): ApiError {
    return {
      message: error.response?.data?.msg || error.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR,
      status: error.response?.status || 0,
      code: error.response?.data?.code,
    };
  }

  private async handleUnauthorized() {
    try {
      const authStore = useAuthStore.getState();
      await authStore.logout();
    } catch (error) {
      logger.error('Error during logout:', error);
      await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await storage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }

  // ---------- 封装方法 ----------
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    
    if (!response.data.success) {
      throw new Error(response.data.msg || 'API request failed');
    }
    
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse> {
    const response = await this.client.post<ApiResponse<T>>(
      url,
      qs.stringify(data), // form-urlencoded
      {
        ...config,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(config?.headers || {}),
        },
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.msg || 'API request failed');
    }
    
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse> {
    const response = await this.client.put<ApiResponse<T>>(
      url,
      qs.stringify(data),
      {
        ...config,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(config?.headers || {}),
        },
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.msg || 'API request failed');
    }
    
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse> {
    const response = await this.client.patch<ApiResponse<T>>(
      url,
      qs.stringify(data),
      {
        ...config,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(config?.headers || {}),
        },
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.msg || 'API request failed');
    }
    
    return response.data;
  }

  async delete<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse> {
    const response = await this.client.delete<ApiResponse<T>>(
      url,
      {
        ...config,
        data: qs.stringify(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(config?.headers || {}),
        },
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.msg || 'API request failed');
    }
    
    return response.data;
  }

  // ---------- Raw methods (保留 JSON 灵活用) ----------
  async postRaw<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.post<T>(url, data, config);
  }

  async getRaw<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.get<T>(url, config);
  }
}

export const apiClient = new ApiClient();
