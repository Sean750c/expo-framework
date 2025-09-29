import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AnimatedView, SlideUpView } from '@/src/components/common/AnimatedView';
import { registerSchema } from '@/src/utils/validation';
import { RegisterRequest } from '@/src/types';
import { UserPlus } from 'lucide-react-native';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  recommendCode?: string;
}

export default function RegisterScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerParams: RegisterRequest = {
        register_type: '1', // Email registration
        country_id: '1', // Default country ID
        username: data.username,
        password: data.password,
        email: data.email,
        recommend_code: data.recommendCode,
      };

      await register(registerParams);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please check your information and try again.');
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader 
        title="Create Account"
        subtitle="Join us today"
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Registration Form */}
        <SlideUpView delay={100} style={styles.formContainer}>
          <AnimatedView animation="bounce" delay={200} style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
              <UserPlus size={32} color="#FFFFFF" />
            </View>
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={300}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  placeholder="Choose a username"
                  autoCapitalize="none"
                  required
                />
              )}
            />
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={400}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  required
                />
              )}
            />
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={500}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  placeholder="Create a password"
                  secureTextEntry
                  required
                />
              )}
            />
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={600}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  placeholder="Confirm your password"
                  secureTextEntry
                  required
                />
              )}
            />
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={700}>
            <Controller
              control={control}
              name="recommendCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Referral Code (Optional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.recommendCode?.message}
                  placeholder="Enter referral code if you have one"
                  autoCapitalize="none"
                />
              )}
            />
          </AnimatedView>

          <AnimatedView animation="bounce" delay={800}>
            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={!isValid}
              style={styles.registerButton}
            />
          </AnimatedView>
        </SlideUpView>

        {/* Footer */}
        <AnimatedView animation="fade" delay={900} style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <Button
            title="Sign In"
            onPress={navigateToLogin}
            variant="ghost"
            size="small"
          />
        </AnimatedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    marginBottom: 32,
  },
  registerButton: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 14,
  },
});