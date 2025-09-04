import { create } from 'zustand';
import { AuthState, User } from '@/src/types';
import { storage } from '@/src/utils/storage';
import { STORAGE_KEYS, API_ENDPOINTS } from '@/src/constants';
import { logger } from '@/src/utils/logger';
import { tokenManager } from '@/src/utils/tokenManager';
import axios from 'axios';
import config from '@/src/config';
import { apiClient } from '@/src/api/client';
import { ApiResponse } from '@/src/types';
import { ERROR_MESSAGES } from '@/src/constants';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      // Use direct axios call to avoid circular dependency
      const response = await axios.post<ApiResponse<{ user: User; token: string; refreshToken?: string; expiresAt?: number }>>(
        `${config().API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        { email, password }
      );

      const { user, token, refreshToken, expiresAt } = response.data.data;

      // Store tokens using token manager
      await tokenManager.setTokens({
        accessToken: token,
        refreshToken,
        expiresAt,
      });
      
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      logger.info('User logged in successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const apiError = {
        message: error.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status || 0,
        code: error.response?.data?.code,
      };
      throw apiError;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      // Use direct axios call to avoid circular dependency
      const response = await axios.post<ApiResponse<{ user: User; token: string; refreshToken?: string; expiresAt?: number }>>(
        `${config().API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        { name, email, password }
      );

      const { user, token, refreshToken, expiresAt } = response.data.data;

      // Store tokens using token manager
      await tokenManager.setTokens({
        accessToken: token,
        refreshToken,
        expiresAt,
      });
      
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      logger.info('User registered successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const apiError = {
        message: error.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR,
        status: error.response?.status || 0,
        code: error.response?.data?.code,
      };
      throw apiError;
    }
  },

  logout: async () => {
    try {
      const { token } = get();
      
      if (token) {
        // Use direct axios call to avoid circular dependency during logout
        await axios.post(
          `${config().API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      await tokenManager.clearTokens();
      await storage.removeItem(STORAGE_KEYS.USER_DATA);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout error:', error);
      // Still clear local state even if API call fails
      await tokenManager.clearTokens();
      await storage.removeItem(STORAGE_KEYS.USER_DATA);
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = await tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Use direct axios call to avoid circular dependency
      const response = await axios.post<ApiResponse<{ user: User; token: string; refreshToken?: string; expiresAt?: number }>>(
        `${config().API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken }
      );

      const { user, token, refreshToken: newRefreshToken, expiresAt } = response.data.data;

      // Store new tokens
      await tokenManager.setTokens({
        accessToken: token,
        refreshToken: newRefreshToken || refreshToken, // Use new refresh token if provided, otherwise keep the old one
        expiresAt,
      });
      
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({ user, token, isAuthenticated: true });
      
      logger.info('Token refreshed successfully');
    } catch (error: any) {
      logger.error('Token refresh failed:', error);
      
      // Clear tokens and logout user
      await tokenManager.clearTokens();
      await storage.removeItem(STORAGE_KEYS.USER_DATA);
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      const apiError = {
        message: error.response?.data?.message || 'Token refresh failed',
        status: error.response?.status || 0,
        code: error.response?.data?.code,
      };
      throw apiError;
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    try {
      set({ isLoading: true });
      
      // Import apiClient dynamically to avoid issues during initialization
      const updatedUser = await apiClient.put<User>(
        API_ENDPOINTS.AUTH.LOGIN,
        userData
      );

      await storage.setItem(STORAGE_KEYS.USER_DATA, updatedUser);
      
      set({ 
        user: updatedUser,
        isLoading: false,
      });

      logger.info('Profile updated successfully');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      const token = await tokenManager.getAccessToken();
      const user = await storage.getItem<User>(STORAGE_KEYS.USER_DATA);

      if (token && user) {
        // Check if token is expired
        const isExpired = await tokenManager.isTokenExpired();
        
        if (isExpired) {
          logger.info('Token expired during initialization, attempting refresh...');
          try {
            await get().refreshToken();
          } catch (refreshError) {
            logger.error('Failed to refresh token during initialization:', refreshError);
            // Clear invalid tokens and user data
            await tokenManager.clearTokens();
            await storage.removeItem(STORAGE_KEYS.USER_DATA);
            set({ isLoading: false });
            return;
          }
        }
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      logger.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },
}));