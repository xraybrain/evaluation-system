import { Quiz } from '@prisma/client';

export interface CreateQuestionRequest {
  question: string;
  answer: string;
  timeout: number;
  score: number;
  quizId: number;
  options: string[];
}

export interface UpdateQuestionRequest {
  id: number;
  question?: string;
  answer?: string;
  timeout?: number;
  score?: number;
}

export interface Question {
  id: number;
  question: string;
  answer?: string;
  timeout: number;
  score: number;
  quizId: number;
  quiz: Quiz;
  createdAt: string;
  updatedAt: string;
}
