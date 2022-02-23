import { PrismaClient } from '@prisma/client';
import { CreateAnswerRequest } from 'server/models/Answer.model';
import { Feedback } from 'server/models/Feedback.model';
import { getStudentQuizResult } from './Student.service';

const prisma = new PrismaClient();

export const createAnswer = async (request: CreateAnswerRequest) => {
  let feedback: Feedback;
  try {
    const alreadyAnswered = await prisma.answer.findFirst({
      where: { questionId: request.questionId, studentId: request.studentId },
    });
    if (alreadyAnswered) {
      feedback = new Feedback(false, 'Already answered');
    } else {
      const { id } = await prisma.answer.create({
        data: {
          answer: request.answer,
          studentId: request.studentId,
          questionId: request.questionId,
          quizId: request.quizId,
          score: await markAnswer(request.answer, request.questionId),
          createdAt: new Date(),
        },
      });
      feedback = await getStudentQuizResult(request.studentId, request.quizId);
    }
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

const markAnswer = async (answer: string, questionId: number) => {
  let score = 0;
  try {
    const question = await prisma.question.findFirst({
      where: { id: questionId },
    });
    // compare answer
    if (question) {
      let isCorrectAnswer =
        question.answer.toLowerCase() === answer.toLowerCase();
      if (isCorrectAnswer) {
        score = question.score;
      }
    }
  } catch (error) {}
  return score;
};
