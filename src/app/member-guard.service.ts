import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot***REMOVED*** from '@angular/router';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***environment***REMOVED*** from '../environments/environment';
import ***REMOVED***UserService***REMOVED*** from './api-connector/user.service';
import ***REMOVED***CookieService***REMOVED*** from 'ngx-cookie-service';

/**
 * Guard which checks if the user is member of the vo.
 */
@Injectable()
export class MemberGuardService implements CanActivate ***REMOVED***

    constructor(private cookieService: CookieService, private router: Router, private userservice: UserService) ***REMOVED***
    ***REMOVED***

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean ***REMOVED***
        const cookieValue = this.cookieService.get('redirect_after_login')

        return new Promise((resolve, reject) => ***REMOVED***
            let redirect_url = state.url
            if (cookieValue) ***REMOVED***
                redirect_url = null;
            ***REMOVED***
            this.userservice.getLoggedUserWithRedirect(redirect_url).toPromise()
                .then((result) => ***REMOVED***

                    const res = result;

                    return res

                ***REMOVED***).then((res) => ***REMOVED***

                this.userservice.getMemberByUser().toPromise().then((memberinfo) => ***REMOVED***
                    if (memberinfo['name'] === 'MemberNotExistsException') ***REMOVED***
                        this.router.navigate(['/registration-info']);
                        resolve(false);

                    ***REMOVED***

                    if (cookieValue) ***REMOVED***
                        this.cookieService.delete('redirect_after_login')
                        let val = cookieValue;
                        val = val.substring(2);
                        val = val.substring(0, val.length - 1);
                        this.router.navigate([val]);
                        resolve(true);
                    ***REMOVED***

                    return resolve(true);

                ***REMOVED***).catch((rejection) => ***REMOVED***

                    this.router.navigate(['/registration-info']);
                    resolve(false);

                ***REMOVED***);
            ***REMOVED***).catch((rejection) => ***REMOVED***

                // this.router.navigate(['/portal']);
                window.location.href = environment.login;
                resolve(false);

            ***REMOVED***);

        ***REMOVED***)

    ***REMOVED***

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean ***REMOVED***
        return new Promise((resolve, reject) => ***REMOVED***
            this.userservice.getLoggedUser().toPromise()
                .then((result) => ***REMOVED***
                    const res = result;

                    return res

                ***REMOVED***).then((res) => ***REMOVED***

                this.userservice.getMemberByUser().toPromise().then((memberinfo) => ***REMOVED***
                    if (memberinfo['name'] === 'MemberNotExistsException') ***REMOVED***
                        this.router.navigate(['/registration-info']);
                        resolve(false);

                    ***REMOVED***

                    return resolve(true);

                ***REMOVED***).catch((rejection) => ***REMOVED***

                    this.router.navigate(['/registration-info']);
                    resolve(false);

                ***REMOVED***);
            ***REMOVED***).catch((rejection) => ***REMOVED***

                // this.router.navigate(['/portal']);
                window.location.href = environment.login;
                resolve(false);

            ***REMOVED***);

        ***REMOVED***)

    ***REMOVED***
***REMOVED***
