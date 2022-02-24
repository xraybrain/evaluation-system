import { Answer, PrismaClient, Question, Student, User } from '@prisma/client';
import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import {
  CreateQuestionOptionRequest,
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
  user: User & { student: Student },
  search?: string,
  paginate = true,
  time = 0
) => {
  let feedback: Feedback;
  try {
    let filter: any = { deletedAt: { equals: null }, quizId };
    if (search && search !== 'undefined') {
      filter.question = { contains: search };
    }

    if (time > 0) {
      let date = new Date(time);
      filter.createdAt = { gte: date };
    }

    const query: any = {
      where: filter,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        question: true,
        score: user.type !== UserType.Student,
        answer: user.type !== UserType.Student,
        timeout: true,
        options: true,
        quiz: true,
        quizId: true,
        createdAt: true,
      },
    };

    feedback = new Feedback(true, 'success');
    if (paginate) {
      let totalPages = await prisma.question.count({ where: filter });
      let pagination = new Pagination(page, 20, totalPages);
      query.skip = pagination.skip;
      query.take = pagination.take;
      feedback.page = pagination.page;
      feedback.pages = pagination.totalPages;
    }

    let questions: Question[] = [];
    if (user.type === UserType.Student && time === 0) {
      questions = await Promise.all(
        (
          await prisma.question.findMany(query)
        ).filter(async (d) => {
          const answer = await prisma.answer.findFirst({
            where: { questionId: d.id, studentId: user.student.id },
          });
          return answer === null;
        })
      );
      console.log(JSON.stringify(questions, null, 2));
    } else {
      questions = await prisma.question.findMany(query);
    }
    feedback.results = questions;
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

export const createQuestionOption = async (
  request: CreateQuestionOptionRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    const newQuestion = await prisma.option.create({
      data: {
        option: request.option,
        questionId: request.questionId,
      },
    });
    feedback.result = newQuestion;
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `added new question record'`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateQuestionOption = async (
  request: UpdateQuestionOptionRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const updated = await prisma.option.update({
      data: {
        option: request.option,
      },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `updated question (${updated.id}) record'`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteQuestionOption = async (
  request: DeleteQuestionOptionRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const deleted = await prisma.option.delete({
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `deleted question (${deleted.id}) record'`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
