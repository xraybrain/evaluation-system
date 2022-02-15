import { Request, Response } from 'express';
import {
  CreateDepartmentRequest,
  DeleteDepartmentRequest,
  UpdateDepartmentRequest,
} from 'server/models/Department.model';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateDepartmentSchema,
  DeleteDepartmentSchema,
  UpdateDepartmentSchema,
} from 'server/models/schema/Department.schema';
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
} from 'server/services/Department.service';
import { validator } from 'server/utils/yup.util';

export const createDepartmentController = async (
  req: Request,
  res: Response
) => {
  const request: CreateDepartmentRequest = req.body;
  const validation = await validator(CreateDepartmentSchema, request);
  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createDepartment(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getDepartmentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getDepartment(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getDepartmentsController = async (req: Request, res: Response) => {
  const { search } = req.query;
  const page = Number(req.query['page']) || 1;
  let feedback = await getDepartments(page, `${search}`);
  res.json(feedback);
};

export const updateDepartmentController = async (req: Request, res: Response) => {
  const request: UpdateDepartmentRequest = req.body;
  const validation = await validator(UpdateDepartmentSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateDepartment(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteDepartmentController = async (req: Request, res: Response) => {
  const request: DeleteDepartmentRequest = req.body;
  const validation = await validator(DeleteDepartmentSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteDepartment(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
