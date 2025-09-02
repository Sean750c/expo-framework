import { useColorScheme } from 'react-native';
import { useAppStore } from '@/src/store/appStore';
import { lightTheme, darkTheme } from '@/src/styles/theme';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { theme, setTheme } = useAppStore();
  
  const activeTheme = theme === 'light' ? lightTheme : darkTheme;
  const isDark = theme === 'dark';
  
  const toggleTheme = async () => {
    await setTheme(isDark ? 'light' : 'dark');
  };
  
  return {
    theme: activeTheme,
    isDark,
    toggleTheme,
    setTheme,
    systemColorScheme,
  };
};