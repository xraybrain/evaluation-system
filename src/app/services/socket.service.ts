import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UpdateQuestionRequest } from 'server/models/Question.model';
import { CreateAnswerRequest } from '../models/interface/Answer.interface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private readonly socket: Socket) {}

  getQuestions(quizId: number) {}
  getQuizResults(quizId: number) {}
  submitAnswer(request: CreateAnswerRequest) {}
  stopQuiz(request: UpdateQuestionRequest) {}
  startQuiz(request: UpdateQuestionRequest) {}
}
