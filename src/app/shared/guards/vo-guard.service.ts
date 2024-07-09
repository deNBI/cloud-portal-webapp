import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { is_vo } from '../globalvar';

/**
 * Guard which checks if the user is member of the vo.
 */
@Injectable({
	providedIn: 'root',
}) export class VoGuardService {
	constructor(private router: Router) {
	}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

		if (is_vo) {
			return true;
		} else {
			this.router.navigate(['/userinfo']);

			return false;
		}
	}
}
