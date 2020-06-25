import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/internal/operators';
import {environment} from '../environments/environment';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(tap(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 302) {
            console.log('redirect');
            console.log(event.url);
          }
        }
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err.url)
          if (err.status === 401 || err.status === 0) {
            window.location.href = environment.login;

          }
        }
      }))

  }
}
