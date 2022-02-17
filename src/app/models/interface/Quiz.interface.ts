import { Topic } from './Topic.interface';

export interface CreateQuizRequest {
  token?: string;
  active: boolean;
  title: string;
  topicId: number;
}

export interface UpdateQuizRequest {
  id: number;
  token?: string;
  active?: boolean;
  title?: string;
}

export interface Quiz {
  id: number;
  title: string;
  token: string;
  active: boolean;
  topicId: number;
  topic: Topic;
  createdAt: string;
  updatedAt: string;
}
