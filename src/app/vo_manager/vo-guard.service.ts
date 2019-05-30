import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot***REMOVED*** from '@angular/router';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***IResponseTemplate***REMOVED*** from "../api-connector/response-template";

@Injectable()
export class VoGuardService implements CanActivate ***REMOVED***

    constructor(private router: Router, private voservice: VoService) ***REMOVED***
    ***REMOVED***

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean ***REMOVED***
        return new Promise((resolve, reject) => ***REMOVED***
            this.voservice.isVo().subscribe(
                (result: IResponseTemplate) => ***REMOVED***
                    if (<boolean><Boolean>result.value) ***REMOVED***
                        return resolve(true)
                    ***REMOVED*** else ***REMOVED***
                        return resolve(false)
                    ***REMOVED***
                ***REMOVED***)
        ***REMOVED***);

    ***REMOVED***
***REMOVED***

