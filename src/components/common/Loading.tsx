import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  text,
  overlay = false,
}) => {
  const { theme } = useTheme();

  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    { backgroundColor: overlay ? 'rgba(0,0,0,0.5)' : 'transparent' },
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {text && (
        <Text style={[styles.text, { color: overlay ? '#FFFFFF' : theme.colors.text }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
});