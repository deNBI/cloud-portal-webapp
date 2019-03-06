import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {VoService} from '../api-connector/vo.service';
import {Observable} from 'rxjs';

@Injectable()
export class VoGuardService implements CanActivate {


    constructor(private router: Router, private voservice: VoService) {
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise((resolve, reject) => {
            this.voservice.isVo().subscribe(
                result => {

                    const res = result;
                    if (res['Is_Vo_Manager']) {
                        return resolve(true)
                    } else {
                        return resolve(false)
                    }
                })
        });


    }
}



