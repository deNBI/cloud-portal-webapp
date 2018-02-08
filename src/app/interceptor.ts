import {Injectable} from '@angular/core';
import {
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Request,
  Response,
  XHRBackend,
} from '@angular/http';
import { CookieService } from 'ng2-cookies';
import { Observable } from 'rxjs/Rx';
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';

@Injectable()
export class HttpInterceptor extends Http {

  timeoutModal: ModalDirective;

  constructor(xhrBackend: XHRBackend, requestOptions: RequestOptions, modal: ModalDirective) {
    super(xhrBackend, requestOptions);
    this.timeoutModal = modal;
  }

  public request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options)
      .catch(this.handleError)
  }

  public handleError = (error: Response) => {
    if (error.status === 0) {
      this.timeoutModal.show();
    }
    return Observable.throw(error)
  }
}
