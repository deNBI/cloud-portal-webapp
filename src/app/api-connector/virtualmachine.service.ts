import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {VirtualMachine} from '../virtualmachines/virtualmachinemodels/virtualmachine';
import {Volume} from '../virtualmachines/volumes/volume';
import {IResponseTemplate} from './response-template';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which provides vm methods.
 */
@Injectable()
export class VirtualmachineService {
  data: string;
  baseVmUrl: string = `${ApiSettings.getApiBaseURL()}vms/`;

  constructor(private http: HttpClient) {
  }

  startVM(flavor: string, image: string, servername: string, project: string, projectid: string, http: boolean, https: boolean,
          udp: boolean, volumename?: string, diskspace?: string, playbook_information?: string, infos?: string): Observable<any> {

    const params: HttpParams = new HttpParams()
      .set('flavor', flavor)
      .set('image', image)
      .set('servername', servername)
      .set('project', project)
      .set('projectid', projectid)
      .set('diskspace', diskspace)
      .set('volumename', volumename)
      .set('http_allowed', http.toString())
      .set('https_allowed', https.toString())
      .set('udp_allowed', udp.toString())
      .set('playbook_information', playbook_information)
      .set('infos', infos);

    return this.http.post(this.baseVmUrl, params, {
      withCredentials: true,
      headers: header
    })
  }

  getAllVM(page: number, filter?: string, filter_status?: string[]): Observable<VirtualMachine[]> {
    let params: HttpParams = new HttpParams().set('page', page.toString());
    if (filter) {
      params = params.set('filter', filter);

    }
    if (filter_status) {
      params = params.append('filter_status', JSON.stringify(filter_status));

    }

    return this.http.get<VirtualMachine[]>(`${ApiSettings.getApiBaseURL()}voManager/vms/`, {
      withCredentials: true,
      params: params

    })
  }

  getVmsFromLoggedInUser(page: number, filter?: string, filter_status?: string[]): Observable<VirtualMachine[]> {
    let params: HttpParams = new HttpParams().set('page', page.toString());
    if (filter) {
      params = params.set('filter', filter);

    }
    if (filter_status) {
      params = params.append('filter_status', JSON.stringify(filter_status));

    }

    return this.http.get<VirtualMachine[]>(this.baseVmUrl, {
      withCredentials: true,
      params: params

    })
  }

  getLogs(openstack_id: string): Observable<any> {
    return this.http.post(`${this.baseVmUrl}${openstack_id}/logs/`, null, {
      withCredentials: true,

      headers: header
    })
  }

  getVmsFromFacilitiesOfLoggedUser(facility_id: string | number,
                                   page: number, filter?: string, filter_status?: string[]): Observable<VirtualMachine[]> {
    let params: HttpParams = new HttpParams().set('page', page.toString());
    if (filter) {
      params = params.set('filter', filter);

    }
    if (filter_status) {
      params = params.append('filter_status', JSON.stringify(filter_status));

    }

    return this.http.get<VirtualMachine[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/vms/`,
                                           {
                                             withCredentials: true,
                                             params:
                                             params

                                           }
    )
  }

  getActiveVmsByProject(groupid: string): Observable<VirtualMachine[]> {

    return this.http.get<VirtualMachine[]>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/vms/`, {
      withCredentials: true
    })
  }

  checkStatusInactiveVms(): Observable<VirtualMachine[]> {

    return this.http.get<VirtualMachine[]>(`${this.baseVmUrl}status/`, {
      withCredentials: true
    })
  }

  checkVmStatus(openstack_id: string): Observable<any> {
    return this.http.post(`${this.baseVmUrl}${openstack_id}/status/`, null, {
      withCredentials: true,

      headers: header
    })
  }

  checkVmStatusWhenReboot(openstack_id: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('reboot', 'true');

    return this.http.post(`${this.baseVmUrl}${openstack_id}/status/`, params, {
      withCredentials: true,

      headers: header
    })
  }

  deleteVM(openstack_id: string): Observable<VirtualMachine> {

    return this.http.delete<VirtualMachine>(`${this.baseVmUrl}${openstack_id}/`, {
      withCredentials: true,
      headers: header
    })

  }

  stopVM(openstack_id: string): Observable<VirtualMachine> {
    const params: HttpParams = new HttpParams().set('os_action', 'stop');

    return this.http.post<VirtualMachine>(`${this.baseVmUrl}${openstack_id}/action/`, params, {
      withCredentials: true,
      headers: header
    })
  }

  rebootVM(openstack_id: string, reboot_type: string): Observable<IResponseTemplate> {
    const params: HttpParams = new HttpParams().set('os_action', 'reboot').set('reboot_type', reboot_type);

    return this.http.post<IResponseTemplate>(`${this.baseVmUrl}${openstack_id}/action/`, params, {
      withCredentials: true,
      headers: header
    })
  }

  resumeVM(openstack_id: string): Observable<VirtualMachine> {

    const params: HttpParams = new HttpParams().set('os_action', 'resume');

    return this.http.post<VirtualMachine>(`${this.baseVmUrl}${openstack_id}/action/`, params, {
      withCredentials: true,
      headers: header
    })

  }

  getVolumesByUser(): Observable<Volume[]> {
    return this.http.get<Volume[]>(`${ApiSettings.getApiBaseURL()}volumes/`, {
      withCredentials: true
    })

  }

  createVolume(volume_name: string, volume_diskspace: string, vm_openstackid: string): Observable<Volume> {
    const params: HttpParams = new HttpParams().set('volume_name', volume_name)
      .set('volume_diskspace', volume_diskspace)
      .set('vm_openstackid', vm_openstackid);

    return this.http.post<Volume>(`${ApiSettings.getApiBaseURL()}volumes/`, params, {
      withCredentials: true,
      headers: header
    })
  }

  attachVolumetoServer(volume_id: string, instance_id: string): Observable<IResponseTemplate> {

    const params: HttpParams = new HttpParams().set('instance_id', instance_id).set('os_action', 'attach');

    return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/action/`, params, {
                                               withCredentials: true,
                                               headers: header
                                             }
    )

  }

  renameVolume(volume_id: string, new_volume_name: string): Observable<Volume> {
    const params: HttpParams = new HttpParams().set('new_volume_name', new_volume_name);

    return this.http.patch<Volume>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/`, params, {
      withCredentials: true,
      headers: header
    })

  }

  deleteVolume(volume_id: string): Observable<IResponseTemplate> {

    return this.http.delete<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/`, {
      withCredentials: true,
      headers: header
    })
  }

  deleteVolumeAttachment(volume_id: string, instance_id: string): Observable<IResponseTemplate> {

    const params: HttpParams = new HttpParams().set('instance_id', instance_id).set('os_action', 'detach');

    return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/action/`, params, {
      withCredentials: true,
      headers: header
    })
  }
}
