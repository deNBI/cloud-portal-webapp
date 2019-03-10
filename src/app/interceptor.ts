import {Injectable} from '@angular/core';
import {Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend} from '@angular/http';
import {ModalDirective} from 'ngx-bootstrap';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class HttpInterceptor extends Http {

    timeoutModal: ModalDirective;

    constructor(xhrBackend: XHRBackend, requestOptions: RequestOptions, modal: ModalDirective) {
        super(xhrBackend, requestOptions);
        this.timeoutModal = modal;
    }

    public request(url: string | Request, options?: RequestOptionsArgs): Observable<any> {
        return super.request(url, options).pipe(catchError((error: any) => throwError(this.handleError)));
    }

    public handleError = (error: Response) => {
        if (error.status === 0) {
            this.timeoutModal.show();
        }

        return throwError(error)
    }
}
