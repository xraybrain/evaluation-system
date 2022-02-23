import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Feedback from '../models/interface/Feedback.interface';
import { UpdateUserRequest } from '../models/interface/User.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = LinkManager.apiUrl;
  constructor(private readonly http: HttpClient) {}

  findAllActivities(month: number): Observable<Feedback> {
    return this.http.get(`${this.API_URL}user/activities/${month}`);
  }

  findAndUpdate(request: UpdateUserRequest): Observable<Feedback> {
    return this.http.put(`${this.API_URL}user/`, request);
  }
}
