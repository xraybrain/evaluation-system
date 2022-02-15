import { Request, Response } from 'express';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateQuestionRequest,
  DeleteQuestionOptionRequest,
  DeleteQuestionRequest,
  UpdateQuestionOptionRequest,
  UpdateQuestionRequest,
} from 'server/models/Question.model';
import { DeleteAdminSchema } from 'server/models/schema/Admin.schema';
import {
  CreateQuestionSchema,
  DeleteQuestionOptionSchema,
  DeleteQuestionSchema,
  UpdateQuestionOptionSchema,
  UpdateQuestionSchema,
} from 'server/models/schema/Question.schema';
import {
  createQuestion,
  deleteQuestion,
  deleteQuestionOption,
  getQuestion,
  getQuestions,
  updateQuestion,
  updateQuestionOption,
} from 'server/services/Question.service';
import { validator } from 'server/utils/yup.util';

export const createQuestionController = async (req: Request, res: Response) => {
  const request: CreateQuestionRequest = req.body;
  const validation = await validator(CreateQuestionSchema, request);
  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createQuestion(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getQuestionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getQuestion(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getQuestionsController = async (req: Request, res: Response) => {
  const { search, qid } = req.query;
  const page = Number(req.query['page']) || 1;
  const quizId = qid ? Number(qid) : 0;
  let feedback = await getQuestions(page, quizId, `${search}`);
  res.json(feedback);
};

export const updateQuestionController = async (req: Request, res: Response) => {
  const request: UpdateQuestionRequest = req.body;
  const validation = await validator(UpdateQuestionSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateQuestion(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteQuestionController = async (req: Request, res: Response) => {
  const request: DeleteQuestionRequest = req.body;
  const validation = await validator(DeleteQuestionSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteQuestion(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const updateQuestionOptionController = async (
  req: Request,
  res: Response
) => {
  const request: UpdateQuestionOptionRequest = req.body;
  const validation = await validator(UpdateQuestionOptionSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateQuestionOption(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteQuestionOptionController = async (
  req: Request,
  res: Response
) => {
  const request: DeleteQuestionOptionRequest = req.body;
  const validation = await validator(DeleteQuestionOptionSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteQuestionOption(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
