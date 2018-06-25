import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class VoService ***REMOVED***
    constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***


    isVo() ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/isVoManager/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***)

    ***REMOVED***


    getNewsletterSubscriptionCounter():Observable<any> ***REMOVED***


        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getNewsletterSubscriptionCounter/', ***REMOVED***
            withCredentials: true,

        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))***REMOVED***


  

  getAllVoGroups(): Observable<any> ***REMOVED***

    return this.http.get(this.settings.getApiBaseURL()+ 'vo_manager/getAllGroups/', ***REMOVED***
      withCredentials: true,
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  ***REMOVED***

    sendMailToVo(subject, message): Observable<any> ***REMOVED***
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('subject', subject);
        urlSearchParams.append('message', message);

        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        return this.http.post(this.settings.getApiBaseURL() + 'vo_manager/sendMailToAllMembers/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    ***REMOVED***



***REMOVED***
