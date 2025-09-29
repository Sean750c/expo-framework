import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useGiftCardStore } from '@/src/store/giftCardStore';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { Loading } from '@/src/components/common/Loading';
import { EmptyState } from '@/src/components/common/EmptyState';
import { GiftCardSubmission } from '@/src/types/giftcard';
import { Clock, CheckCircle, XCircle, DollarSign, CreditCard } from 'lucide-react-native';

const OrdersContent: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { submissions, loading, error, fetchSubmissions } = useGiftCardStore();

  useEffect(() => {
    if (user?.id) {
      fetchSubmissions(user.id);
    }
  }, [user?.id, fetchSubmissions]);

  const getStatusIcon = (status: GiftCardSubmission['status']) => {
    const iconProps = { size: 20 };
    
    switch (status) {
      case 'pending':
        return <Clock {...iconProps} color={theme.colors.warning} />;
      case 'processing':
        return <Clock {...iconProps} color={theme.colors.primary} />;
      case 'approved':
        return <CheckCircle {...iconProps} color={theme.colors.success} />;
      case 'rejected':
        return <XCircle {...iconProps} color={theme.colors.error} />;
      case 'paid':
        return <DollarSign {...iconProps} color={theme.colors.success} />;
      default:
        return <Clock {...iconProps} color={theme.colors.textSecondary} />;
    }
  };

  const getStatusColor = (status: GiftCardSubmission['status']) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'processing':
        return theme.colors.primary;
      case 'approved':
      case 'paid':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: GiftCardSubmission['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'processing':
        return 'Processing';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'paid':
        return 'Paid';
      default:
        return 'Unknown';
    }
  };

  if (loading && submissions.length === 0) {
    return <Loading text="Loading orders..." />;
  }

  if (error && submissions.length === 0) {
    return (
      <EmptyState
        title="Failed to load orders"
        description={error}
        actionText="Try Again"
        onAction={() => user?.id && fetchSubmissions(user.id)}
        icon={<CreditCard size={48} color={theme.colors.textSecondary} />}
      />
    );
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        title="No Orders Yet"
        description="You haven't submitted any gift cards for recycling yet."
        actionText="Sell Your First Card"
        onAction={() => {/* Navigate to sell card */}}
        icon={<CreditCard size={48} color={theme.colors.textSecondary} />}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            My Orders
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Track your gift card transactions
          </Text>
        </View>

        {/* Orders List */}
        <View style={styles.ordersContainer}>
          {submissions.map((submission) => (
            <TouchableOpacity
              key={submission.id}
              style={[styles.orderCard, { backgroundColor: theme.colors.surface }]}
              activeOpacity={0.7}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={[styles.orderTitle, { color: theme.colors.text }]}>
                    {submission.giftCardName}
                  </Text>
                  <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(submission.status) + '20' }]}>
                  {getStatusIcon(submission.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(submission.status) }]}>
                    {getStatusText(submission.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Amount:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    ${submission.amount.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Estimated Value:
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.primary }]}>
                    ${submission.estimatedValue.toFixed(2)}
                  </Text>
                </View>

                {submission.actualValue && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                      Final Value:
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.colors.success }]}>
                      ${submission.actualValue.toFixed(2)}
                    </Text>
                  </View>
                )}

                {submission.rejectionReason && (
                  <View style={styles.rejectionReason}>
                    <Text style={[styles.rejectionText, { color: theme.colors.error }]}>
                      Reason: {submission.rejectionReason}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={[styles.orderId, { color: theme.colors.textSecondary }]}>
                  Order #{submission.id.slice(-8).toUpperCase()}
                </Text>
                {submission.processedAt && (
                  <Text style={[styles.processedDate, { color: theme.colors.textSecondary }]}>
                    Processed: {new Date(submission.processedAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function OrdersScreen() {
  return (
    <AuthGuard>
      <OrdersContent />
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  ordersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  rejectionReason: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  rejectionText: {
    fontSize: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  orderId: {
    fontSize: 12,
    fontWeight: '500',
  },
  processedDate: {
    fontSize: 12,
  },
});