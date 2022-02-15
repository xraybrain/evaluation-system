import { PrismaClient } from '@prisma/client';
import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import * as bcrypt from 'bcryptjs';
import Pagination from 'server/models/Pagination.model';
import {
  CreateStudentRequest,
  DeleteStudentRequest,
  UpdateStudentRequest,
} from 'server/models/Student.model';

const prisma = new PrismaClient();
const SALT_ROUND = Number(process.env['SALT_ROUND']);

export const createStudent = async (request: CreateStudentRequest) => {
  let feedback: Feedback;
  try {
    const emailExists = await prisma.user.findFirst({
      where: { email: request.email },
    });

    const regNoExists = await prisma.student.findFirst({
      where: { regNo: request.regNo },
    });

    if (emailExists) {
      feedback = new Feedback(false, 'Email already exists.');
    } else if (regNoExists) {
        feedback = new Feedback(false, 'RegNo already exists.');
    } else {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      const hash = bcrypt.hashSync(request.password, salt);
      const student = await prisma.user.create({
        data: {
          surname: request.surname,
          othernames: request.othernames,
          email: request.email,
          password: hash,
          type: UserType.Student,
          createdAt: new Date(),
          student: {
            create: {
              regNo: request.regNo,
              deptId: Number(request.deptId),
              levelId: Number(request.levelId),
            },
          },
        },
      });

      feedback = new Feedback(true, 'success');
      feedback.result = await prisma.student.findFirst({
        where: { userId: student.id },
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
          level: true,
        },
      });
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Failed to create account');
  }
  return feedback;
};

export const getStudent = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.student.findFirst({
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
        level: true,
      },
    });
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getStudents = async (page: number, search?: string) => {
  let feedback: Feedback;
  try {
    let filter: any = { user: { deletedAt: { equals: null } } };
    if (search && search !== 'undefined') {
      filter.user.surname = { contains: search };
      filter.user.othernames = { contains: search };
      filter.regNo = { contains: search };
    }

    let totalPages = await prisma.student.count({ where: filter });
    let pagination = new Pagination(page, 10, totalPages);

    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.student.findMany({
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

export const updateStudent = async (request: UpdateStudentRequest) => {
  let feedback: Feedback;
  try {
    await prisma.student.update({
      data: {
        regNo: request.regNo,
        levelId: request.levelId,
        deptId: request.deptId,
        user: {
          update: {
            surname: request.surname,
            othernames: request.othernames,
            email: request.email,
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

export const deleteStudent = async (request: DeleteStudentRequest) => {
  let feedback: Feedback;
  try {
    await prisma.student.update({
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
