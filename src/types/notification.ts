export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order_update' | 'payment' | 'system' | 'promotion' | 'vip';
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  userId: string;
  orderUpdates: boolean;
  paymentNotifications: boolean;
  promotions: boolean;
  systemMessages: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}