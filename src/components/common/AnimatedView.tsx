import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  SlideInUp,
  SlideOutUp,
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';

type AnimationType = 
  | 'fade' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight' 
  | 'scale' 
  | 'bounce';

interface AnimatedViewProps {
  children: React.ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  entering?: any;
  exiting?: any;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  animation = 'fade',
  duration = 300,
  delay = 0,
  style,
  entering,
  exiting,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const translateX = useSharedValue(20);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const animateIn = () => {
      switch (animation) {
        case 'fade':
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          break;
        case 'slideUp':
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          translateY.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 300 }));
          break;
        case 'slideDown':
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          translateY.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 300 }));
          break;
        case 'slideLeft':
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          translateX.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 300 }));
          break;
        case 'slideRight':
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          translateX.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 300 }));
          break;
        case 'scale':
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 300 }));
          break;
        case 'bounce':
          opacity.value = withDelay(delay, withTiming(1, { duration }));
          scale.value = withDelay(delay, withSpring(1, { damping: 8, stiffness: 200 }));
          break;
      }
    };

    animateIn();
  }, [animation, duration, delay, opacity, translateY, translateX, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseStyle: any = { opacity: opacity.value };

    switch (animation) {
      case 'slideUp':
        baseStyle.transform = [{ translateY: translateY.value }];
        break;
      case 'slideDown':
        baseStyle.transform = [{ translateY: -translateY.value }];
        break;
      case 'slideLeft':
        baseStyle.transform = [{ translateX: translateX.value }];
        break;
      case 'slideRight':
        baseStyle.transform = [{ translateX: -translateX.value }];
        break;
      case 'scale':
      case 'bounce':
        baseStyle.transform = [{ scale: scale.value }];
        break;
    }

    return baseStyle;
  });

  // Use built-in animations if provided
  if (entering || exiting) {
    return (
      <Animated.View 
        style={[style]} 
        entering={entering} 
        exiting={exiting}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

// Pre-configured animation components
export const FadeInView: React.FC<Omit<AnimatedViewProps, 'animation'>> = (props) => (
  <AnimatedView {...props} animation="fade" />
);

export const SlideUpView: React.FC<Omit<AnimatedViewProps, 'animation'>> = (props) => (
  <AnimatedView {...props} animation="slideUp" />
);

export const ScaleInView: React.FC<Omit<AnimatedViewProps, 'animation'>> = (props) => (
  <AnimatedView {...props} animation="scale" />
);

export const BounceInView: React.FC<Omit<AnimatedViewProps, 'animation'>> = (props) => (
  <AnimatedView {...props} animation="bounce" />
);

// Built-in animation presets
export const AnimationPresets = {
  fadeIn: FadeIn.duration(300),
  fadeOut: FadeOut.duration(300),
  slideInDown: SlideInDown.duration(300),
  slideOutDown: SlideOutDown.duration(300),
  slideInUp: SlideInUp.duration(300),
  slideOutUp: SlideOutUp.duration(300),
  slideInLeft: SlideInLeft.duration(300),
  slideOutLeft: SlideOutLeft.duration(300),
  slideInRight: SlideInRight.duration(300),
  slideOutRight: SlideOutRight.duration(300),
};