import { Request, Response } from 'express';
import {
  CreateAdminRequest,
  DeleteAdminRequest,
  UpdateAdminRequest,
} from 'server/models/Admin.model';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateAdminSchema,
  DeleteAdminSchema,
  UpdateAdminSchema,
} from 'server/models/schema/Admin.schema';
import {
  createAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
  updateAdmin,
} from 'server/services/Admin.service';
import { validator } from 'server/utils/yup.util';

export const createAdminController = async (req: Request, res: Response) => {
  const request: CreateAdminRequest = req.body;
  const validation = await validator(CreateAdminSchema, request);
  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createAdmin(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getAdminController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getAdmin(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getAdminsController = async (req: Request, res: Response) => {
  const { search } = req.query;
  const page = Number(req.query['page']) || 1;
  let feedback = await getAdmins(page, `${search}`);
  res.json(feedback);
};

export const updateAdminController = async (req: Request, res: Response) => {
  const request: UpdateAdminRequest = req.body;
  const validation = await validator(UpdateAdminSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateAdmin(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteAdminController = async (req: Request, res: Response) => {
  const request: DeleteAdminRequest = req.body;
  const validation = await validator(DeleteAdminSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteAdmin(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
