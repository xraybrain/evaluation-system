import { Request, Response } from 'express';
import { CreateAnswerRequest } from 'server/models/Answer.model';
import { Feedback } from 'server/models/Feedback.model';
import { CreateAnswerSchema } from 'server/models/schema/Answer.schema';
import {
  createAnswer,
  getAnswer,
  getAnswers,
} from 'server/services/Answer.service';
import { validator } from 'server/utils/yup.util';

export const createAnswerController = async (req: Request, res: Response) => {
  const request: CreateAnswerRequest = req.body;
  const validation = await validator(CreateAnswerSchema, request);
  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createAnswer(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getAnswerController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getAnswer(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getAnswersController = async (req: Request, res: Response) => {
  const { search } = req.query;
  const page = Number(req.query['page']) || 1;
  let feedback = await getAnswers(page, `${search}`);
  res.json(feedback);
};
