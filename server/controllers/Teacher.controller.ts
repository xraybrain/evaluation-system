import { Request, Response } from 'express';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateTeacherSchema,
  DeleteTeacherSchema,
  UpdateTeacherSchema,
} from 'server/models/schema/Teacher.schema';
import {
  CreateTeacherRequest,
  DeleteTeacherRequest,
  UpdateTeacherRequest,
} from 'server/models/Teacher.model';
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
} from 'server/services/Teacher.service';
import { validator } from 'server/utils/yup.util';

export const createTeacherController = async (req: Request, res: Response) => {
  const request: CreateTeacherRequest = req.body;
  const validation = await validator(CreateTeacherSchema, request);
  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createTeacher(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getTeacherController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getTeacher(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getTeachersController = async (req: Request, res: Response) => {
  const { search } = req.query;
  const page = Number(req.query['page']) || 1;
  let feedback = await getTeachers(page, `${search}`);
  res.json(feedback);
};

export const updateTeacherController = async (req: Request, res: Response) => {
  const request: UpdateTeacherRequest = req.body;
  const validation = await validator(UpdateTeacherSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateTeacher(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteTeacherController = async (req: Request, res: Response) => {
  const request: DeleteTeacherRequest = req.body;
  const validation = await validator(DeleteTeacherSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteTeacher(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
