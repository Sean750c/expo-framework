import { apiClient } from './client';
import { SignatureUtils } from '@/src/utils/signature';
import { logger } from '@/src/utils/logger';

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

export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  msg: string;
  data: T;
}

export class AppService {
  /**
   * Initialize app and get configuration
   */
  static async initializeApp(): Promise<AppInitResponse> {
    try {
      logger.info('Initializing app...');

      // Prepare request parameters with signature
      const params = await SignatureUtils.prepareRequestParams();

      // Make API request
      const response = await apiClient.postRaw<ApiResponse<AppInitResponse>>(
        '/gc/public/appinit',
        params
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'App initialization failed');
      }

      logger.info('App initialized successfully');
      return response.data.data;
    } catch (error) {
      logger.error('App initialization failed:', error);
      throw error;
    }
  }

  /**
   * Generic API call with signature
   */
  static async makeSignedRequest<T>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      // Prepare request parameters with signature
      const signedParams = await SignatureUtils.prepareRequestParams(params);

      // Make API request
      const response = await apiClient.postRaw<ApiResponse<T>>(
        endpoint,
        signedParams
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'API request failed');
      }

      return response.data.data;
    } catch (error) {
      logger.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }
}