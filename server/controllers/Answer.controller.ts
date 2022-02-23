import { Request, Response } from 'express';
import { CreateAnswerRequest } from 'server/models/Answer.model';
import { Feedback } from 'server/models/Feedback.model';
import { CreateAnswerSchema } from 'server/models/schema/Answer.schema';
import { createAnswer } from 'server/services/Answer.service';
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
