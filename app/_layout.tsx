import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '@/src/components/AppProvider';
import { useTheme } from '@/src/hooks/useTheme';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  const ready = useFrameworkReady();
  const { theme } = useTheme();

  if (!ready) return null; // 等待框架初始化完成

  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
        <Toast />
        <StatusBar style={theme.colors.background === '#000000' ? 'light' : 'dark'} />
      </GestureHandlerRootView>
    </AppProvider>
  );
}
