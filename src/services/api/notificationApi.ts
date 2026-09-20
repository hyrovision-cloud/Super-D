import { httpClient } from './httpClient';

export interface AppNotification {
  _id: string;
  recipientUserId: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'LEAVE' | 'COMPLAINT' | 'REVENUE' | 'SYSTEM' | 'OWNER_ALERT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  module: string;
  recordId?: string;
  branchId?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  async getUserNotifications(): Promise<{ notifications: AppNotification[]; unreadCount: number }> {
    return httpClient.get<{ notifications: AppNotification[]; unreadCount: number }>('/notifications');
  },

  async markAsRead(notificationId: string): Promise<AppNotification> {
    return httpClient.post<AppNotification>(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<{ message: string }> {
    return httpClient.post<{ message: string }>('/notifications/read-all');
  },
};
