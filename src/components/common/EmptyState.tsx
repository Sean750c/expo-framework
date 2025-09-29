import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { Button } from './Button';
import { AnimatedView } from './AnimatedView';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  animation?: boolean;
  customContent?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  animation = true,
  customContent,
}) => {
  const { theme } = useTheme();

  const content = (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>
      
      {description && (
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      )}
      
      {customContent || (
        actionText && onAction && (
          <Button
            title={actionText}
            onPress={onAction}
            style={styles.button}
          />
        )
      )}
    </View>
  );

  if (animation) {
    return (
      <AnimatedView animation="fade" duration={400}>
        {content}
      </AnimatedView>
    );
  }

  return content;
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
});