import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useWalletStore } from '@/src/store/walletStore';
import { useGiftCardStore } from '@/src/store/giftCardStore';
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
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Zap,
  Award,
  Target
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
  const { submissions, giftCards, fetchSubmissions, fetchGiftCards } = useGiftCardStore();
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
      fetchSubmissions(user.id);
      fetchGiftCards();
    }
  }, [user?.id, fetchWallet, fetchUserVip, fetchNotifications, fetchSubmissions, fetchGiftCards]);

  // 计算统计数据
  const stats = {
    totalOrders: submissions.length,
    successOrders: submissions.filter(s => s.status === 'paid' || s.status === 'approved').length,
    failedOrders: submissions.filter(s => s.status === 'rejected').length,
    pendingOrders: submissions.filter(s => s.status === 'pending' || s.status === 'processing').length,
    successRate: submissions.length > 0 ? 
      Math.round((submissions.filter(s => s.status === 'paid' || s.status === 'approved').length / submissions.length) * 100) : 0,
    totalEarnings: submissions
      .filter(s => s.status === 'paid')
      .reduce((sum, s) => sum + (s.actualValue || s.estimatedValue), 0)
  };

  // 最近活动
  const recentActivities = submissions
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3);

  // 热门礼品卡
  const popularCards = giftCards
    .filter(card => card.isActive && card.rate >= 0.8)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 3);

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
        title="Home"
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
        {/* Hero Section */}
        <SlideUpView delay={50} style={[styles.heroSection, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <Text style={styles.heroGreeting}>Hello, {user?.name || 'User'}! 👋</Text>
              <Text style={styles.heroSubtitle}>Ready to turn your gift cards into cash?</Text>
            </View>
            <TouchableOpacity 
              style={styles.heroButton}
              onPress={() => router.push('/sell-card' as any)}
            >
              <Zap size={20} color={theme.colors.primary} />
              <Text style={[styles.heroButtonText, { color: theme.colors.primary }]}>
                Sell Now
              </Text>
            </TouchableOpacity>
          </View>
        </SlideUpView>

        {/* Statistics Overview */}
        <SlideUpView delay={100} style={styles.statsSection}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
            Your Statistics
          </Text>
          
          <View style={styles.statsGrid}>
            <AnimatedView animation="scale" delay={150}>
              <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Activity size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {stats.totalOrders}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Orders
                </Text>
              </View>
            </AnimatedView>

            <AnimatedView animation="scale" delay={200}>
              <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                  <CheckCircle size={20} color={theme.colors.success} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {stats.successOrders}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Successful
                </Text>
              </View>
            </AnimatedView>

            <AnimatedView animation="scale" delay={250}>
              <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                  <Clock size={20} color={theme.colors.warning} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {stats.pendingOrders}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Pending
                </Text>
              </View>
            </AnimatedView>

            <AnimatedView animation="scale" delay={300}>
              <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                  <Target size={20} color={theme.colors.accent} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {stats.successRate}%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Success Rate
                </Text>
              </View>
            </AnimatedView>
          </View>
        </SlideUpView>

        {/* Wallet Overview */}
        {wallet && (
          <SlideUpView delay={350} style={[styles.walletCard, { backgroundColor: theme.colors.primary }]}>
            <View style={styles.walletHeader}>
              <Wallet size={24} color="#FFFFFF" />
              <Text style={styles.walletTitle}>Wallet Balance</Text>
            </View>
            <Text style={styles.walletBalance}>
              ${wallet.balance.toFixed(2)}
            </Text>
            {stats.totalEarnings > 0 && (
              <Text style={styles.totalEarnings}>
                Total Earned: ${stats.totalEarnings.toFixed(2)}
              </Text>
            )}
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

        {/* Popular Gift Cards */}
        {popularCards.length > 0 && (
          <SlideUpView delay={400} style={styles.popularSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                🔥 Hot Rates
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/rates' as any)}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll}>
              {popularCards.map((card, index) => (
                <AnimatedView
                  key={card.id}
                  animation="scale"
                  delay={450 + index * 100}
                >
                  <TouchableOpacity
                    style={[styles.popularCard, { backgroundColor: theme.colors.surface }]}
                    onPress={() => router.push('/sell-card' as any)}
                  >
                    <Image source={{ uri: card.logo }} style={styles.cardLogo} />
                    <Text style={[styles.cardName, { color: theme.colors.text }]}>
                      {card.name}
                    </Text>
                    <View style={[styles.rateTag, { backgroundColor: theme.colors.success + '20' }]}>
                      <Text style={[styles.rateText, { color: theme.colors.success }]}>
                        {(card.rate * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                </AnimatedView>
              ))}
            </ScrollView>
          </SlideUpView>
        )}

        {/* Recent Activity */}
        {recentActivities.length > 0 && (
          <SlideUpView delay={500} style={styles.activitySection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Recent Activity
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/orders' as any)}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.activityList}>
              {recentActivities.map((activity, index) => (
                <AnimatedView
                  key={activity.id}
                  animation="slideLeft"
                  delay={550 + index * 100}
                >
                  <View style={[styles.activityItem, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.activityIcon}>
                      {activity.status === 'paid' || activity.status === 'approved' ? (
                        <CheckCircle size={16} color={theme.colors.success} />
                      ) : activity.status === 'rejected' ? (
                        <XCircle size={16} color={theme.colors.error} />
                      ) : (
                        <Clock size={16} color={theme.colors.warning} />
                      )}
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={[styles.activityTitle, { color: theme.colors.text }]}>
                        {activity.giftCardName}
                      </Text>
                      <Text style={[styles.activitySubtitle, { color: theme.colors.textSecondary }]}>
                        ${activity.amount} • {new Date(activity.submittedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={[
                      styles.activityStatus,
                      {
                        color: activity.status === 'paid' || activity.status === 'approved'
                          ? theme.colors.success
                          : activity.status === 'rejected'
                          ? theme.colors.error
                          : theme.colors.warning
                      }
                    ]}>
                      {activity.status === 'paid' ? 'Paid' :
                       activity.status === 'approved' ? 'Approved' :
                       activity.status === 'rejected' ? 'Rejected' :
                       'Pending'}
                    </Text>
                  </View>
                </AnimatedView>
              ))}
            </View>
          </SlideUpView>
        )}

        {/* VIP Status */}
        {userVip && (
          <AnimatedView animation="slideUp" delay={600} style={[styles.vipCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.vipHeader}>
              <Award size={20} color={theme.colors.accent} />
              <Text style={[styles.vipTitle, { color: theme.colors.text }]}>
                VIP Level {userVip.currentLevel}
              </Text>
              <View style={[styles.vipBadge, { backgroundColor: theme.colors.accent + '20' }]}>
                <Text style={[styles.vipBadgeText, { color: theme.colors.accent }]}>
                  {userVip.currentLevel === 1 ? 'Bronze' : 
                   userVip.currentLevel === 2 ? 'Silver' : 'Gold'}
                </Text>
              </View>
            </View>
            <View style={styles.vipProgress}>
              <Text style={[styles.vipPoints, { color: theme.colors.textSecondary }]}>
                {userVip.currentPoints} / {userVip.nextLevelPoints} points to next level
              </Text>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: theme.colors.accent,
                      width: `${Math.min((userVip.currentPoints / userVip.nextLevelPoints) * 100, 100)}%`
                    }
                  ]} 
                />
              </View>
            </View>
          </AnimatedView>
        )}

        {/* Quick Actions */}
        <SlideUpView delay={650} style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          
          <View style={styles.actionsGrid}>
            <AnimatedView animation="scale" delay={700}>
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
            
            <AnimatedView animation="scale" delay={750}>
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
            
            <AnimatedView animation="scale" delay={800}>
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
            
            <AnimatedView animation="scale" delay={850}>
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

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

export default function Home() {
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
  heroSection: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  heroText: {
    flex: 1,
  },
  heroGreeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  walletCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
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
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  totalEarnings: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 20,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  walletButton: {
    flex: 1,
  },
  popularSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  popularScroll: {
    paddingLeft: 20,
  },
  popularCard: {
    width: 120,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  cardLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  rateTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rateText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  activityList: {
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
  },
  activityStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  vipCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
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
    flex: 1,
  },
  vipBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vipBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  vipProgress: {
    gap: 8,
  },
  vipPoints: {
    fontSize: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
    borderRadius: 16,
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
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});