import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { Modal } from '@/src/components/common/Modal';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { profileSchema } from '@/src/utils/validation';
import { User } from 'lucide-react-native';

interface ProfileFormData {
  name: string;
  email: string;
}

const ProfileContent: React.FC = () => {
  const { theme } = useTheme();
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
          
          <Text style={[styles.role, { color: theme.colors.accent }]}>
            {user?.role.toUpperCase()}
          </Text>
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
                {user?.id.slice(0, 8)}...
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="primary"
            style={styles.actionButton}
          />
          
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
            textStyle={{ color: theme.colors.error }}
          />
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
  role: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  modalContent: {
    paddingVertical: 8,
  },
});