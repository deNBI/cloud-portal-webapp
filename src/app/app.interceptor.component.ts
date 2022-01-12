import { Injectable } from '@angular/core';
import {
	HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

/**
 * AppInterceptor
 */
@Injectable()
export class AppInterceptor implements HttpInterceptor {
	/**
	 * Intercepts recurring request error (302 response)
	 *
	 * @param request the httpRequest to check
	 * @param next the httpHandler
	 */
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(request).pipe(tap(
			(event: HttpEvent<any>): void => {
				if (event instanceof HttpResponse) {
					if (event.status === 302) {
						console.log('redirect');
						console.log(event.url);
					}
				}
			},
			(err: any): void => {
				if (err instanceof HttpErrorResponse) {
					if (err.status === 401 || err.status === 0) {
						window.location.href = environment.login;

					}
				}
			},
		));

	}
}
