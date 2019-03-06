import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot***REMOVED*** from '@angular/router';
import ***REMOVED***environment***REMOVED*** from '../environments/environment';
import ***REMOVED***UserService***REMOVED*** from './api-connector/user.service';
import ***REMOVED*** Observable***REMOVED*** from 'rxjs';



@Injectable()
export class MemberGuardService implements CanActivate ***REMOVED***


    constructor(private router: Router, private  userservice: UserService) ***REMOVED***
    ***REMOVED***


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean ***REMOVED***
        return new Promise((resolve, reject) => ***REMOVED***
            this.userservice.getLoggedUser().toPromise()
                .then(result => ***REMOVED***

                    const res = result;

                    return res

                ***REMOVED***).then(res => ***REMOVED***

                this.userservice.getMemberByUser().toPromise().then(memberinfo => ***REMOVED***
                    if (memberinfo['name'] === 'MemberNotExistsException') ***REMOVED***
                        this.router.navigate(['/registration-info']);
                        resolve(false);


                    ***REMOVED***
                    return resolve(true);

                ***REMOVED***).catch(rejection => ***REMOVED***

                    this.router.navigate(['/registration-info']);
                    resolve(false);

                ***REMOVED***);
            ***REMOVED***).catch(rejection => ***REMOVED***

                // this.router.navigate(['/portal']);
                window.location.href = environment.login;
                resolve(false);

            ***REMOVED***);

        ***REMOVED***)


    ***REMOVED***


     canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean ***REMOVED***
        return new Promise((resolve, reject) => ***REMOVED***
            this.userservice.getLoggedUser().toPromise()
                .then(result => ***REMOVED***
                    const res = result;

                    return res

                ***REMOVED***).then(res => ***REMOVED***

                this.userservice.getMemberByUser().toPromise().then(memberinfo => ***REMOVED***
                    if (memberinfo['name'] === 'MemberNotExistsException') ***REMOVED***
                        this.router.navigate(['/registration-info']);
                        resolve(false);


                    ***REMOVED***
                    return resolve(true);

                ***REMOVED***).catch(rejection => ***REMOVED***

                    this.router.navigate(['/registration-info']);
                    resolve(false);

                ***REMOVED***);
            ***REMOVED***).catch(rejection => ***REMOVED***

                // this.router.navigate(['/portal']);
                window.location.href = environment.login;
                resolve(false);

            ***REMOVED***);

        ***REMOVED***)


    ***REMOVED***
***REMOVED***



