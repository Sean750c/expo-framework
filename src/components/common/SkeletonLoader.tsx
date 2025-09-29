import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@/src/hooks/useTheme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { theme } = useTheme();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, [animatedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedValue.value, [0, 1], [0.3, 0.7]);
    return { opacity };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.border,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: theme.colors.surface,
            borderRadius,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

// Pre-configured skeleton components
export const SkeletonText: React.FC<{ lines?: number; lastLineWidth?: string }> = ({
  lines = 1,
  lastLineWidth = '60%',
}) => (
  <View style={styles.textContainer}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader
        key={index}
        height={16}
        width={index === lines - 1 ? lastLineWidth : '100%'}
        style={{ marginBottom: index < lines - 1 ? 8 : 0 }}
      />
    ))}
  </View>
);

export const SkeletonCard: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.cardHeader}>
        <SkeletonLoader width={40} height={40} borderRadius={8} />
        <View style={styles.cardInfo}>
          <SkeletonLoader width="70%" height={16} />
          <SkeletonLoader width="50%" height={12} style={{ marginTop: 4 }} />
        </View>
        <SkeletonLoader width={60} height={24} borderRadius={12} />
      </View>
      <View style={styles.cardFooter}>
        <SkeletonLoader width="40%" height={12} />
        <SkeletonLoader width={50} height={28} borderRadius={6} />
      </View>
    </View>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <View style={styles.list}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </View>
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <SkeletonLoader width={size} height={size} borderRadius={size / 2} />
);

export const SkeletonButton: React.FC = () => (
  <SkeletonLoader width="100%" height={44} borderRadius={8} />
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 20,
  },
});