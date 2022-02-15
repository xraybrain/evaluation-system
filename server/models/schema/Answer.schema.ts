import { number, object, string } from 'yup';

export const CreateAnswerSchema = object().shape({
  answer: string().required('Answer is required'),
  questionId: number().required('Question Id is required'),
  studentId: number().required('Student Id is required'),
});
