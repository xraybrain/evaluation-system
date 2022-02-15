import { PrismaClient } from '@prisma/client';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import {
  CreateQuestionRequest,
  DeleteQuestionOptionRequest,
  DeleteQuestionRequest,
  UpdateQuestionOptionRequest,
  UpdateQuestionRequest,
} from 'server/models/Question.model';

const prisma = new PrismaClient();

export const createQuestion = async (request: CreateQuestionRequest) => {
  let feedback: Feedback;

  try {
    feedback = new Feedback(true, 'success');
    const { id } = await prisma.question.create({
      data: {
        question: request.question,
        answer: request.answer,
        timeout: request.timeout,
        score: request.score,
        quizId: request.quizId,
        options: {
          createMany: { data: request.options.map((d) => ({ option: d })) },
        },
        createdAt: new Date(),
      },
    });
    feedback.result = await prisma.question.findFirst({
      where: { id },
      include: { options: true },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getQuestion = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.question.findFirst({
      where: { id },
      include: { options: true },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getQuestions = async (
  page = 1,
  quizId: number,
  search?: string
) => {
  let feedback: Feedback;
  try {
    let filter: any = { deletedAt: { equals: null }, quizId };
    if (search && search !== 'undefined') {
      filter.question = { contains: search };
    }
    let totalPages = await prisma.question.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.question.findMany({
      where: filter,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' },
      select: {
        question: true,
        createdAt: true,
        timeout: true,
        options: true,
      },
    });
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateQuestion = async (request: UpdateQuestionRequest) => {
  let feedback: Feedback;
  try {
    await prisma.question.update({
      data: {
        question: request.question,
        answer: request.answer,
        timeout: request.timeout,
        score: request.score,
      },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteQuestion = async (request: DeleteQuestionRequest) => {
  let feedback: Feedback;
  try {
    await prisma.question.update({
      data: { deletedAt: new Date() },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};



export const updateQuestionOption = async (request: UpdateQuestionOptionRequest) => {
  let feedback: Feedback;
  try {
    await prisma.option.update({
      data: {
        option: request.option
      },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteQuestionOption = async (request: DeleteQuestionOptionRequest) => {
  let feedback: Feedback;
  try {
    await prisma.option.delete({
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

