import { apiClient } from './client';
import { SignatureUtils } from '@/src/utils/signature';
import { logger } from '@/src/utils/logger';
import { ApiResponse, AppInitResponse } from '@/src/types'

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