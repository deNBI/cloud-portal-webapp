import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies';

/**
 * Interceptor which inserts withCredentials and csrf header
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(Cookie.get('csrftoken'));
    const modifiedReq: HttpRequest<any> = req.clone({
                                                     withCredentials: true,
                                                      headers: req.headers.set('X-CSRFToken', Cookie.get('csrftoken'))
                                                    })

    return next.handle(modifiedReq)
  }
}
