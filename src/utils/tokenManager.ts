import { storage } from './storage';
import { logger } from './logger';
import { STORAGE_KEYS } from '@/src/constants';

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

class TokenManager {
  private static instance: TokenManager;
  
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      logger.error('Failed to get access token:', error);
      return null;
    }
  }

  async setTokens(tokenData: TokenData): Promise<void> {
    try {
      await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokenData.accessToken);
      
      if (tokenData.refreshToken) {
        await storage.setItem(`${STORAGE_KEYS.AUTH_TOKEN}_refresh`, tokenData.refreshToken);
      }
      
      if (tokenData.expiresAt) {
        await storage.setItem(`${STORAGE_KEYS.AUTH_TOKEN}_expires`, tokenData.expiresAt);
      }
      
      logger.debug('Tokens stored successfully');
    } catch (error) {
      logger.error('Failed to store tokens:', error);
      throw error;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await storage.getItem<string>(`${STORAGE_KEYS.AUTH_TOKEN}_refresh`);
    } catch (error) {
      logger.error('Failed to get refresh token:', error);
      return null;
    }
  }

  async isTokenExpired(): Promise<boolean> {
    try {
      const expiresAt = await storage.getItem<number>(`${STORAGE_KEYS.AUTH_TOKEN}_expires`);
      if (!expiresAt) return false; // If no expiry time, assume token is valid
      
      return Date.now() >= expiresAt;
    } catch (error) {
      logger.error('Failed to check token expiry:', error);
      return false;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        storage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        storage.removeItem(`${STORAGE_KEYS.AUTH_TOKEN}_refresh`),
        storage.removeItem(`${STORAGE_KEYS.AUTH_TOKEN}_expires`),
      ]);
      logger.debug('Tokens cleared successfully');
    } catch (error) {
      logger.error('Failed to clear tokens:', error);
      throw error;
    }
  }
}

export const tokenManager = TokenManager.getInstance();