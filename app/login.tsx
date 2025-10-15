import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useGoogleAuth } from '@/src/hooks/useGoogleAuth';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AnimatedView, SlideUpView } from '@/src/components/common/AnimatedView';
import { loginSchema } from '@/src/utils/validation';
import { User, Lock } from 'lucide-react-native';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithCode, signInWithIdToken } = useGoogleAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader 
        title="Welcome Back"
        subtitle="Sign in to your account"
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Login Form */}
        <SlideUpView delay={100} style={styles.formContainer}>
          <AnimatedView animation="bounce" delay={200} style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
              <User size={32} color="#FFFFFF" />
            </View>
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={300}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Username/Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  placeholder="Enter your username or email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  required
                />
              )}
            />
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={400}>
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
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  required
                />
              )}
            />
          </AnimatedView>

          <AnimatedView animation="bounce" delay={500}>
            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={!isValid}
              style={styles.loginButton}
            />
          </AnimatedView>

          <AnimatedView animation="fade" delay={550} style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
              OR
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={600}>
            <Button
              title="Sign in with Google (Code)"
              onPress={signInWithCode}
              variant="outline"
              style={styles.googleButton}
            />
          </AnimatedView>

          <AnimatedView animation="slideUp" delay={650}>
            <Button
              title="Sign in with Google (ID Token)"
              onPress={signInWithIdToken}
              variant="outline"
              style={styles.googleButton}
            />
          </AnimatedView>
        </SlideUpView>

        {/* Footer */}
        <AnimatedView animation="fade" delay={700} style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <Button
            title="Sign Up"
            onPress={navigateToRegister}
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
  loginButton: {
    marginTop: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    marginBottom: 12,
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