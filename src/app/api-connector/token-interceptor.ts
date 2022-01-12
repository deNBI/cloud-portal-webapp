import { Injectable } from '@angular/core';
import {
	HttpErrorResponse,
	HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Cookie } from 'ng2-cookies';
import { catchError } from 'rxjs/operators';

/**
 * Interceptor which inserts withCredentials and csrf header
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const skipIntercept: boolean = req.headers.has('skip');
		const skipXRequestedWith: boolean = req.headers.has('skip-x-requested-with');

		if (skipIntercept) {
			req = req.clone({
				headers: req.headers.delete('skip'),
			});

			return next.handle(req).pipe(
				catchError((errorResponse: HttpErrorResponse) => {
					if (errorResponse instanceof HttpErrorResponse) {
						if (errorResponse.status === 0) {
							return throwError('Unable to Connect to the Server');
						} else {
							return throwError(errorResponse);
						}
					}

					return throwError('Unknown error');
				}),
			);
		} else if (skipXRequestedWith) {
			const modifiedReq: HttpRequest<any> = req.clone({
				withCredentials: true,
				headers: req.headers.set('X-CSRFToken', Cookie.get('csrftoken')).delete('skip-x-requested-with'),
			});

			return next.handle(modifiedReq).pipe(
				catchError((errorResponse: HttpErrorResponse) => {
					if (errorResponse instanceof HttpErrorResponse) {
						if (errorResponse.status === 0) {
							return throwError('Unable to Connect to the Server');
						} else {
							return throwError(errorResponse);
						}
					}

					return throwError('Unknown error');
				}),
			);
		} else {
			const modifiedReq: HttpRequest<any> = req.clone({
				withCredentials: true,
				headers: req.headers.set('X-CSRFToken', Cookie.get('csrftoken')).set('X-Requested-With', 'XMLHttpRequest'),
			});

			return next.handle(modifiedReq).pipe(
				catchError((errorResponse: HttpErrorResponse) => {
					if (errorResponse instanceof HttpErrorResponse) {
						if (errorResponse.status === 0) {
							return throwError('Unable to Connect to the Server');
						} else {
							return throwError(errorResponse);
						}
					}

					return throwError('Unknown error');
				}),
			);
		}
	}
}
