import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useAppStore } from '@/src/store/appStore';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { Modal } from '@/src/components/common/Modal';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { profileSchema } from '@/src/utils/validation';
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Wifi, 
  WifiOff,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit3
} from 'lucide-react-native';

interface ProfileFormData {
  name: string;
  email: string;
}

const ProfileContent: React.FC = () => {
  const { theme } = useTheme();
  const { theme: currentTheme, isDark, toggleTheme } = useTheme();
  const { appState, isOnline, setOnlineStatus } = useAppStore();
  const { user, updateProfile, logout, isLoading } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleEditProfile = () => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
    });
    setShowEditModal(true);
  };

  const SettingItem: React.FC<{
    title: string;
    description?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onPress?: () => void;
    icon?: React.ReactNode;
    showArrow?: boolean;
  }> = ({ title, description, value, onValueChange, onPress, icon, showArrow = false }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingContent}>
        {icon && <View style={styles.settingIcon}>{icon}</View>}
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor="#FFFFFF"
        />
      )}
      {showArrow && (
        <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
            <User size={40} color="#FFFFFF" />
          </View>
          
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {user?.name}
          </Text>
          
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
            {user?.email}
          </Text>
          
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            size="small"
            style={styles.editButton}
          />
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Profile Information
          </Text>
          
          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Member Since
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Last Updated
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                User ID
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {user?.id}...
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Settings
          </Text>
          
          {/* Appearance */}
          <SettingItem
            title="Dark Mode"
            description="Use dark theme throughout the app"
            value={isDark}
            onValueChange={toggleTheme}
            icon={isDark ? <Moon size={20} color={theme.colors.primary} /> : <Sun size={20} color={theme.colors.primary} />}
          />

          {/* Notifications */}
          <SettingItem
            title="Notifications"
            description="Manage notification preferences"
            onPress={() => {/* Navigate to notification settings */}}
            icon={<Bell size={20} color={theme.colors.primary} />}
            showArrow
          />

          {/* Security */}
          <SettingItem
            title="Security"
            description="Password, 2FA, and security settings"
            onPress={() => {/* Navigate to security settings */}}
            icon={<Shield size={20} color={theme.colors.primary} />}
            showArrow
          />

          {/* Help */}
          <SettingItem
            title="Help & Support"
            description="FAQ, contact support, and guides"
            onPress={() => {/* Navigate to help center */}}
            icon={<HelpCircle size={20} color={theme.colors.primary} />}
            showArrow
          />
        </View>

        {/* System Info */}
        <View style={styles.systemSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            System Information
          </Text>
          
          <SettingItem
            title="Network Status"
            description={isOnline ? "Connected to internet" : "No internet connection"}
            icon={isOnline ? 
              <Wifi size={20} color={theme.colors.success} /> : 
              <WifiOff size={20} color={theme.colors.error} />
            }
          />
          
          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Version
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                1.0.0
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Build
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                1 (Debug)
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                Environment
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {__DEV__ ? 'Development' : 'Production'}
              </Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.colors.error + '20' }]}
            onPress={handleLogout}
          >
            <LogOut size={20} color={theme.colors.error} />
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        actions={[
          {
            title: 'Cancel',
            onPress: () => setShowEditModal(false),
            variant: 'ghost',
          },
          {
            title: 'Save',
            onPress: handleSubmit(onSubmit),
            variant: 'primary',
          },
        ]}
      >
        <View style={styles.modalContent}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                required
              />
            )}
          />

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
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default function ProfileScreen() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  editButton: {
    marginTop: 12,
    alignSelf: 'center',
    minWidth: 120,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  systemSection: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
  },
  arrow: {
    fontSize: 18,
    fontWeight: '300',
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    paddingVertical: 8,
  },
});