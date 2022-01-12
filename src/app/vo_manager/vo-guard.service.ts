import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { is_vo } from '../shared/globalvar';

/**
 * VoGuard.
 */
@Injectable()
export class VoGuardService implements CanActivate {

	constructor(private router: Router) {
		this.router = router;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return new Promise((resolve: any, reject: any): any => {
			if (is_vo) {
				// eslint-disable-next-line no-promise-executor-return
				return resolve(true);
			} else {
				// eslint-disable-next-line no-promise-executor-return
				return resolve(false);
			}
		});

	}
}
