import { PrismaClient } from '@prisma/client';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import {
  CreateQuizRequest,
  DeleteQuizRequest,
  UpdateQuizRequest,
} from 'server/models/Quiz.model';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

export const createQuiz = async (request: CreateQuizRequest) => {
  let feedback: Feedback;
  try {
    const titleExists = await prisma.quiz.findFirst({
      where: {
        title: request.title,
        deletedAt: { equals: null },
      },
    });

    if (titleExists) {
      feedback = new Feedback(false, 'Quiz title already exists');
    } else {
      feedback = new Feedback(true, 'success');
      feedback.result = await prisma.quiz.create({
        data: {
          title: request.title,
          token: crypto.randomBytes(6).toString('hex'),
          topicId: request.topicId,
          createdAt: new Date(),
        },
      });
    }
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getQuiz = async (filter: any) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.quiz.findFirst({ where: filter });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getQuizes = async (page = 1, topicId: number, search?: string) => {
  let feedback: Feedback;
  try {
    let filter: any = { deletedAt: { equals: null }, topicId };
    if (search && search !== 'undefined') {
      filter.title = { contains: search };
    }
    let totalPages = await prisma.quiz.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.quiz.findMany({
      where: filter,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' },
    });
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateQuiz = async (request: UpdateQuizRequest) => {
  let feedback: Feedback;
  try {
    await prisma.quiz.update({
      data: {
        title: request.title,
        active: request.active,
        token: request.token,
      },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteQuiz = async (request: DeleteQuizRequest) => {
  let feedback: Feedback;
  try {
    await prisma.quiz.update({
      data: { deletedAt: new Date() },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
