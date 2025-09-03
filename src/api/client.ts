import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '@/src/config';
import { storage } from '@/src/utils/storage';
import { logger } from '@/src/utils/logger';
import { STORAGE_KEYS, ERROR_MESSAGES } from '@/src/constants';
import { ApiResponse, ApiError } from '@/src/types';

interface FailedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
}
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: FailedRequest[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: config().API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: ApiError | null, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else {
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        resolve(this.client(config));
      }
    });
    
    this.failedQueue = [];
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
        const originalRequest = error.config;
        
        logger.error('API Error:', error.response?.status, error.config?.url, error.message);

        if (error.response?.status === 401 && !originalRequest._retry) {
          // Prevent refresh token endpoint from triggering refresh
          if (originalRequest.url?.includes('/auth/refresh')) {
            await this.handleUnauthorized();
            return Promise.reject(this.createApiError(error));
          }

          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Import authStore dynamically to avoid circular dependency
            const { useAuthStore } = await import('@/src/store/authStore');
            await useAuthStore.getState().refreshToken();
            
            // Get the new token
            const newToken = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            
            if (newToken) {
              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              
              // Process queued requests with new token
              this.processQueue(null, newToken);
              
              // Retry the original request
              return this.client(originalRequest);
            } else {
              throw new Error('No token received after refresh');
            }
          } catch (refreshError) {
            logger.error('Token refresh failed:', refreshError);
            
            // Process queued requests with error
            this.processQueue(this.createApiError(refreshError), null);
            
            // Handle unauthorized (logout user)
            await this.handleUnauthorized();
            
            return Promise.reject(this.createApiError(error));
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.createApiError(error));
      }
    );
  }

  private createApiError(error: any): ApiError {
    return {
      message: error.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR,
      status: error.response?.status || 0,
      code: error.response?.data?.code,
    };
  }
  private async handleUnauthorized() {
    try {
      // Import authStore dynamically to avoid circular dependency
      const { useAuthStore } = await import('@/src/store/authStore');
      await useAuthStore.getState().logout();
    } catch (error) {
      logger.error('Error during logout:', error);
      // Fallback: clear storage manually
      await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await storage.removeItem(STORAGE_KEYS.USER_DATA);
    }
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

  // Raw methods that return the full response (for APIs with different response structure)
  async postRaw<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.post<T>(url, data, config);
  }

  async getRaw<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.get<T>(url, config);
  }
}

export const apiClient = new ApiClient();