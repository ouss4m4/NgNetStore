import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusyService } from './busy.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private busyService: BusyService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('emailexists')) return next.handle(req);
    if (req.method === 'POST' && req.url.includes('orders')) {
      return next.handle(req);
    }
    this.busyService.busy();
    return next.handle(req).pipe(finalize(() => this.busyService.idle()));
  }
}
