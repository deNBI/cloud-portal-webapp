import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
  'X-CSRFToken': Cookie.get('csrftoken')
});

/**
 * Service which provides playbooks from database
 */
@Injectable()
export class PlaybookService {
  data: string;
  baseUrl: string = `${ApiSettings.getApiBaseURL()}playbooks/`;

  constructor(private http: HttpClient) {
  }

  getPlaybookForVM(vm_id: string): Observable<any> {

    return this.http.get<Object>(`${this.baseUrl}${vm_id}/`, {
      withCredentials: true
      // headers: header
    });
  }

}
