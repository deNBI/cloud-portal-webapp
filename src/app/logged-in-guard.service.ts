import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserService } from './api-connector/user.service';
import { environment } from '../environments/environment';

/**
 * Guard which checks if the user is member of the vo.
 */
@Injectable()
export class LoggedInGuard {
	constructor(
		private http: HttpClient,
		private cookieService: CookieService,
		private router: Router,
		private userService: UserService,
	) {
		// constructor for LoggedInGuard
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
		return this.userService.getOnlyLoggedUserWithRedirect(state.url).pipe(
			map((res: any): boolean => {
				if ('error' in res) {
					window.location.href = environment.login;

					return false;
				}

				return true;
			}),
		);
	}
}
