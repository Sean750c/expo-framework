import { create } from 'zustand';
import { AppState } from '@/src/types';
import { storage } from '@/src/utils/storage';
import { STORAGE_KEYS } from '@/src/constants';

interface AppStore extends AppState {
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  setOnlineStatus: (isOnline: boolean) => void;
  setAppState: (appState: 'active' | 'background' | 'inactive') => void;
  initializeApp: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  theme: 'light',
  isOnline: true,
  appState: 'active',

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

  initializeApp: async () => {
    try {
      const savedTheme = await storage.getItem<'light' | 'dark'>(STORAGE_KEYS.THEME);
      if (savedTheme) {
        set({ theme: savedTheme });
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  },
}));