import { apiClient } from './client';
import { AppNotification, NotificationSettings } from '@/src/types/notification';

export class NotificationService {
  /**
   * 获取用户通知
   */
  static async getNotifications(userId: string, page = 1, limit = 20): Promise<AppNotification[]> {
    // TODO: 实现API调用
    // const response = await apiClient.get<AppNotification[]>(`/notifications/${userId}?page=${page}&limit=${limit}`);
    // return response.data;
    
    return [
      {
        id: '1',
        userId,
        title: 'Order Approved',
        message: 'Your Amazon gift card order has been approved and payment is being processed.',
        type: 'order_update',
        data: { orderId: '12345' },
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        userId,
        title: 'Payment Completed',
        message: '$85.00 has been added to your wallet.',
        type: 'payment',
        data: { amount: 85.00 },
        isRead: true,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }

  /**
   * 标记通知为已读
   */
  static async markAsRead(notificationId: string): Promise<void> {
    // TODO: 实现API调用
    // await apiClient.patch(`/notifications/${notificationId}/read`);
  }

  /**
   * 获取通知设置
   */
  static async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    // TODO: 实现API调用
    // const response = await apiClient.get<NotificationSettings>(`/notifications/settings/${userId}`);
    // return response.data;
    
    return {
      userId,
      orderUpdates: true,
      paymentNotifications: true,
      promotions: true,
      systemMessages: true,
      pushEnabled: true,
      emailEnabled: true
    };
  }

  /**
   * 更新通知设置
   */
  static async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    // TODO: 实现API调用
    // const response = await apiClient.put<NotificationSettings>('/notifications/settings', settings);
    // return response.data;
    
    return settings;
  }

  /**
   * 注册推送通知令牌
   */
  static async registerPushToken(userId: string, token: string): Promise<void> {
    // TODO: 实现API调用
    // await apiClient.post('/notifications/register-token', { userId, token });
  }
}