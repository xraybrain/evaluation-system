import { PrismaClient } from '@prisma/client';
import {
  CreateDepartmentRequest,
  DeleteDepartmentRequest,
  UpdateDepartmentRequest,
} from 'server/models/Department.model';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';

const prisma = new PrismaClient();

export const createDepartment = async (request: CreateDepartmentRequest) => {
  let feedback: Feedback;
  try {
    const departmentExists = await prisma.department.findFirst({
      where: { name: request.name, deletedAt: { equals: null } },
    });

    if (!departmentExists) {
      feedback = new Feedback(true, 'success');
      feedback.result = await prisma.department.create({
        data: { name: request.name, createdAt: new Date() },
      });
    } else {
      feedback = new Feedback(false, 'Department already exists');
    }
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getDepartment = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.department.findFirst({ where: { id } });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getDepartments = async (page = 1, search?: string) => {
  let feedback: Feedback;
  try {
    let filter: any = { deletedAt: { equals: null } };
    if (search && search !== 'undefined') {
      filter.name = { contains: search };
    }
    let totalPages = await prisma.department.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.department.findMany({
      where: filter,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { name: 'asc' },
    });
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateDepartment = async (request: UpdateDepartmentRequest) => {
  let feedback: Feedback;
  try {
    await prisma.department.update({
      data: { name: request.name },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteDepartment = async (request: DeleteDepartmentRequest) => {
  let feedback: Feedback;
  try {
    await prisma.department.update({
      data: { deletedAt: new Date() },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
