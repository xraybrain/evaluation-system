import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
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
import { platformBrowser } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  isBrowser = false;
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request instanceof HttpRequest) {
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
          const token =
            event.headers.get('x-access') || event.headers.get('x-refresh');
          if (token) {
            this.authService.accessToken = token;
          }
        }
        return event;
      }),
      catchError((err: HttpErrorResponse, caught) => {
        console.log(isPlatformBrowser(PLATFORM_ID));
        if (err.status === 401 && this.isBrowser) {
          this.authService.logout();
        }
        return throwError(() => err);
      })
    );
  }
}
