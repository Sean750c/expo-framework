import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import { tokenManager } from '@/src/utils/tokenManager';
import { logger } from '@/src/utils/logger';

export const useTokenRefresh = () => {
  const { isAuthenticated, refreshToken, logout } = useAuthStore();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear any existing refresh interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    // Check token expiry every 5 minutes
    const checkTokenExpiry = async () => {
      try {
        const isExpired = await tokenManager.isTokenExpired();
        
        if (isExpired) {
          logger.info('Token expired, attempting refresh...');
          await refreshToken();
        }
      } catch (error) {
        logger.error('Token refresh check failed:', error);
        // If refresh fails, logout the user
        await logout();
      }
    };

    // Initial check
    checkTokenExpiry();

    // Set up periodic check (every 5 minutes)
    refreshIntervalRef.current = setInterval(checkTokenExpiry, 5 * 60 * 1000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, refreshToken, logout]);

  return {
    // Expose manual refresh function if needed
    manualRefresh: refreshToken,
  };
};