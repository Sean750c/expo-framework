import { create } from 'zustand';
import { AppState } from '@/src/types';
import { storage } from '@/src/utils/storage';
import { AppService } from '@/src/api/appService';
import { AppInitResponse } from '@/src/types';
import { logger } from '@/src/utils/logger';
import { STORAGE_KEYS } from '@/src/constants';

interface AppStore extends AppState {
  appConfig: AppInitResponse | null;
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  setOnlineStatus: (isOnline: boolean) => void;
  setAppState: (appState: 'active' | 'background' | 'inactive') => void;
  initializeApp: () => Promise<void>;
  setAppConfig: (config: AppInitResponse) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  theme: 'light',
  isOnline: true,
  appState: 'active',
  appConfig: null,

  setTheme: async (theme: 'light' | 'dark') => {
    try {
      await storage.setItem(STORAGE_KEYS.THEME, theme);
      set({ theme });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },

  setOnlineStatus: (isOnline: boolean) => {
    set({ isOnline });
  },

  setAppState: (appState: 'active' | 'background' | 'inactive') => {
    set({ appState });
  },

  setAppConfig: (config: AppInitResponse) => {
    set({ appConfig: config });
  },

  initializeApp: async () => {
    try {
      // Load saved theme
      const savedTheme = await storage.getItem<'light' | 'dark'>(STORAGE_KEYS.THEME);
      if (savedTheme) {
        set({ theme: savedTheme });
      }

      // Initialize app with API
      try {
        const appConfig = await AppService.initializeApp();
        set({ appConfig });
        logger.info('App configuration loaded successfully');
      } catch (error) {
        logger.error('Failed to load app configuration:', error);
        // Continue with app initialization even if API fails
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  },
}));