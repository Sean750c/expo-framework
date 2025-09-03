// Global Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'vip';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Extend AxiosRequestConfig to include retry flag
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

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