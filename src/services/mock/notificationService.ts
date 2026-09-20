import { Notification } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const notifications = mockStore.getState().notifications;
    return simulateDelay(notifications);
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    let updated: Notification | undefined;
    mockStore.setState((state) => {
      const notifications = state.notifications.map((n) => {
        if (n._id === notificationId) {
          updated = { ...n, read: true };
          return updated;
        }
        return n;
      });
      return { ...state, notifications };
    });
    if (!updated) throw new Error('Notification not found');
    return simulateDelay(updated);
  },

  async markAllAsRead(): Promise<void> {
    mockStore.setState((state) => ({
      ...state,
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
    return simulateDelay(undefined);
  },
};
