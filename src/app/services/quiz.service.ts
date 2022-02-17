import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Feedback from '../models/interface/Feedback.interface';
import {
  CreateQuizRequest,
  UpdateQuizRequest,
} from '../models/interface/Quiz.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  create(request: CreateQuizRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}quiz`, request);
  }

  findAll(
    page = 1,
    topicId: number,
    search?: string,
    paginate = true
  ): Observable<Feedback> {
    return this.http.get(
      `${this.API_URL}quizzes?page=${page}&tid=${topicId}&search=${
        search ? search : ''
      }&paginate=${paginate}`
    );
  }

  findOne(id: number): Observable<Feedback> {
    return this.http.get(`${this.API_URL}quiz/${id}`);
  }

  findAndUpdate(request: UpdateQuizRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}quiz`, request);
  }

  findAndDelete(id: number): Observable<Feedback> {
    return this.http.delete(`${this.API_URL}quiz`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id },
    });
  }
}
