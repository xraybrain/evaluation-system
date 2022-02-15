import { Application } from 'express';
import {
  createAnswerController,
  getAnswerController,
  getAnswersController,
} from 'server/controllers/Answer.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class AnswerRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post('/api/answer/', ensureAuthenticated, createAnswerController);
    this.app.get('/api/answer/:id', ensureAuthenticated, getAnswerController);
    this.app.get('/api/answers/', ensureAuthenticated, getAnswersController);
  }
}
