import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {VirtualMachine} from '../virtualmachines/virtualmachinemodels/virtualmachine';
import {Volume} from '../virtualmachines/volumes/volume';
import {IResponseTemplate} from './response-template';

const header: HttpHeaders = new HttpHeaders({
  'X-CSRFToken': Cookie.get('csrftoken')
});


/**
 * Service which provides playbooks from database
 */
@Injectable()
export class PlaybookService {
  data: string;
  baseUrl: string = `${ApiSettings.getApiBaseURL()}playbooks`;

  constructor(private http: HttpClient) {
  }

  getPlaybookForVM(vm: VirtualMachine): Observable<Object> {
 const params: HttpParams = new HttpParams().set('vm_id', vm.name);

 return this.http.get<Object>(this.baseUrl, {
   withCredentials: true,
   headers: header,
   params: params
 });
}

}
