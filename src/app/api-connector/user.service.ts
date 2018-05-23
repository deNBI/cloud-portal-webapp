import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class UserService {
  constructor(private http: Http, private settings: ApiSettings) {
  }

   setUserFacilityPassword(facility: string): Observable<Response> {
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('facility',facility);

    return this.http.post(this.settings.getConnectorBaseUrl() + 'user/setUserPassword/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }

     setNewsletterSubscription(subscribed: boolean): Observable<any> {
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('subscribed',subscribed.toString());

    return this.http.post(this.settings.getApiBaseURL() + 'newsletter/setNewsletterSubscription/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }

   getNewsletterSubscription(): Observable<any> {
         let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        return this.http.get(this.settings.getApiBaseURL() + 'newsletter/getNewsletterSubscription/', {
            withCredentials: true,
        });


    }



}
