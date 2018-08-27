import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Request,
  Response,
  XHRBackend,
***REMOVED*** from '@angular/http';
import ***REMOVED*** CookieService ***REMOVED*** from 'ng2-cookies';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***ModalDirective***REMOVED*** from "ngx-bootstrap";
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';



@Injectable()
export class HttpInterceptor extends Http ***REMOVED***

  timeoutModal: ModalDirective;

  constructor(xhrBackend: XHRBackend, requestOptions: RequestOptions, modal: ModalDirective) ***REMOVED***
    super(xhrBackend, requestOptions);
    this.timeoutModal = modal;
  ***REMOVED***

  public request(url: string|Request, options?: RequestOptionsArgs): Observable<any> ***REMOVED***
    return super.request(url, options).pipe(catchError((error: any) => throwError(this.handleError)));
  ***REMOVED***

  public handleError = (error: Response) => ***REMOVED***
    if (error.status === 0) ***REMOVED***
      this.timeoutModal.show();
    ***REMOVED***
    return throwError(error)
  ***REMOVED***
***REMOVED***
