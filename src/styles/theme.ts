import { Theme, ThemeColors } from '@/src/types';

const lightColors: ThemeColors = {
  primary: '#007AFF',
  secondary: '#34C759',
  accent: '#FF9500',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

const darkColors: ThemeColors = {
  primary: '#0A84FF',
  secondary: '#30D158',
  accent: '#FF9F0A',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
};

const baseTheme = {
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};

export const lightTheme: Theme = {
  ...baseTheme,
  colors: lightColors,
};

export const darkTheme: Theme = {
  ...baseTheme,
  colors: darkColors,
};

// Utility functions
export const getSpacing = (size: keyof Theme['spacing']) => lightTheme.spacing[size];
export const getFontSize = (scale: number) => 14 + scale * 2;
export const getLineHeight = (fontSize: number) => Math.round(fontSize * 1.5);