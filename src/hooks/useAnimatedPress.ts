import { useCallback } from 'react';
import { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  runOnJS 
} from 'react-native-reanimated';
import { useHaptics } from './useHaptics';

interface UseAnimatedPressOptions {
  scaleValue?: number;
  duration?: number;
  hapticFeedback?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy';
}

export const useAnimatedPress = (
  onPress?: () => void,
  options: UseAnimatedPressOptions = {}
) => {
  const {
    scaleValue = 0.95,
    duration = 150,
    hapticFeedback = true,
    hapticType = 'light'
  } = options;

  const { triggerHaptic } = useHaptics();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(scaleValue, {
      damping: 15,
      stiffness: 300,
    });
    opacity.value = withTiming(0.8, { duration: duration / 2 });
    
    if (hapticFeedback) {
      runOnJS(triggerHaptic)(hapticType);
    }
  }, [scale, opacity, scaleValue, duration, hapticFeedback, hapticType, triggerHaptic]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    opacity.value = withTiming(1, { duration: duration / 2 });
  }, [scale, opacity, duration]);

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
    handlePress,
  };
};