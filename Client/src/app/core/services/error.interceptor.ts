import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = req.headers.set('Content-Type', 'application/json');
    const token = localStorage.getItem('token');
    headers.set('Authorization', `Bearer ${token}`);
    const authReq = req.clone({ headers });
    return next.handle(authReq).pipe(
      catchError((err) => {
        if (err) {
          if (err.status === 400) {
            if (err.error.errors) {
              throw err.error;
            } else {
              this.toastr.error(err.error.message, err.error.statusCode);
            }
          }
          if (err.status === 404) {
            this.toastr.error(err.error.message, err.error.statusCode);
            this.router.navigateByUrl('/not-found');
          } else if (err.status === 500) {
            const navExtra: NavigationExtras = {
              state: { error: err.error },
            };
            this.router.navigateByUrl('/internal-error', navExtra);
          } else if (err.status === 400) {
            this.toastr.error(err.error.message, err.error.statusCode);
          }
        }
        return EMPTY;
      })
    );
  }
}
