import type { ApiResponse } from './api';

// User Profile API Types
export interface User {
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
    google_bind?: boolean; // Added for social bind status
    facebook_bind?: boolean; // Added for social bind status
    apple_bind?: boolean; // Added for social bind status
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

export interface RegisterRequest {
    register_type: '1' | '2' | '3';
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

export type UserRegisterResponse = ApiResponse<User>;
export type UserLoginResponse = ApiResponse<User>;
export type UserInfoResponse = ApiResponse<User>;