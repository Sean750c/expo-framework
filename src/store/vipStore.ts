import { create } from 'zustand';
import { VipLevel, UserVip, Task, UserTask } from '@/src/types/vip';
import { VipService } from '@/src/api/vipService';
import { logger } from '@/src/utils/logger';

interface VipStore {
  vipLevels: VipLevel[];
  userVip: UserVip | null;
  tasks: Task[];
  userTasks: UserTask[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchVipLevels: () => Promise<void>;
  fetchUserVip: (userId: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchUserTasks: (userId: string) => Promise<void>;
  completeTask: (userId: string, taskId: string) => Promise<UserTask>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useVipStore = create<VipStore>((set, get) => ({
  vipLevels: [],
  userVip: null,
  tasks: [],
  userTasks: [],
  loading: false,
  error: null,

  fetchVipLevels: async () => {
    try {
      set({ loading: true, error: null });
      const vipLevels = await VipService.getVipLevels();
      set({ vipLevels, loading: false });
      logger.info('VIP levels fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch VIP levels:', error);
    }
  },

  fetchUserVip: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const userVip = await VipService.getUserVip(userId);
      set({ userVip, loading: false });
      logger.info('User VIP info fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch user VIP info:', error);
    }
  },

  fetchTasks: async () => {
    try {
      set({ loading: true, error: null });
      const tasks = await VipService.getTasks();
      set({ tasks, loading: false });
      logger.info('Tasks fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch tasks:', error);
    }
  },

  fetchUserTasks: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const userTasks = await VipService.getUserTasks(userId);
      set({ userTasks, loading: false });
      logger.info('User tasks fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch user tasks:', error);
    }
  },

  completeTask: async (userId: string, taskId: string) => {
    try {
      set({ loading: true, error: null });
      const completedTask = await VipService.completeTask(userId, taskId);
      set(state => ({
        userTasks: state.userTasks.map(task => 
          task.taskId === taskId ? completedTask : task
        ),
        loading: false
      }));
      logger.info('Task completed successfully');
      return completedTask;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to complete task:', error);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),
}));