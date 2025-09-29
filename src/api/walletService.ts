import { apiClient } from './client';
import { Wallet, WithdrawalMethod, WithdrawalRequest, Transaction } from '@/src/types/wallet';

export class WalletService {
  /**
   * 获取用户钱包信息
   */
  static async getWallet(userId: string): Promise<Wallet> {
    // TODO: 实现API调用
    // const response = await apiClient.get<Wallet>(`/wallet/${userId}`);
    // return response.data;
    
    return {
      id: '1',
      userId,
      balance: 1250.50,
      currency: 'USD',
      frozenBalance: 150.00,
      totalEarnings: 5420.75,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * 获取提现方式
   */
  static async getWithdrawalMethods(): Promise<WithdrawalMethod[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<WithdrawalMethod[]>('/wallet/withdrawal-methods');
    // return response.data;
    
    return [
      {
        id: '1',
        type: 'bank',
        name: 'Bank Transfer',
        accountInfo: {},
        isActive: true,
        minAmount: 50,
        maxAmount: 10000,
        fee: 2.5,
        processingTime: '1-3 business days'
      },
      {
        id: '2',
        type: 'usdt',
        name: 'USDT (TRC20)',
        accountInfo: {},
        isActive: true,
        minAmount: 20,
        maxAmount: 50000,
        fee: 1.0,
        processingTime: '10-30 minutes'
      }
    ];
  }

  /**
   * 请求提现
   */
  static async requestWithdrawal(request: Omit<WithdrawalRequest, 'id' | 'status' | 'requestedAt'>): Promise<WithdrawalRequest> {
    // TODO: 实现API调用
    // const response = await apiClient.post<WithdrawalRequest>('/wallet/withdraw', request);
    // return response.data;
    
    return {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      requestedAt: new Date().toISOString()
    };
  }

  /**
   * 获取交易历史
   */
  static async getTransactions(userId: string, page = 1, limit = 20): Promise<Transaction[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<Transaction[]>(`/wallet/transactions/${userId}?page=${page}&limit=${limit}`);
    // return response.data;
    
    return [];
  }

  /**
   * 获取提现历史
   */
  static async getWithdrawalHistory(userId: string): Promise<WithdrawalRequest[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<WithdrawalRequest[]>(`/wallet/withdrawals/${userId}`);
    // return response.data;
    
    return [];
  }
}