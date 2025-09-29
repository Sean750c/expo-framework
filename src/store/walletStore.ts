import { create } from 'zustand';
import { Wallet, WithdrawalMethod, WithdrawalRequest, Transaction } from '@/src/types/wallet';
import { WalletService } from '@/src/api/walletService';
import { logger } from '@/src/utils/logger';

interface WalletStore {
  wallet: Wallet | null;
  withdrawalMethods: WithdrawalMethod[];
  withdrawalHistory: WithdrawalRequest[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchWallet: (userId: string) => Promise<void>;
  fetchWithdrawalMethods: () => Promise<void>;
  fetchWithdrawalHistory: (userId: string) => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  requestWithdrawal: (request: Omit<WithdrawalRequest, 'id' | 'status' | 'requestedAt'>) => Promise<WithdrawalRequest>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallet: null,
  withdrawalMethods: [],
  withdrawalHistory: [],
  transactions: [],
  loading: false,
  error: null,

  fetchWallet: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const wallet = await WalletService.getWallet(userId);
      set({ wallet, loading: false });
      logger.info('Wallet fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch wallet:', error);
    }
  },

  fetchWithdrawalMethods: async () => {
    try {
      set({ loading: true, error: null });
      const withdrawalMethods = await WalletService.getWithdrawalMethods();
      set({ withdrawalMethods, loading: false });
      logger.info('Withdrawal methods fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch withdrawal methods:', error);
    }
  },

  fetchWithdrawalHistory: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const withdrawalHistory = await WalletService.getWithdrawalHistory(userId);
      set({ withdrawalHistory, loading: false });
      logger.info('Withdrawal history fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch withdrawal history:', error);
    }
  },

  fetchTransactions: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const transactions = await WalletService.getTransactions(userId);
      set({ transactions, loading: false });
      logger.info('Transactions fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch transactions:', error);
    }
  },

  requestWithdrawal: async (request) => {
    try {
      set({ loading: true, error: null });
      const withdrawalRequest = await WalletService.requestWithdrawal(request);
      set(state => ({
        withdrawalHistory: [withdrawalRequest, ...state.withdrawalHistory],
        loading: false
      }));
      logger.info('Withdrawal requested successfully');
      return withdrawalRequest;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to request withdrawal:', error);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),
}));