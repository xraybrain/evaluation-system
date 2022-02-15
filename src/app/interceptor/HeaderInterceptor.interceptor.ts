import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpEventType,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request instanceof HttpRequest) {
      console.log('Request');
      const accessToken = this.authService.accessToken;
      if (accessToken) {
        request = request.clone({
          setHeaders: { Authorization: accessToken },
        });
      }
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          console.log(
            'Response',
            event.headers.get('x-access'),
            event.headers.get('x-refresh')
          );
          const token =
            event.headers.get('x-access') || event.headers.get('x-refresh');
          if (token) {
            this.authService.accessToken = token;
          }
        }
        return event;
      }),
      catchError((err: HttpErrorResponse, caught) => {
        if (err.status === 401) {
          this.authService.removeAccessToken();
          this.router.navigate(['login']);
        }
        return throwError(() => err);
      })
    );
  }
}
