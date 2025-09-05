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

// Helper function to convert AuthResponse to User
const convertAuthResponseToUser = (authResponse: AuthResponse): User => {
  return {
    id: authResponse.user_id.toString(),
    name: authResponse.nickname || authResponse.username,
    email: authResponse.email,
    role: 'user',
    createdAt: new Date(authResponse.register_time * 1000).toISOString(),
    updatedAt: new Date(authResponse.last_login_time * 1000).toISOString(),
    user_id: authResponse.user_id,
    token: authResponse.token,
    country_id: authResponse.country_id,
    channel_type: authResponse.channel_type,
    avatar: authResponse.avatar,
    username: authResponse.username,
    nickname: authResponse.nickname,
    vip_level: authResponse.vip_level,
    money: authResponse.money,
    rebate_money: authResponse.rebate_money,
    usd_rebate_money: authResponse.usd_rebate_money,
    country_name: authResponse.country_name,
    currency_symbol: authResponse.currency_symbol,
    currency_name: authResponse.currency_name,
    withdrawal_method: authResponse.withdrawal_method,
    money_detail: authResponse.money_detail,
    country_logo_image: authResponse.country_logo_image,
    phone: authResponse.phone,
    is_email_bind: authResponse.is_email_bind,
    whatsapp: authResponse.whatsapp,
    google_bind: authResponse.google_bind,
    facebook_bind: authResponse.facebook_bind,
    apple_bind: authResponse.apple_bind,
    whatsapp_bind: authResponse.whatsapp_bind,
    password_null: authResponse.password_null,
    t_password_null: authResponse.t_password_null,
    register_time: authResponse.register_time,
    last_login_time: authResponse.last_login_time,
    point: authResponse.point,
    coupon_num: authResponse.coupon_num,
  };
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true });
      
      const authResponse = await AuthService.login({ username, password });
      const user = convertAuthResponseToUser(authResponse);
      
      // Store token and user data
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, authResponse.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({
        user,
        token: authResponse.token,
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
      
      const authResponse = await AuthService.register(params);
      const user = convertAuthResponseToUser(authResponse);
      
      // Store token and user data
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, authResponse.token);
      await storage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({
        user,
        token: authResponse.token,
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