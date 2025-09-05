import React, { useEffect } from 'react';
import { useAuthStore } from '@/src/store/authStore';
import { Loading } from '@/src/components/common/Loading';
import { useRouter } from 'expo-router';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback,
  redirectTo = '/login',
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 延迟导航，确保 RootLayout 已挂载
      setTimeout(() => {
        router.replace('/login' as any);
      }, 0);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) return fallback || <Loading text="Authenticating..." overlay />;

  if (!isAuthenticated) return fallback || null;

  return <>{children}</>;
};
