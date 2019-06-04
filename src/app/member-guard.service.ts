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
    const cookieValue: string = this.cookieService.get('redirect_after_login');
    let redirect_url: string = state.url;
    if (cookieValue) {
      redirect_url = null;
    }
    return this.userservice.getOnlyLoggedUserWithRedirect(redirect_url).pipe(switchMap(res => {
      console.log(res);
      if (res['error']) {
        console.log('drin');
        window.location.href = environment.login;
      }

      return this.userservice.getMemberByUser().pipe(map(memberinfo => {
        if (memberinfo['name'] === 'MemberNotExistsException') {
          return this.router.parseUrl('/registration-info');

        }
        if (cookieValue) {
          this.cookieService.delete('redirect_after_login');
          let val: string = cookieValue;
          console.log(val);
          val = val.substring(2);
          val = val.substring(0, val.length - 1);

          return this.router.parseUrl(val);

        }

        return true;
      }))
    }))

  }

}
