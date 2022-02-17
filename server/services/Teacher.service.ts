import { PrismaClient } from '@prisma/client';
import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import * as bcrypt from 'bcryptjs';
import Pagination from 'server/models/Pagination.model';
import {
  CreateTeacherRequest,
  DeleteTeacherRequest,
  UpdateTeacherRequest,
} from 'server/models/Teacher.model';

const prisma = new PrismaClient();
const SALT_ROUND = Number(process.env['SALT_ROUND']);

export const createTeacher = async (request: CreateTeacherRequest) => {
  let feedback: Feedback;
  try {
    const emailExists = await prisma.user.findFirst({
      where: { email: request.email },
    });

    if (emailExists) {
      feedback = new Feedback(false, 'Email already exists.');
    } else {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      const hash = bcrypt.hashSync(request.password, salt);
      const teacher = await prisma.user.create({
        data: {
          surname: request.surname,
          othernames: request.othernames,
          email: request.email,
          password: hash,
          type: UserType.Teacher,
          createdAt: new Date(),
          teacher: {
            create: {
              deptId: Number(request.deptId),
            },
          },
        },
      });

      feedback = new Feedback(true, 'success');
      feedback.result = await prisma.teacher.findFirst({
        where: { userId: teacher.id },
        include: {
          user: {
            select: {
              surname: true,
              othernames: true,
              email: true,
              avatar: true,
              type: true,
            },
          },
          department: true,
        },
      });
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Failed to create account');
  }
  return feedback;
};

export const getTeacher = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.teacher.findFirst({
      where: { id, user: { deletedAt: { equals: null } } },
      include: {
        user: {
          select: {
            surname: true,
            othernames: true,
            avatar: true,
            email: true,
            type: true,
          },
        },
        department: true,
      },
    });
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getTeachers = async (page: number, search?: string) => {
  let feedback: Feedback;
  console.log('Searching:: ' + search);

  try {
    let filter: any = { user: { deletedAt: { equals: null } } };
    if (search && search !== 'undefined') {
      filter.user.OR = [
        { surname: { contains: search } },
        { othernames: { contains: search } },
      ];
    }

    let totalPages = await prisma.teacher.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    console.log(filter, pagination);
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.teacher.findMany({
      where: filter,
      skip: pagination.skip,
      take: pagination.take,
      include: {
        user: {
          select: {
            surname: true,
            othernames: true,
            email: true,
            avatar: true,
            id: true,
            type: true,
          },
        },
        department: true,
      },
      orderBy: { user: { surname: 'asc' } },
    });
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateTeacher = async (request: UpdateTeacherRequest) => {
  let feedback: Feedback;
  try {
    let hash: string | undefined;
    if (request.password) {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      hash = bcrypt.hashSync(request.password, salt);
    }

    await prisma.teacher.update({
      data: {
        deptId: request.deptId,
        user: {
          update: {
            surname: request.surname,
            othernames: request.othernames,
            email: request.email,
            password: hash,
          },
        },
      },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const deleteTeacher = async (request: DeleteTeacherRequest) => {
  let feedback: Feedback;
  try {
    await prisma.teacher.update({
      data: { user: { update: { deletedAt: new Date() } } },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};
