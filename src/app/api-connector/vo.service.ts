import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class VoService{
  constructor(private http: Http, private settings: ApiSettings) {
  }



  isVo(){

    return this.http.get(this.settings.getApiBaseURL()+ 'vo_manager/isVoManager/', {
      withCredentials: true,
    })

  }




  sendMailToVo(subject,message): Observable<any> {
      let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('subject', subject);
    urlSearchParams.append('message',message);

     let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    return this.http.post(this.settings.getApiBaseURL()+ 'vo_manager/sendMailToAllMembers/',urlSearchParams, {
        withCredentials: true,
        headers: header,
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))






  }

}
