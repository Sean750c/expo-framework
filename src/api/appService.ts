import { apiClient } from './client';
import { SignatureUtils } from '@/src/utils/signature';
import { logger } from '@/src/utils/logger';
import { InitResponse, InitData } from '@/src/types'

export class AppService {
  /**
   * Initialize app and get configuration
   */
  static async initializeApp(): Promise<InitData> {
    try {
      logger.info('Initializing app...');

      // Prepare request parameters with signature
      const params = await SignatureUtils.prepareRequestParams();

      // Make API request
      const response = await apiClient.post<InitResponse>(
        '/gc/public/appinit',
        params
      );

      logger.info('App initialized successfully');
      return response.data;
    } catch (error) {
      logger.error('App initialization failed:', error);
      throw error;
    }
  }

 
}