import type { ApiResponse } from './api';
import type { User } from './user';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  theme: 'light' | 'dark';
  isOnline: boolean;
  appState: 'active' | 'background' | 'inactive';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  register_type: '1' | '2' | '3'; // 1: email, 2: phone, 3: whatsapp
  country_id: string;
  username: string;
  password: string;
  email?: string;
  whatsapp?: string;
  recommend_code?: string;
  push_device_token?: string;
  code?: string;
  sign_to_coupon?: string;
  social_id?: string;
  social_type?: string;
}

export type AuthResponse = ApiResponse<User>;