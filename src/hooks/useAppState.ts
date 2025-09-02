import { useEffect } from 'react';
import { AppState as RNAppState } from 'react-native';
import { useAppStore } from '@/src/store/appStore';

export const useAppState = () => {
  const { appState, setAppState } = useAppStore();

  useEffect(() => {
    const subscription = RNAppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState as 'active' | 'background' | 'inactive');
    });

    return () => subscription?.remove();
  }, [setAppState]);

  return { appState };
};