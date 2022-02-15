import { PrismaClient } from '@prisma/client';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import {
  CreateTopicRequest,
  DeleteTopicRequest,
  UpdateTopicRequest,
} from 'server/models/Topic.model';

const prisma = new PrismaClient();

export const createTopic = async (request: CreateTopicRequest) => {
  let feedback: Feedback;
  try {
    const titleExists = await prisma.topic.findFirst({
      where: {
        title: request.title,
        courseId: request.courseId,
        deletedAt: { equals: null },
      },
    });

    if (titleExists) {
      feedback = new Feedback(false, 'Topic already exists in this course');
    } else {
      feedback = new Feedback(true, 'success');
      feedback.result = await prisma.topic.create({
        data: {
          title: request.title,
          description: request.description,
          courseId: request.courseId,
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

export const getTopic = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.topic.findFirst({ where: { id } });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getTopics = async (
  page = 1,
  courseId: number,
  search?: string
) => {
  let feedback: Feedback;
  try {
    let filter: any = { deletedAt: { equals: null }, courseId };
    if (search && search !== 'undefined') {
      filter.title = { contains: search };
    }
    let totalPages = await prisma.topic.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.topic.findMany({
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

export const updateTopic = async (request: UpdateTopicRequest) => {
  let feedback: Feedback;
  try {
    await prisma.topic.update({
      data: { title: request.title, description: request.description },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteTopic = async (request: DeleteTopicRequest) => {
  let feedback: Feedback;
  try {
    await prisma.topic.update({
      data: { deletedAt: new Date() },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
