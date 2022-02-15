import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/Auth.model';
import Feedback from '../models/interface/Feedback.interface';
import LinkManager from '../models/LinkManager.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = `${LinkManager.baseUrl}/api/`;
  private ACCESS_TOKEN_KEY = 'access-token';

  constructor(protected http: HttpClient) {}

  login(request: LoginRequest): Observable<Feedback> {
    return this.http.post(`${this.API_URL}/login`, request);
  }

  currentUser(): Observable<Feedback> {
    return this.http.get(`${this.API_URL}/current/user`);
  }

  get isLoggedIn() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) ? true : false;
  }

  get accessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) as string;
  }

  set accessToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  removeAccessToken() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }
}
