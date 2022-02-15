import { Request, Response } from 'express';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateQuizRequest,
  DeleteQuizRequest,
  UpdateQuizRequest,
} from 'server/models/Quiz.model';
import {
  CreateQuizSchema,
  DeleteQuizSchema,
  UpdateQuizSchema,
} from 'server/models/schema/Quiz.schema';
import {
  createQuiz,
  deleteQuiz,
  getQuiz,
  getQuizes,
  updateQuiz,
} from 'server/services/Quiz.service';
import { validator } from 'server/utils/yup.util';

export const createQuizController = async (req: Request, res: Response) => {
  const request: CreateQuizRequest = req.body;
  const validation = await validator(CreateQuizSchema, request);
  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createQuiz(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getQuizController = async (req: Request, res: Response) => {
  const { id, token } = req.query;
  let feedback: Feedback;
  if (id) {
    feedback = await getQuiz({ id: Number(id), deletedAt: { equals: null } });
  } else if (token) {
    feedback = await getQuiz({ token, deletedAt: { equals: null } });
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getQuizesController = async (req: Request, res: Response) => {
  const { search, tid } = req.query;
  const page = Number(req.query['page']) || 1;
  const topicId = tid ? Number(tid) : 0;
  let feedback = await getQuizes(page, topicId, `${search}`);
  res.json(feedback);
};

export const updateQuizController = async (req: Request, res: Response) => {
  const request: UpdateQuizRequest = req.body;
  const validation = await validator(UpdateQuizSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateQuiz(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteQuizController = async (req: Request, res: Response) => {
  const request: DeleteQuizRequest = req.body;
  const validation = await validator(DeleteQuizSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteQuiz(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
