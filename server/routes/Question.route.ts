import { Application } from 'express';
import {
  createQuestionController,
  deleteQuestionController,
  deleteQuestionOptionController,
  getQuestionController,
  getQuestionsController,
  updateQuestionController,
  updateQuestionOptionController,
} from 'server/controllers/Question.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class QuestionRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post(
      '/api/question/',
      ensureAuthenticated,
      createQuestionController
    );
    this.app.get(
      '/api/question/:id',
      ensureAuthenticated,
      getQuestionController
    );
    this.app.get(
      '/api/questions/',
      ensureAuthenticated,
      getQuestionsController
    );
    this.app.put(
      '/api/question/',
      ensureAuthenticated,
      updateQuestionController
    );
    this.app.delete(
      '/api/question',
      ensureAuthenticated,
      deleteQuestionController
    );
    this.app.put(
      '/api/question/option/',
      ensureAuthenticated,
      updateQuestionOptionController
    );
    this.app.delete(
      '/api/question/option/',
      ensureAuthenticated,
      deleteQuestionOptionController
    );
  }
}
