import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AUTH_TOKEN_KEY } from '../constants/auth.constants';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    let intercepted = req;
    if (token) {
      intercepted = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(intercepted).pipe(
      catchError(err => {
        if (err.status === 401) {
          const router = this.injector.get(Router);
          router.navigate(['/login']);
        }
        return of(null)
      }),
    );
  }
}