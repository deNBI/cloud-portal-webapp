import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from '../virtualmachines/virtualmachinemodels/image';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ImageService ***REMOVED***
  constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getImages(host: string, port: string): Observable<Image[]> ***REMOVED***
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.set('host', host);
    urlSearchParams.set('port', port);


    return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getImageByClient/', ***REMOVED***
      withCredentials: true,
      search: urlSearchParams
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  ***REMOVED***

***REMOVED***
