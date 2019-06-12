import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree***REMOVED*** from '@angular/router';
import ***REMOVED***Observable, Subscription, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***environment***REMOVED*** from '../environments/environment';
import ***REMOVED***UserService***REMOVED*** from './api-connector/user.service';
import ***REMOVED***CookieService***REMOVED*** from 'ngx-cookie-service';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***ApiSettings***REMOVED*** from './api-connector/api-settings.service';
import ***REMOVED***catchError, map, switchMap***REMOVED*** from 'rxjs/operators';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***error***REMOVED*** from '@angular/compiler/src/util';
import ***REMOVED***now***REMOVED*** from 'moment';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            ***REMOVED***);

/**
 * Guard which checks if the user is member of the vo.
 */
@Injectable()
export class MemberGuardService implements CanActivate ***REMOVED***

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router, private userservice: UserService) ***REMOVED***

  ***REMOVED***

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean ***REMOVED***
    let cookieValue: string = null;

    cookieValue = this.cookieService.get('redirect_after_login');
    this.cookieService.delete('redirect_after_login');
    this.cookieService.delete('redirect_after_login', '/');
    this.cookieService.delete('redirect_after_login', '/', environment.domain);
    this.cookieService.delete('redirect_after_login', '/portal', environment.domain);

    if (this.cookieService.check('redirect_after_login')) ***REMOVED***
      this.cookieService.delete('redirect_after_login', '/', environment.domain);
      this.cookieService.set('redirect_after_login', null, now(), '/', environment.domain);
      this.cookieService.set('redirect_after_login', null, now(), '/portal', environment.domain)
    ***REMOVED***

    let redirect_url: string = state.url;
    if (cookieValue) ***REMOVED***
      redirect_url = null;
    ***REMOVED***

    return this.userservice.getOnlyLoggedUserWithRedirect(redirect_url).pipe(switchMap(res => ***REMOVED***
      if (res['error']) ***REMOVED***
        window.location.href = environment.login;
      ***REMOVED***

      return this.userservice.getMemberByUser().pipe(map(memberinfo => ***REMOVED***
        if (memberinfo['name'] === 'MemberNotExistsException') ***REMOVED***
          return this.router.parseUrl('/registration-info');

        ***REMOVED***
        if (cookieValue && cookieValue !== 'null') ***REMOVED***
          this.cookieService.delete('redirect_after_login', '/', environment.domain);
          if (this.cookieService.check('redirect_after_login')) ***REMOVED***

            this.cookieService.set('redirect_after_login', null, now(), '/', environment.domain);
            this.cookieService.set('redirect_after_login', null, now(), '/portal', environment.domain)

          ***REMOVED***
          let val: string = cookieValue;
          val = val.substring(2);
          val = val.substring(0, val.length - 1);
          cookieValue = null;

          return this.router.parseUrl(val);

        ***REMOVED***

        return true;
      ***REMOVED***))
    ***REMOVED***))

  ***REMOVED***
***REMOVED***
