import {Injectable} from "@angular/core";
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {environment} from "../environments/environment";
import {UserService} from "./api-connector/user.service";
import { Observable} from 'rxjs';



@Injectable()
export class MemberGuardService implements CanActivate {


    constructor(private router: Router, private  userservice: UserService) {
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean {
        return new Promise((resolve, reject) => {
            this.userservice.getLoggedUser().toPromise()
                .then(result => {
                    console.log(result.status)

                    let res = result;

                    return res

                }).then(res => {

                this.userservice.getMemberByUser().toPromise().then(memberinfo => {
                    if (memberinfo['name'] === 'MemberNotExistsException') {
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
                window.location.href = environment.login;
                resolve(false);

            });

        })


    }


     canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean {
        return new Promise((resolve, reject) => {
            this.userservice.getLoggedUser().toPromise()
                .then(result => {
                    let res = result;

                    return res

                }).then(res => {

                this.userservice.getMemberByUser().toPromise().then(memberinfo => {
                    if (memberinfo['name'] === 'MemberNotExistsException') {
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
                window.location.href = environment.login;
                resolve(false);

            });

        })


    }
}



