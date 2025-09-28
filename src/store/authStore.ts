import { create } from 'zustand';
import { AuthState, User, LoginRequest, RegisterRequest, AuthResponse } from '@/src/types';
import { storage } from '@/src/utils/storage';
import { STORAGE_KEYS } from '@/src/constants';
import { logger } from '@/src/utils/logger';
import { AuthService } from '@/src/api/authService';

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (params: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
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

  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true });
      
      const user = await AuthService.login({ username, password });
      
      // Store token and user data
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, user.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({
        user,
        token: user.token,
        isAuthenticated: true,
        isLoading: false,
      });

      logger.info('User logged in successfully');
    } catch (error: any) {
      set({ isLoading: false });
      logger.error('Login failed:', error);
      throw error;
    }
  },

  register: async (params: RegisterRequest) => {
    try {
      set({ isLoading: true });
      
      const user = await AuthService.register(params);
      
      // Store token and user data
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, user.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({
        user,
        token: user.token,
        isAuthenticated: true,
        isLoading: false,
      });

      logger.info('User registered successfully');
    } catch (error: any) {
      set({ isLoading: false });
      logger.error('Registration failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { token } = get();
      
      if (token) {
        await AuthService.logout(token);
      }

      // Clear stored data
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
      await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await storage.removeItem(STORAGE_KEYS.USER_DATA);
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    try {
      set({ isLoading: true });
      
      const { user } = get();
      if (!user) throw new Error('No user found');

      const updatedUser = { ...user, ...userData };
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