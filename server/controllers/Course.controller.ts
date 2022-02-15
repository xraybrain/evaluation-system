import { Request, Response } from 'express';
import {
  CreateCourseRequest,
  DeleteCourseRequest,
  UpdateCourseRequest,
} from 'server/models/Course.model';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateCourseSchema,
  DeleteCourseSchema,
  UpdateCourseSchema,
} from 'server/models/schema/Course.schema';
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from 'server/services/Course.service';
import { validator } from 'server/utils/yup.util';

export const createCourseController = async (req: Request, res: Response) => {
  const request: CreateCourseRequest = req.body;
  const validation = await validator(CreateCourseSchema, request);
  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createCourse(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getCourseController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getCourse(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getCoursesController = async (req: Request, res: Response) => {
  const { search, tid } = req.query;
  const page = Number(req.query['page']) || 1;
  const teacherId = tid ? Number(tid) : undefined;
  const query = search ? `${search}` : undefined;
  console.log(typeof tid, search);
  let feedback = await getCourses(page, query, teacherId);
  res.json(feedback);
};

export const updateCourseController = async (req: Request, res: Response) => {
  const request: UpdateCourseRequest = req.body;
  const validation = await validator(UpdateCourseSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateCourse(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteCourseController = async (req: Request, res: Response) => {
  const request: DeleteCourseRequest = req.body;
  const validation = await validator(DeleteCourseSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteCourse(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
