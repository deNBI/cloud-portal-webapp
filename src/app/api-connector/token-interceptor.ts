import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies';

/**
 * Interceptor which inserts withCredentials and csrf he                                      ader
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
<<<<<<< HEAD
    if (req.url.includes('openstack')) {
      console.log("openstack found")
      return next.handle(req)
    }
    const modifiedReq: HttpRequest<any> = req.clone({
                                                      withCredentials: true,
                                                      headers: req.headers.set('X-CSRFToken', Cookie.get('csrftoken'))
                                                    })
=======
    const skipIntercept: boolean = req.headers.has('skip');
>>>>>>> decoi

    if (skipIntercept) {
      req = req.clone({
        headers: req.headers.delete('skip')
      });

      return next.handle(req)
    } else {
      const modifiedReq: HttpRequest<any> = req.clone({
        withCredentials: true,
        headers: req.headers.set('X-CSRFToken', Cookie.get('csrftoken'))
      })

      return next.handle(modifiedReq)
    }
  }
}
