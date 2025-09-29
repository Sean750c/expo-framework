import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useWalletStore } from '@/src/store/walletStore';
import { useVipStore } from '@/src/store/vipStore';
import { useNotificationStore } from '@/src/store/notificationStore';
import { useRequest } from '@/src/hooks/useRequest';
import { useAppConfig } from '@/src/hooks/useAppConfig';
import { Button } from '@/src/components/common/Button';
import { Loading } from '@/src/components/common/Loading';
import { EmptyState } from '@/src/components/common/EmptyState';
import { AuthGuard } from '@/src/guards/AuthGuard';
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
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: theme.colors.text }]}>
                Hello, {user?.name || 'User'}!
              </Text>
              <Text style={[styles.welcomeMessage, { color: theme.colors.textSecondary }]}>
                Turn your gift cards into cash
              </Text>
            </View>
            
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Bell size={20} color={theme.colors.text} />
                  <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Wallet Overview */}
        {wallet && (
          <View style={[styles.walletCard, { backgroundColor: theme.colors.primary }]}>
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
          </View>
        )}

        {/* VIP Status */}
        {userVip && (
          <View style={[styles.vipCard, { backgroundColor: theme.colors.surface }]}>
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
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/(tabs)/giftcards' as any)}
            >
              <Gift size={24} color={theme.colors.primary} />
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                Browse Cards
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                View supported cards
              </Text>
            </TouchableOpacity>
            
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
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Button
            title="Start Selling Gift Cards"
            onPress={() => router.push('/sell-card' as any)}
            size="large"
            style={styles.ctaButton}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeMessage: {
    fontSize: 16,
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