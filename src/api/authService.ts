import { apiClient } from './client';
import { SignatureUtils } from '@/src/utils/signature';
import { logger } from '@/src/utils/logger';
import { ApiResponse, RegisterRequest } from '@/src/types';
import type {
    User,
    EmptyReponse,
    UserInfoResponse
} from '@/src/types';

export class AuthService {
    static async register(params: RegisterRequest) {
        try {
            logger.info('User register...');

            // Prepare request parameters with signature
            const signedParams = await SignatureUtils.prepareRequestParams(params);

            // Make API request
            const response = await apiClient.postRaw<ApiResponse<RegisterRequest>>(
                '/gc/user/appregister',
                signedParams
            );

            if (!response.data.success) {
                throw new Error(response.data.msg || 'User register failed');
            }

            logger.info('User register successfully');
            return response.data.data;
        } catch (error) {
            logger.error('User register failed:', error);
            throw error;
        }
    }

    static async login(username: string, password: string) {
        try {
            logger.info('User login...');

            // Prepare request parameters with signature
            const signedParams = await SignatureUtils.prepareRequestParams({ username, password });

            // Make API request
            const response = await apiClient.postRaw<ApiResponse<RegisterRequest>>(
                '/gc/user/applogin',
                signedParams
            );

            if (!response.data.success) {
                throw new Error(response.data.msg || 'User login failed');
            }

            logger.info('User login successfully');
            return response.data.data;
        } catch (error) {
            logger.error('User login failed:', error);
            throw error;
        }
    }

    static async logout(token: string) {
        try {
            logger.info('User logout...');

            // Prepare request parameters with signature
            const signedParams = await SignatureUtils.prepareRequestParams({ token });

            // Make API request
            const response = await apiClient.postRaw<ApiResponse<RegisterRequest>>(
                '/gc/user/applogout',
                signedParams
            );

            if (!response.data.success) {
                throw new Error(response.data.msg || 'User logout failed');
            }

            logger.info('User logout successfully');
            return response.data.data;
        } catch (error) {
            logger.error('User logout failed:', error);
            throw error;
        }
    }

}