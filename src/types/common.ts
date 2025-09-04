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

// Device and API types
export interface DeviceInfo {
    os_type: string;
    device_no: string;
    device_type: string;
}

export interface AppInitResponse {
    fqa_url: string;
    vip_url: string;
    share_link: string;
    service_phone: string;
    whatsapp_phone: string;
    vip_phone: boolean;
    email: string;
    have_notice: boolean;
    notice_count: number;
    social_media_links: any;
    hidden_flag: string;
    comment_flag: string;
    rating_flag: string;
    sell_link: boolean;
    support_link: boolean;
    whatsapp_enable: boolean;
    facebook_disable: boolean;
    register_type: boolean;
    is_need_verify: boolean;
    google_login_enable: boolean;
    facebook_login_enable: boolean;
    apple_login_enable: boolean;
    biometric_enable: boolean;
    checkin_enable: boolean;
    lottery_enable: boolean;
    utility_enable: boolean;
    coupon_num: number;
    is_update: boolean;
    force_update: boolean;
    up_text: boolean;
    apk_url: boolean;
    ios_url: boolean;
    apk_size: number;
    widget_url: string;
    auto_identify_card: boolean;
    whatsapp_register: boolean;
    whatsapp_chuanying: boolean;
    social_enable: boolean;
    platform_fee: string;
    recommend_fee: string;
}
