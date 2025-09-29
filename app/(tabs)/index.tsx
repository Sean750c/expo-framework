import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useWalletStore } from '@/src/store/walletStore';
import { useVipStore } from '@/src/store/vipStore';
import { useNotificationStore } from '@/src/store/notificationStore';
import { useRequest } from '@/src/hooks/useRequest';
import { useAppConfig } from '@/src/hooks/useAppConfig';
import { Button } from '@/src/components/common/Button';
import { EmptyState } from '@/src/components/common/EmptyState';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AnimatedView, SlideUpView } from '@/src/components/common/AnimatedView';
import { SkeletonLoader, SkeletonCard } from '@/src/components/common/SkeletonLoader';
import { 
  Home as HomeIcon, 
  Gift, 
  Wallet, 
  TrendingUp, 
  Bell,
  Star,
  ArrowRight,
  DollarSign
} from 'lucide-react-native';

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
  const router = useRouter();
  const { user } = useAuthStore();
  const { wallet, fetchWallet } = useWalletStore();
  const { userVip, fetchUserVip } = useVipStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const { appConfig, getContactInfo, getFeatureFlags } = useAppConfig();
  
  const {
    data: homeData,
    loading,
    error,
    execute: refetchData
  } = useRequest(fetchHomeData, { immediate: true });

  useEffect(() => {
    if (user?.id) {
      fetchWallet(user.id);
      fetchUserVip(user.id);
      fetchNotifications(user.id);
    }
  }, [user?.id, fetchWallet, fetchUserVip, fetchNotifications]);

  if (loading && !homeData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AppHeader 
          title={`Hello, ${user?.name || 'User'}!`}
          subtitle="Turn your gift cards into cash"
          showNotification
          notificationCount={unreadCount}
        />
        <View style={styles.skeletonContainer}>
          <SkeletonLoader width="100%" height={120} borderRadius={16} style={{ marginBottom: 20 }} />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader 
        title={`Hello, ${user?.name || 'User'}!`}
        subtitle="Turn your gift cards into cash"
        showNotification
        notificationCount={unreadCount}
        onNotificationPress={() => router.push('/notifications' as any)}
      />
      
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
        {/* Wallet Overview */}
        {wallet && (
          <SlideUpView delay={100} style={{ ...styles.walletCard, backgroundColor: theme.colors.primary } as ViewStyle}>
            <View style={styles.walletHeader}>
              <Wallet size={24} color="#FFFFFF" />
              <Text style={styles.walletTitle}>Wallet Balance</Text>
            </View>
            <Text style={styles.walletBalance}>
              ${wallet.balance.toFixed(2)}
            </Text>
            <View style={styles.walletActions}>
              <Button
                title="Sell Gift Card"
                onPress={() => router.push('/sell-card' as any)}
                variant="secondary"
                size="small"
                style={styles.walletButton}
              />
              <Button
                title="Withdraw"
                onPress={() => router.push('/withdraw' as any)}
                variant="outline"
                size="small"
                style={[styles.walletButton, { borderColor: '#FFFFFF' }]}
                textStyle={{ color: '#FFFFFF' }}
              />
            </View>
          </SlideUpView>
        )}

        {/* VIP Status */}
        {userVip && (
          <AnimatedView animation="slideUp" delay={200} style={{ ...styles.vipCard, backgroundColor: theme.colors.surface } as ViewStyle}>
            <View style={styles.vipHeader}>
              <Star size={20} color={theme.colors.accent} />
              <Text style={[styles.vipTitle, { color: theme.colors.text }]}>
                VIP Level {userVip.currentLevel}
              </Text>
            </View>
            <View style={styles.vipProgress}>
              <Text style={[styles.vipPoints, { color: theme.colors.textSecondary }]}>
                {userVip.currentPoints} / {userVip.nextLevelPoints} points
              </Text>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: theme.colors.accent,
                      width: `${(userVip.currentPoints / userVip.nextLevelPoints) * 100}%`
                    }
                  ]} 
                />
              </View>
            </View>
          </AnimatedView>
        )}

        {/* Quick Actions */}
        <SlideUpView delay={300} style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          
          <View style={styles.actionsGrid}>
            <AnimatedView animation="scale" delay={400}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => router.push('/(tabs)/rates' as any)}
              >
                <Gift size={24} color={theme.colors.primary} />
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                  Live Rates
                </Text>
                <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                  Check current rates
                </Text>
              </TouchableOpacity>
            </AnimatedView>
            
            <AnimatedView animation="scale" delay={500}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => router.push('/(tabs)/orders' as any)}
              >
                <TrendingUp size={24} color={theme.colors.secondary} />
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                  My Orders
                </Text>
                <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                  Track transactions
                </Text>
              </TouchableOpacity>
            </AnimatedView>
            
            <AnimatedView animation="scale" delay={600}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => router.push('/(tabs)/wallet' as any)}
              >
                <DollarSign size={24} color={theme.colors.accent} />
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                  Wallet
                </Text>
                <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                  Manage funds
                </Text>
              </TouchableOpacity>
            </AnimatedView>
            
            <AnimatedView animation="scale" delay={700}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => router.push('/help' as any)}
              >
                <Bell size={24} color={theme.colors.warning} />
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                  Help Center
                </Text>
                <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                  Get support
                </Text>
              </TouchableOpacity>
            </AnimatedView>
          </View>
        </SlideUpView>

        {/* CTA Section */}
        <AnimatedView animation="bounce" delay={800} style={styles.ctaSection}>
          <Button
            title="Start Selling Gift Cards"
            onPress={() => router.push('/sell-card' as any)}
            size="large"
            style={styles.ctaButton}
          />
        </AnimatedView>
      </ScrollView>
    </View>
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
  skeletonContainer: {
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  walletCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.9,
  },
  walletBalance: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  walletButton: {
    flex: 1,
  },
  vipCard: {
    paddingHorizontal: 20,
    marginBottom: 24,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  vipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  vipProgress: {
    gap: 8,
  },
  vipPoints: {
    fontSize: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  ctaButton: {
    borderRadius: 12,
  },
});