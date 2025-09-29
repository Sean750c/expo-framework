export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  frozenBalance: number;
  totalEarnings: number;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalMethod {
  id: string;
  type: 'bank' | 'usdt' | 'paypal' | 'crypto';
  name: string;
  accountInfo: Record<string, any>;
  isActive: boolean;
  minAmount: number;
  maxAmount: number;
  fee: number;
  processingTime: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: WithdrawalMethod;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  rejectionReason?: string;
  transactionId?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}