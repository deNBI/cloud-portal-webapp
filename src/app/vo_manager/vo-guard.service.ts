import ***REMOVED***Injectable***REMOVED*** from "@angular/core";
import ***REMOVED***CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot***REMOVED*** from "@angular/router";
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";
import ***REMOVED***Observable***REMOVED*** from "rxjs/Observable";


@Injectable()
export class VoGuardService implements CanActivate ***REMOVED***


  constructor(private router: Router, private voservice:VoService)***REMOVED***
  ***REMOVED***


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) ***REMOVED***
    return new Promise((resolve, reject) => ***REMOVED***
      this.voservice.isVo().toPromise()
        .then(result => ***REMOVED***
            console.log(result)
          let res = result.json();
          if (res['Is_Vo_Manager'].toString() == 'true')***REMOVED***
            return resolve(true)***REMOVED***
            else***REMOVED***
              return resolve(false)
          ***REMOVED***
      ***REMOVED***).catch(rejection => ***REMOVED***
        this.router.navigate(['/userinfo']);
        resolve(false);

      ***REMOVED***);
    ***REMOVED***);


  ***REMOVED***
***REMOVED***



