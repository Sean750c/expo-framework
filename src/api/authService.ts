import { SignatureUtils } from '@/src/utils/signature';
import { logger } from '@/src/utils/logger';
import { apiClient } from './client';
import { ApiResponse, RegisterRequest, LoginRequest, AuthResponse, User } from '@/src/types';

export class AuthService {
  static async register(params: RegisterRequest): Promise<User> {
    try {
      logger.info('User register...');

      // Prepare request parameters with signature
      const signedParams = await SignatureUtils.prepareRequestParams(params);

      // Make API request
      const response = await apiClient.post<AuthResponse>(
        '/gc/user/appregister',
        signedParams
      );

      logger.info('User register successfully');
      return response;
    } catch (error) {
      logger.error('User register failed:', error);
      throw error;
    }
  }

  static async login(params: LoginRequest): Promise<User> {
    try {
      logger.info('User login...');

      // Prepare request parameters with signature
      const signedParams = await SignatureUtils.prepareRequestParams(params);

      // Make API request
      const response = await apiClient.post<AuthResponse>(
        '/gc/user/applogin',
        signedParams
      );

      logger.info('User login successfully');
      return response;
    } catch (error) {
      logger.error('User login failed:', error);
      throw error;
    }
  }

  static async logout(token: string): Promise<void> {
    try {
      logger.info('User logout...');

      // Prepare request parameters with signature
      const signedParams = await SignatureUtils.prepareRequestParams({ token });

      // Make API request
      const response = await apiClient.post<ApiResponse<{}>>(
        '/gc/user/applogout',
        signedParams
      );

      logger.info('User logout successfully');
    } catch (error) {
      logger.error('User logout failed:', error);
      throw error;
    }
  }
}