import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class VoService {
    constructor(private http: Http, private settings: ApiSettings) {
    }


    isVo() {

        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/isVoManager/', {
            withCredentials: true,
        })

    }


    getNewsletterSubscriptionCounter():Observable<any> {


        return this.http.get(this.settings.getApiBaseURL() + 'vo_manager/getNewsletterSubscriptionCounter/', {
            withCredentials: true,

        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))}




  getAllVoGroups(): Observable<any> {

    return this.http.get(this.settings.getApiBaseURL()+ 'vo_manager/getAllGroups/', {
      withCredentials: true,
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  }

    sendMailToVo(subject, message): Observable<any> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('subject', subject);
        urlSearchParams.append('message', message);

        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.post(this.settings.getApiBaseURL() + 'vo_manager/sendMailToAllMembers/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    }

      getMembersOfdeNBIVo(firstname: string, lastName: string, groupid: string) {

    return this.http.get(this.apiSettings.getApiBaseURL() + 'filter_deNBIMembers/', {
      withCredentials: true,
      params: {
        firstName: firstname,
        lastName: lastName,
        groupid: groupid
      }
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


  }



}
