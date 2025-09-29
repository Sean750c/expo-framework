import { create } from 'zustand';
import { AppNotification, NotificationSettings } from '@/src/types/notification';
import { NotificationService } from '@/src/api/notificationService';
import { logger } from '@/src/utils/logger';

interface NotificationStore {
  notifications: AppNotification[];
  settings: NotificationSettings | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: (userId: string) => Promise<void>;
  fetchSettings: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  updateSettings: (settings: NotificationSettings) => Promise<void>;
  addNotification: (notification: AppNotification) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  settings: null,
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const notifications = await NotificationService.getNotifications(userId);
      const unreadCount = notifications.filter(n => !n.isRead).length;
      set({ notifications, unreadCount, loading: false });
      logger.info('Notifications fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch notifications:', error);
    }
  },

  fetchSettings: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const settings = await NotificationService.getNotificationSettings(userId);
      set({ settings, loading: false });
      logger.info('Notification settings fetched successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to fetch notification settings:', error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
      logger.info('Notification marked as read');
    } catch (error: any) {
      set({ error: error.message });
      logger.error('Failed to mark notification as read:', error);
    }
  },

  updateSettings: async (settings: NotificationSettings) => {
    try {
      set({ loading: true, error: null });
      const updatedSettings = await NotificationService.updateNotificationSettings(settings);
      set({ settings: updatedSettings, loading: false });
      logger.info('Notification settings updated successfully');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      logger.error('Failed to update notification settings:', error);
    }
  },

  addNotification: (notification: AppNotification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1
    }));
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),
}));