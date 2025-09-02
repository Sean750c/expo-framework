import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useRequest } from '@/src/hooks/useRequest';
import { apiClient } from '@/src/api/client';
import { Button } from '@/src/components/common/Button';
import { Loading } from '@/src/components/common/Loading';
import { EmptyState } from '@/src/components/common/EmptyState';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { Chrome as HomeIcon } from 'lucide-react-native';

// Mock API function for demo
const fetchHomeData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    welcomeMessage: 'Welcome to the App!',
    stats: {
      users: 1234,
      posts: 5678,
      likes: 91011,
    },
    recentActivity: [
      'User John liked your post',
      'New user registered',
      'System maintenance completed',
    ],
  };
};

const HomeContent: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  
  const {
    data: homeData,
    loading,
    error,
    execute: refetchData
  } = useRequest(fetchHomeData, { immediate: true });

  if (loading && !homeData) {
    return <Loading text="Loading home data..." />;
  }

  if (error && !homeData) {
    return (
      <EmptyState
        title="Failed to load"
        description={error.message}
        actionText="Try Again"
        onAction={refetchData}
        icon={<HomeIcon size={48} color={theme.colors.textSecondary} />}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetchData}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            Hello, {user?.name || 'User'}!
          </Text>
          <Text style={[styles.welcomeMessage, { color: theme.colors.textSecondary }]}>
            {homeData?.welcomeMessage}
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              {homeData?.stats.users.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Users
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
              {homeData?.stats.posts.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Posts
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statNumber, { color: theme.colors.accent }]}>
              {homeData?.stats.likes.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Likes
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Activity
          </Text>
          
          {homeData?.recentActivity.map((activity, index) => (
            <View
              key={index}
              style={[
                styles.activityItem,
                { backgroundColor: theme.colors.surface, borderLeftColor: theme.colors.primary }
              ]}
            >
              <Text style={[styles.activityText, { color: theme.colors.text }]}>
                {activity}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <Button
            title="Refresh Data"
            onPress={refetchData}
            loading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function HomeScreen() {
  return (
    <AuthGuard>
      <HomeContent />
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
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  activityItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  activityText: {
    fontSize: 14,
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});