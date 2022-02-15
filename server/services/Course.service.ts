import { PrismaClient } from '@prisma/client';
import {
  CreateCourseRequest,
  DeleteCourseRequest,
  UpdateCourseRequest,
} from 'server/models/Course.model';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';

const prisma = new PrismaClient();

export const createCourse = async (request: CreateCourseRequest) => {
  let feedback: Feedback;
  try {
    const courseCodeExists = await prisma.course.findFirst({
      where: {
        code: request.code,
        teacherId: request.teacherId,
        deletedAt: { equals: null },
      },
    });

    const courseTitleExists = await prisma.course.findFirst({
      where: {
        title: request.title,
        teacherId: request.teacherId,
        deletedAt: { equals: null },
      },
    });

    if (courseCodeExists) {
      feedback = new Feedback(false, 'Course code already exists');
    } else if (courseTitleExists) {
      feedback = new Feedback(false, 'Course title already exists');
    } else {
      feedback = new Feedback(true, 'success');
      feedback.result = await prisma.course.create({
        data: {
          code: request.code,
          title: request.title,
          teacherId: request.teacherId,
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

export const getCourse = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.course.findFirst({ where: { id } });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getCourses = async (
  page = 1,
  search?: string,
  teacherId?: number
) => {
  let feedback: Feedback;
  try {
    let filter: any = { deletedAt: { equals: null } };
    if (search) {
      filter.title = { contains: search };
    }

    if (teacherId) {
      filter.teacherId = { equals: teacherId };
    }

    let totalPages = await prisma.course.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.course.findMany({
      where: filter,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { code: 'asc' },
    });
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateCourse = async (request: UpdateCourseRequest) => {
  let feedback: Feedback;
  try {
    await prisma.course.update({
      data: { title: request.title, code: request.code },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteCourse = async (request: DeleteCourseRequest) => {
  let feedback: Feedback;
  try {
    await prisma.course.update({
      data: { deletedAt: new Date() },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
