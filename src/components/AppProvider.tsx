import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { useAuthStore } from '@/src/store/authStore';
import { useAppStore } from '@/src/store/appStore';
import { useNetwork } from '@/src/hooks/useNetwork';
import { useAppState } from '@/src/hooks/useAppState';
import { useTheme } from '@/src/hooks/useTheme';
import { useTokenRefresh } from '@/src/hooks/useTokenRefresh';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = useAuthStore();
  const { initializeApp } = useAppStore();
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);

  // 初始化 hooks
  useNetwork();
  useAppState();
  useTokenRefresh();

  useEffect(() => {
    const init = async () => {
      await Promise.all([initializeApp(), initializeAuth()]);
      setReady(true); // 初始化完成
    };
    init();
  }, [initializeApp, initializeAuth]);

  if (!ready) return null; // 初始化完成前不渲染子组件

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
