import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useGiftCardStore } from '@/src/store/giftCardStore';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { Loading } from '@/src/components/common/Loading';
import { EmptyState } from '@/src/components/common/EmptyState';
import { AppHeader } from '@/src/components/common/AppHeader';
import { AnimatedView, SlideUpView } from '@/src/components/common/AnimatedView';
import { GiftCardSubmission } from '@/src/types/giftcard';
import { Clock, CheckCircle, XCircle, DollarSign, CreditCard, Search, Filter } from 'lucide-react-native';

const OrdersContent: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { submissions, loading, error, fetchSubmissions } = useGiftCardStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | GiftCardSubmission['status']>('all');

  useEffect(() => {
    if (user?.id) {
      fetchSubmissions(user.id);
    }
  }, [user?.id, fetchSubmissions]);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.giftCardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions: Array<{ label: string; value: 'all' | GiftCardSubmission['status'] }> = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Paid', value: 'paid' },
  ];

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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AppHeader title="My Orders" />
        <ScrollView style={styles.scrollView}>
      <EmptyState
        title="No Orders Yet"
        description="You haven't submitted any gift cards for recycling yet."
        actionText="Sell Your First Card"
        onAction={() => {/* Navigate to sell card */}}
        icon={<CreditCard size={48} color={theme.colors.textSecondary} />}
      />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader title="My Orders" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search and Filter */}
        <AnimatedView animation="slideUp" delay={100} style={styles.filterContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
            <Search size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search orders..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: statusFilter === option.value 
                      ? theme.colors.primary 
                      : theme.colors.surface
                  }
                ]}
                onPress={() => setStatusFilter(option.value)}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    {
                      color: statusFilter === option.value 
                        ? '#FFFFFF' 
                        : theme.colors.text
                    }
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </AnimatedView>

        {/* Orders List */}
        <SlideUpView delay={200} style={styles.ordersContainer}>
          {filteredSubmissions.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No orders match your search criteria
              </Text>
            </View>
          ) : (
            filteredSubmissions.map((submission) => (
            <AnimatedView
              key={submission.id}
              animation="slideUp"
              delay={300 + filteredSubmissions.indexOf(submission) * 100}
            >
              <TouchableOpacity
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
            </AnimatedView>
          ))}
          )}
        </SlideUpView>
      </ScrollView>
    </View>
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  statusFilters: {
    flexDirection: 'row',
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  statusChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ordersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
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