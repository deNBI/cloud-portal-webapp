import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

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
    });
  }

}
