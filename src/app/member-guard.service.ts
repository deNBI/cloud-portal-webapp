import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import {Observable, Subscription, throwError} from 'rxjs';
import {environment} from '../environments/environment';
import {UserService} from './api-connector/user.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ApiSettings} from './api-connector/api-settings.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {error} from '@angular/compiler/src/util';
import {now} from 'moment';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Guard which checks if the user is member of the vo.
 */
@Injectable()
export class MemberGuardService implements CanActivate {

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router, private userservice: UserService) {

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

    return this.userservice.getOnlyLoggedUserWithRedirect(redirect_url).pipe(switchMap((res: any) => {
      if (res['error']) {
        window.location.href = environment.login;
      }

      return this.userservice.getMemberByUser().pipe(map((memberinfo: any) => {
        if (memberinfo['name'] === 'MemberNotExistsException') {
          return this.router.parseUrl('/registration-info');

        }
        if (cookieValue && cookieValue !== 'null') {
          this.cookieService.delete('redirect_after_login', '/', environment.domain);
          if (this.cookieService.check('redirect_after_login')) {

            this.cookieService.set('redirect_after_login', null, now(), '/', environment.domain);
            this.cookieService.set('redirect_after_login', null, now(), '/portal', environment.domain)

          }
          let val: string = cookieValue;
          val = val.substring(2);
          val = val.substring(0, val.length - 1);
          cookieValue = null;

          return this.router.parseUrl(val);

        }

        return true;
      }))
    }))

  }
}
