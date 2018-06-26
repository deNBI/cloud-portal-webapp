import {Injectable} from "@angular/core";
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {environment} from "../environments/environment";
import {UserService} from "./api-connector/user.service";


@Injectable()
export class MemberGuardService implements CanActivate {


    constructor(private router: Router, private  userservice: UserService) {
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return new Promise((resolve, reject) => {
            this.userservice.getLoggedUser().toPromise()
                .then(result => {

                    let res = result.json();

                    return res

                }).then(res => {

                this.userservice.getMemberByUser(res['id']).toPromise().then(memberinfo => {
                    if (memberinfo.json()['name'] === 'MemberNotExistsException') {
                        this.router.navigate(['/registration-info']);
                        resolve(false);

                    }
                    return resolve(true);

                }).catch(rejection => {

                    this.router.navigate(['/registration-info']);
                    resolve(false);

                });
            }).catch(rejection => {

                //this.router.navigate(['/portal']);
                window.location.href = environment.login
                resolve(false);

            });

        })


    }
}



