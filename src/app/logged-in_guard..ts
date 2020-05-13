import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {UserService} from './api-connector/user.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {now} from 'moment';

/**
 * Guard which checks if the user is member of the vo.
 */
@Injectable()
export class LoggedIn_guard implements CanActivate {

  constructor(private http: HttpClient, private cookieService: CookieService,
              private router: Router, private userservice: UserService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
    let cookieValue: string = null;

    cookieValue = this.cookieService.get('redirect_after_login');
    this.cookieService.delete('redirect_after_login');
    this.cookieService.delete('redirect_after_login', '/');
    this.cookieService.delete('redirect_after_login', '/', environment.domain);
    this.cookieService.delete('redirect_after_login', '/portal', environment.domain);

    if (this.cookieService.check('redirect_after_login')) {
      this.cookieService.delete('redirect_after_login', '/', environment.domain);
      this.cookieService.set('redirect_after_login', null, now(), '/', environment.domain);
      this.cookieService.set('redirect_after_login', null, now(), '/portal', environment.domain)
    }

    let redirect_url: string = state.url;
    if (cookieValue) {
      redirect_url = null;
    }

    return this.userservice.getOnlyLoggedUserWithRedirect(redirect_url).pipe(
      map((res: any) => {
            if (res['error']) {
              window.location.href = environment.login;

              return false;

            }

            return true;
          }
      ))

  }
}
