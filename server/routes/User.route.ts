import { Application } from 'express';
import {
  deleteUserActivityController,
  getUserActivitiesController,
  updateUserController,
} from 'server/controllers/User.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class UserRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.get(
      '/api/user/activities/:month',
      ensureAuthenticated,
      getUserActivitiesController
    );
    this.app.put('/api/user/', ensureAuthenticated, updateUserController);
    this.app.delete(
      '/api/user/activity',
      ensureAuthenticated,
      deleteUserActivityController
    );
  }
}
