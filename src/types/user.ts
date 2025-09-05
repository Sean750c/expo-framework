import type { ApiResponse } from './api';

// User Profile API Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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

export interface UserInfoRequest {
  token: string;
}

export interface ModifyNicknameRequest {
  token: string;
  nickname: string;
}

export interface UploadAvatarRequest {
  token: string;
  avatar: string; // base64 encoded image
}

export type UserRegisterResponse = ApiResponse<User>;
export type UserLoginResponse = ApiResponse<User>;
export type UserInfoResponse = ApiResponse<User>;