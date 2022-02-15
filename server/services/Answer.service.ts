import { PrismaClient } from '@prisma/client';
import { CreateAnswerRequest } from 'server/models/Answer.model';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';

const prisma = new PrismaClient();

export const createAnswer = async (request: CreateAnswerRequest) => {
  let feedback: Feedback;

  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.answer.create({
      data: {
        answer: request.answer,
        questionId: request.questionId,
        studentId: request.studentId,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getAnswer = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.answer.findFirst({
      where: { id },
      include: {
        Question: true,
        student: {
          include: {
            user: {
              select: {
                surname: true,
                othernames: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getAnswers = async (page = 1, search?: string) => {
  let feedback: Feedback;
  try {
    let filter: any = { deletedAt: { equals: null } };
    if (search && search !== 'undefined') {
      filter.answer = { contains: search };
    }
    let totalPages = await prisma.answer.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.answer.findMany({
      where: filter,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' },
      select: {
        Question: true,
        student: {
          include: {
            user: {
              select: {
                surname: true,
                othernames: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
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
