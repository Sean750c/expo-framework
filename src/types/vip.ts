export interface VipLevel {
  id: string;
  level: number;
  name: string;
  minPoints: number;
  benefits: {
    rateBonus: number; // 额外回收比例
    prioritySupport: boolean;
    fasterProcessing: boolean;
    lowerWithdrawalFee: number;
  };
  color: string;
  icon: string;
}

export interface UserVip {
  userId: string;
  currentLevel: number;
  currentPoints: number;
  nextLevelPoints: number;
  totalTransactions: number;
  totalVolume: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'one_time';
  points: number;
  requirements: Record<string, any>;
  isActive: boolean;
  validUntil?: string;
}

export interface UserTask {
  id: string;
  userId: string;
  taskId: string;
  status: 'available' | 'in_progress' | 'completed' | 'claimed';
  progress: number;
  maxProgress: number;
  completedAt?: string;
  claimedAt?: string;
}