import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('jwt_token');

    if (jwtToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    }

    return next.handle(req);
  }
}
