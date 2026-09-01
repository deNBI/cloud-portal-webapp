/* tslint-disable */

import { Injectable, inject } from '@angular/core'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { is_vo } from '../shared/globalvar'

/**
 * VoGuard.
 */
@Injectable()
export class VoGuardService {
	private router = inject(Router)

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		return new Promise((resolve: any, reject: any): any => {
			if (is_vo) {
				return resolve(true)
			} else {
				return resolve(false)
			}
		})
	}
}
