import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const useHaptics = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    if (Platform.OS === 'web') return;

    try {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      // Haptics not supported on this device
      console.warn('Haptics not supported:', error);
    }
  }, []);

  const triggerSelection = useCallback(() => {
    if (Platform.OS === 'web') return;
    
    try {
      Haptics.selectionAsync();
    } catch (error) {
      console.warn('Selection haptic not supported:', error);
    }
  }, []);

  return {
    triggerHaptic,
    triggerSelection,
  };
};