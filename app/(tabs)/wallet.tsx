import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/store/authStore';
import { useWalletStore } from '@/src/store/walletStore';
import { AuthGuard } from '@/src/guards/AuthGuard';
import { Loading } from '@/src/components/common/Loading';
import { Button } from '@/src/components/common/Button';
import { Modal } from '@/src/components/common/Modal';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react-native';

const WalletContent: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    wallet, 
    transactions, 
    withdrawalHistory, 
    loading, 
    fetchWallet, 
    fetchTransactions, 
    fetchWithdrawalHistory 
  } = useWalletStore();
  
  const [showBalance, setShowBalance] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchWallet(user.id);
      fetchTransactions(user.id);
      fetchWithdrawalHistory(user.id);
    }
  }, [user?.id, fetchWallet, fetchTransactions, fetchWithdrawalHistory]);

  const handleWithdraw = () => {
    router.push('/withdraw' as any);
  };

  const handleAddFunds = () => {
    // Navigate to add funds or show info
    setShowTransactionModal(true);
  };

  if (loading && !wallet) {
    return <Loading text="Loading wallet..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            My Wallet
          </Text>
          <TouchableOpacity
            onPress={() => setShowBalance(!showBalance)}
            style={styles.eyeButton}
          >
            {showBalance ? (
              <Eye size={20} color={theme.colors.textSecondary} />
            ) : (
              <EyeOff size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.balanceHeader}>
            <WalletIcon size={24} color="#FFFFFF" />
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
          
          <Text style={styles.balanceAmount}>
            {showBalance ? `$${wallet?.balance.toFixed(2) || '0.00'}` : '****'}
          </Text>
          
          {wallet?.frozenBalance && wallet.frozenBalance > 0 && (
            <Text style={styles.frozenBalance}>
              Frozen: ${wallet.frozenBalance.toFixed(2)}
            </Text>
          )}
          
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.withdrawButton]}
              onPress={handleWithdraw}
            >
              <ArrowUpRight size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Withdraw</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.addFundsButton]}
              onPress={handleAddFunds}
            >
              <ArrowDownLeft size={16} color={theme.colors.primary} />
              <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
                Add Funds
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <DollarSign size={20} color={theme.colors.success} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              ${wallet?.totalEarnings.toFixed(2) || '0.00'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Total Earnings
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <TrendingUp size={20} color={theme.colors.primary} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {withdrawalHistory.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Withdrawals
            </Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => router.push('/transactions' as any)}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {transactions.length === 0 ? (
            <View style={[styles.emptyTransactions, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No transactions yet
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.slice(0, 5).map((transaction) => (
                <View
                  key={transaction.id}
                  style={[styles.transactionItem, { backgroundColor: theme.colors.surface }]}
                >
                  <View style={styles.transactionIcon}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft size={16} color={theme.colors.success} />
                    ) : (
                      <ArrowUpRight size={16} color={theme.colors.error} />
                    )}
                  </View>
                  
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionDescription, { color: theme.colors.text }]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color: transaction.type === 'credit' 
                          ? theme.colors.success 
                          : theme.colors.error
                      }
                    ]}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Recent Withdrawals */}
        <View style={styles.withdrawalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Withdrawals
            </Text>
            <TouchableOpacity onPress={() => router.push('/withdrawal-history' as any)}>
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {withdrawalHistory.length === 0 ? (
            <View style={[styles.emptyTransactions, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No withdrawals yet
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {withdrawalHistory.slice(0, 3).map((withdrawal) => (
                <View
                  key={withdrawal.id}
                  style={[styles.transactionItem, { backgroundColor: theme.colors.surface }]}
                >
                  <View style={styles.transactionIcon}>
                    <ArrowUpRight size={16} color={theme.colors.primary} />
                  </View>
                  
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionDescription, { color: theme.colors.text }]}>
                      {withdrawal.method.name}
                    </Text>
                    <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
                      {new Date(withdrawal.requestedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.withdrawalStatus}>
                    <Text style={[styles.transactionAmount, { color: theme.colors.text }]}>
                      ${withdrawal.amount.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: withdrawal.status === 'completed' 
                            ? theme.colors.success 
                            : withdrawal.status === 'rejected'
                            ? theme.colors.error
                            : theme.colors.warning
                        }
                      ]}
                    >
                      {withdrawal.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Funds Modal */}
      <Modal
        visible={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title="Add Funds"
      >
        <View style={styles.modalContent}>
          <Text style={[styles.modalText, { color: theme.colors.text }]}>
            Funds are automatically added to your wallet when your gift card orders are approved and processed.
          </Text>
          <Text style={[styles.modalSubtext, { color: theme.colors.textSecondary }]}>
            To add funds, simply sell your gift cards through our platform.
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default function WalletScreen() {
  return (
    <AuthGuard>
      <WalletContent />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  eyeButton: {
    padding: 8,
  },
  balanceCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  frozenBalance: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  withdrawButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  addFundsButton: {
    backgroundColor: '#FFFFFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  transactionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  withdrawalsSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyTransactions: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  transactionsList: {
    gap: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  withdrawalStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  modalContent: {
    paddingVertical: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  modalSubtext: {
    fontSize: 14,
    lineHeight: 20,
  },
});