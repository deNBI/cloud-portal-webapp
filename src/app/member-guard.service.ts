import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from './api-connector/user.service';
import { environment } from '../environments/environment';
import { IResponseTemplate } from './api-connector/response-template';
import { VoService } from './api-connector/vo.service';
import { setElixirId, setVO } from './shared/globalvar';

/**
 * Guard which checks if the user is member of the VO.
 */
@Injectable()
export class MemberGuardService implements CanActivate {
	constructor(
		private http: HttpClient,
		private cookieService: CookieService,
		private router: Router,
		private userService: UserService,
		private voService: VoService,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
		const redirectUrl = state.url;
		const cookieValue = this.cookieService.get('redirect_after_login');

		this.cookieService.delete('redirect_after_login', '/', environment.domain);
		this.cookieService.delete('redirect_after_login', '/portal', environment.domain);

		return this.userService.getOnlyLoggedUserWithRedirect(cookieValue || redirectUrl).pipe(
			switchMap((res: any): Observable<boolean | UrlTree> => {
				if (res['error']) {
					window.location.href = environment.debugin;

					return new Observable<false>();
				} else {
					this.voService.isVo().subscribe((result: IResponseTemplate): void => {
						setVO(result.value as boolean);
					});
					this.userService.getLoggedUserElixirId().subscribe((result: any): void => {
						setElixirId(result['elixir_id']);
					});

					return this.userService.getIsCurrentUserVoMember().pipe(
						map((memberInfo: any): boolean | UrlTree => {
							if (!memberInfo['isMember']) {
								return this.router.parseUrl('/registration-info');
							}
							if (cookieValue) {
								const val: string = cookieValue.substring(2, cookieValue.length - 1);
								this.cookieService.delete('redirect_after_login', '/', environment.domain);
								this.cookieService.delete('redirect_after_login', '/portal', environment.domain);

								return this.router.parseUrl(val);
							}

							return true;
						}),
					);
				}
			}),
		);
	}
}
