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

export interface AuthResponse {
  user_id: number;
  token: string;
  country_id: number;
  channel_type: number;
  avatar: string;
  username: string;
  nickname: string;
  vip_level: number;
  money: string;
  rebate_money: string;
  usd_rebate_money: string;
  country_name: string;
  currency_symbol: string;
  currency_name: string;
  withdrawal_method: number;
  money_detail: number;
  country_logo_image: string;
  phone: string;
  email: string;
  is_email_bind: boolean;
  whatsapp: string;
  google_bind?: boolean;
  facebook_bind?: boolean;
  apple_bind?: boolean;
  whatsapp_bind: boolean;
  password_null: boolean;
  t_password_null: boolean;
  register_time: number;
  last_login_time: number;
  point: number;
  coupon_num: number;
}