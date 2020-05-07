import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {ResearchEnvironment} from '../virtualmachines/virtualmachinemodels/res-env';
import {VirtualMachine} from '../virtualmachines/virtualmachinemodels/virtualmachine';
import {Http} from '@angular/http';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Bioconda service.
 */
@Injectable()
export class BiocondaService {

  constructor(private http: HttpClient) {
  }

  getAllTools(page: number, name?: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('page', page.toString())
      .set('name', name);

    return this.http.get(`${ApiSettings.getApiBaseURL()}conda/all/`, {
      headers: header,
      withCredentials: true,
      params: params
    })
  }

  getForcTemplates(clientid: string): Observable<ResearchEnvironment[]> {
    const params: HttpParams = new HttpParams()
      .set('clientid', clientid);

    return this.http.get<ResearchEnvironment[]>(`${ApiSettings.getApiBaseURL()}forc/templates/`, {
      headers: header,
      withCredentials: true,
      params: params
    })
  }

  getAllowedForcTemplates(facility_id?: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('facility_id', facility_id);

    return this.http.get(`${ApiSettings.getApiBaseURL()}forc/templates/allowed/`, {
      headers: header,
      withCredentials: true,
      params: params
    })
  }

  getTemplateNameByVmName(vm: VirtualMachine): Observable<any> {
    const params: HttpParams = new HttpParams().set('vm', vm.name);

    return this.http.get(`${ApiSettings.getApiBaseURL()}forc/backends/vm_name/`, {
      headers: header,
      withCredentials: true,
      params: params
    })
  }

  getUsersForBackend(vmId: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('vm_id', vmId);

    return this.http.get(`${ApiSettings.getApiBaseURL()}forc/backs/users/`, {
      headers: header,
      withCredentials: true,
      params: params
    })
  }

  addUserToBackend(vmId: string, user_id: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('vm_id', vmId).set('user_id', user_id);

    return this.http.post(`${ApiSettings.getApiBaseURL()}forc/backs/users/`, params, {
      headers: header,
      withCredentials: true
    })
  }

  deleteUserFromBackend(vmId: string, user_id: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('vm_id', vmId).set('user_id', user_id);

    return this.http.delete(`${ApiSettings.getApiBaseURL()}forc/backs/users/`, {
      headers: header,
      withCredentials: true,
      params: params
    })
  }
}
