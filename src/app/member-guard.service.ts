import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {environment} from '../environments/environment';
import {UserService} from './api-connector/user.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {now} from 'moment';
import {IResponseTemplate} from './api-connector/response-template';
import {VoService} from './api-connector/vo.service';
import {setElixirId, setVO} from './shared/globalvar';

/**
 * Guard which checks if the user is member of the vo.
 */
@Injectable()
export class MemberGuardService implements CanActivate {

  constructor(private http: HttpClient, private cookieService: CookieService,
              private router: Router, private userservice: UserService, private voService: VoService) {

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

    return this.userservice.getOnlyLoggedUserWithRedirect(redirect_url).pipe(switchMap((res: any): Observable<any> => {
      if (res['error']) {
        window.location.href = environment.login;
        const subject: Subject<boolean> = new Subject<boolean>();
        subject.next(false);

        return subject.asObservable();

      } else {
        this.voService.isVo().subscribe((result: IResponseTemplate): void => {
          setVO(<boolean><Boolean>result.value);

        })
        this.userservice.getUserInfo().subscribe((result: any): void => {
          setElixirId(result['ElixirId'])
        })

        return this.userservice.getMemberByUser().pipe(map((memberinfo: any): any => {
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

          return true

        }))
      }
    }))

  }
}
