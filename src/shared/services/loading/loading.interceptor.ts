import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { LoadingService, LoadingOverlayRef } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let loadingRef: LoadingOverlayRef;

    Promise.resolve(null).then(() => loadingRef = this.loadingService.open());

    return next.handle(req).pipe(
        tap((event) => {
            if (event instanceof HttpResponse && loadingRef) {
              loadingRef.close();
            }
          }),
        catchError(error => {
            if(loadingRef) {
                loadingRef.close();
            }
            return throwError(error);
        })  
    )
  }
}
