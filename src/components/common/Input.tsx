import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helperText,
  containerStyle,
  required = false,
  style,
  ...props
}, ref) => {
  const { theme } = useTheme();

  const inputStyles = [
    styles.input,
    {
      borderColor: error ? theme.colors.error : theme.colors.border,
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
    },
    props.editable === false && {
      backgroundColor: theme.colors.surface,
      color: theme.colors.textSecondary,
    },
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      )}
      
      <TextInput
        ref={ref}
        style={inputStyles}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />
      
      {(error || helperText) && (
        <Text 
          style={[
            styles.helperText,
            { color: error ? theme.colors.error : theme.colors.textSecondary }
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 44,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});