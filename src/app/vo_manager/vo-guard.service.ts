import {Injectable} from "@angular/core";
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {VoService} from "../api-connector/vo.service";
import { Observable} from 'rxjs';

@Injectable()
export class VoGuardService implements CanActivate {


  constructor(private router: Router, private voservice:VoService){
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.voservice.isVo().toPromise()
        .then(result => {

          let res = result.json();
          if (res['Is_Vo_Manager'].toString() == 'true'){
            return resolve(true)}
            else{
              return resolve(false)
          }
      }).catch(rejection => {
        this.router.navigate(['/userinfo']);
        resolve(false);

      });
    });


  }
}



