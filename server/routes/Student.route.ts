import { Application } from 'express';
import {
  createStudentController,
  deleteStudentController,
  getStudentController,
  getStudentsController,
  updateStudentController,
} from 'server/controllers/Student.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class StudentRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post(
      '/api/student/',
      ensureAuthenticated,
      createStudentController
    );
    this.app.get('/api/student/:id', ensureAuthenticated, getStudentController);
    this.app.get('/api/students/', ensureAuthenticated, getStudentsController);
    this.app.put('/api/student/', ensureAuthenticated, updateStudentController);
    this.app.delete(
      '/api/student',
      ensureAuthenticated,
      deleteStudentController
    );
  }
}