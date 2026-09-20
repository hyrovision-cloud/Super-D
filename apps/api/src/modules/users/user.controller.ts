import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';

export class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter: Record<string, any> = { ...req.scopeFilter };
      if (req.query.role && req.query.role !== 'all') {
        filter.roles = req.query.role;
      }
      if (req.query.status && req.query.status !== 'all') {
        filter.status = req.query.status;
      }

      const users = await userService.getAllUsers(filter);
      res.json({
        data: users,
        meta: { totalItems: users.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.userId);
      res.json({ data: user, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ data: user, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUserStatus(req.params.userId, 'ACTIVE');
      res.json({ data: user, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async disableUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUserStatus(req.params.userId, 'DISABLED');
      await userService.revokeSessions(req.params.userId);
      res.json({ data: user, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async revokeSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.revokeSessions(req.params.userId);
      res.json({
        data: { message: 'All user sessions successfully revoked.' },
        meta: { requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
