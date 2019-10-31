import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {VoService} from '../api-connector/vo.service';
import {Observable} from 'rxjs';
import {IResponseTemplate} from '../api-connector/response-template';

/**
 * VoGuard.
 */
@Injectable()
export class VoGuardService implements CanActivate {

  constructor(private router: Router, private voservice: VoService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve: any, reject: any): any => {
      this.voservice.isVo().subscribe(
        (result: IResponseTemplate) => {
          if (<boolean><Boolean>result.value) {
            return resolve(true)
          } else {
            return resolve(false)
          }
        })
    });

  }
}
