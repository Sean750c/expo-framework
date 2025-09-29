import { apiClient } from './client';
import { VipLevel, UserVip, Task, UserTask } from '@/src/types/vip';

export class VipService {
  /**
   * 获取所有VIP等级
   */
  static async getVipLevels(): Promise<VipLevel[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<VipLevel[]>('/vip/levels');
    // return response.data;
    
    return [
      {
        id: '1',
        level: 1,
        name: 'Bronze',
        minPoints: 0,
        benefits: {
          rateBonus: 0,
          prioritySupport: false,
          fasterProcessing: false,
          lowerWithdrawalFee: 0
        },
        color: '#CD7F32',
        icon: '🥉'
      },
      {
        id: '2',
        level: 2,
        name: 'Silver',
        minPoints: 1000,
        benefits: {
          rateBonus: 0.02,
          prioritySupport: false,
          fasterProcessing: false,
          lowerWithdrawalFee: 0.5
        },
        color: '#C0C0C0',
        icon: '🥈'
      },
      {
        id: '3',
        level: 3,
        name: 'Gold',
        minPoints: 5000,
        benefits: {
          rateBonus: 0.05,
          prioritySupport: true,
          fasterProcessing: true,
          lowerWithdrawalFee: 1.0
        },
        color: '#FFD700',
        icon: '🥇'
      }
    ];
  }

  /**
   * 获取用户VIP信息
   */
  static async getUserVip(userId: string): Promise<UserVip> {
    // TODO: 实现API调用
    // const response = await apiClient.get<UserVip>(`/vip/user/${userId}`);
    // return response.data;
    
    return {
      userId,
      currentLevel: 2,
      currentPoints: 2350,
      nextLevelPoints: 5000,
      totalTransactions: 45,
      totalVolume: 12500.75
    };
  }

  /**
   * 获取可用任务
   */
  static async getTasks(): Promise<Task[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<Task[]>('/vip/tasks');
    // return response.data;
    
    return [
      {
        id: '1',
        title: 'Daily Check-in',
        description: 'Check in daily to earn points',
        type: 'daily',
        points: 10,
        requirements: { action: 'checkin' },
        isActive: true
      },
      {
        id: '2',
        title: 'First Transaction',
        description: 'Complete your first gift card transaction',
        type: 'one_time',
        points: 100,
        requirements: { minTransactions: 1 },
        isActive: true
      }
    ];
  }

  /**
   * 获取用户任务状态
   */
  static async getUserTasks(userId: string): Promise<UserTask[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<UserTask[]>(`/vip/user-tasks/${userId}`);
    // return response.data;
    
    return [];
  }

  /**
   * 完成任务
   */
  static async completeTask(userId: string, taskId: string): Promise<UserTask> {
    // TODO: 实现API调用
    // const response = await apiClient.post<UserTask>('/vip/complete-task', { userId, taskId });
    // return response.data;
    
    return {
      id: Date.now().toString(),
      userId,
      taskId,
      status: 'completed',
      progress: 1,
      maxProgress: 1,
      completedAt: new Date().toISOString()
    };
  }
}