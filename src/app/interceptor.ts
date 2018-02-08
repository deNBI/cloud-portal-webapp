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
import ***REMOVED*** Observable ***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';

@Injectable()
export class HttpInterceptor extends Http ***REMOVED***

  timeoutModal: ModalDirective;

  constructor(xhrBackend: XHRBackend, requestOptions: RequestOptions, modal: ModalDirective) ***REMOVED***
    super(xhrBackend, requestOptions);
    this.timeoutModal = modal;
  ***REMOVED***

  public request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> ***REMOVED***
    return super.request(url, options)
      .catch(this.handleError)
  ***REMOVED***

  public handleError = (error: Response) => ***REMOVED***
    if (error.status === 0) ***REMOVED***
      this.timeoutModal.show();
    ***REMOVED***
    return Observable.throw(error)
  ***REMOVED***
***REMOVED***
