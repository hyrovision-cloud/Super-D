import { Request, Response, NextFunction } from 'express';
import { NotificationModel } from '../../common/events/eventBus';
import { NotFoundError } from '../../common/errors/AppError';

export class NotificationController {
  async getUserNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const notifications = await NotificationModel.find({
        $or: [
          { recipientUserId: userId },
          { recipientUserId: req.user?.email },
          { recipientUserId: 'all' },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(50);

      const unreadCount = notifications.filter((n) => !n.isRead).length;

      res.json({
        data: {
          notifications,
          unreadCount,
        },
        meta: { totalItems: notifications.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await NotificationModel.findByIdAndUpdate(
        req.params.notificationId,
        { $set: { isRead: true, readAt: new Date() } },
        { new: true }
      );

      if (!notification) {
        throw new NotFoundError('Notification', req.params.notificationId);
      }

      res.json({ data: notification, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      await NotificationModel.updateMany(
        {
          $or: [
            { recipientUserId: userId },
            { recipientUserId: req.user?.email },
            { recipientUserId: 'all' },
          ],
          isRead: false,
        },
        { $set: { isRead: true, readAt: new Date() } }
      );

      res.json({
        data: { message: 'All notifications marked as read.' },
        meta: { requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const notificationController = new NotificationController();
