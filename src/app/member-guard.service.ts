import ***REMOVED***Injectable***REMOVED*** from "@angular/core";
import ***REMOVED***CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot***REMOVED*** from "@angular/router";
import ***REMOVED***MembersManager***REMOVED*** from "./perun-connector/members-manager.service";
import ***REMOVED***AuthzResolver***REMOVED*** from "./perun-connector/authz-resolver.service";
import ***REMOVED***Observable***REMOVED*** from "rxjs/Observable";
import ***REMOVED***environment***REMOVED*** from "../environments/environment";


@Injectable()
export class MemberGuardService implements CanActivate ***REMOVED***


    constructor(private router: Router, private  authzresolver: AuthzResolver, private memberssmanager: MembersManager) ***REMOVED***
    ***REMOVED***


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) ***REMOVED***
        return new Promise((resolve, reject) => ***REMOVED***
            this.authzresolver.getLoggedUser().toPromise()
                .then(result => ***REMOVED***

                    let res = result.json();

                    return res

                ***REMOVED***).then(res => ***REMOVED***

                this.memberssmanager.getMemberByUser(res['id']).toPromise().then(memberinfo => ***REMOVED***
                    return resolve(true);

                ***REMOVED***).catch(rejection => ***REMOVED***

                    this.router.navigate(['/registration-info']);
                    resolve(false);

                ***REMOVED***);
            ***REMOVED***).catch(rejection => ***REMOVED***

                //this.router.navigate(['/portal']);
                window.location.href=environment.login
                resolve(false);

            ***REMOVED***);

        ***REMOVED***)


    ***REMOVED***
***REMOVED***



