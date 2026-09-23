import { httpClient } from './httpClient';

export interface AppNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  read: boolean;
  link?: string;
  branchId?: string;
  createdAt: string;
}

export const notificationApi = {
  async getUserNotifications(): Promise<AppNotification[]> {
    return httpClient.get<AppNotification[]>('/notifications');
  },

  async markAsRead(notificationId: string): Promise<AppNotification> {
    return httpClient.patch<AppNotification>(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<{ modifiedCount: number }> {
    return httpClient.patch<{ modifiedCount: number }>('/notifications/read-all');
  },
};
