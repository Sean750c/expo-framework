import { create } from 'zustand';
import { AuthState, User } from '@/src/types';
import { storage } from '@/src/utils/storage';
import { apiClient } from '@/src/api/client';
import { STORAGE_KEYS, API_ENDPOINTS } from '@/src/constants';
import { logger } from '@/src/utils/logger';

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
      
      const response = await apiClient.post<{ user: User; token: string }>(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password }
      );

      const { user, token } = response;

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      logger.info('User logged in successfully');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      const response = await apiClient.post<{ user: User; token: string }>(
        API_ENDPOINTS.AUTH.REGISTER,
        { name, email, password }
      );

      const { user, token } = response;

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      logger.info('User registered successfully');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      const { token } = get();
      
      if (token) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      }

      await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
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
      const response = await apiClient.post<{ user: User; token: string }>(
        API_ENDPOINTS.AUTH.REFRESH
      );

      const { user, token } = response;

      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({ user, token, isAuthenticated: true });
    } catch (error) {
      logger.error('Token refresh failed:', error);
      get().logout();
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    try {
      set({ isLoading: true });
      
      const updatedUser = await apiClient.put<User>(
        API_ENDPOINTS.AUTH.PROFILE,
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
      
      const token = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      const user = await storage.getItem<User>(STORAGE_KEYS.USER_DATA);

      if (token && user) {
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