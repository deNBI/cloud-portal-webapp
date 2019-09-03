import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***Observable, of***REMOVED*** from 'rxjs';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***VirtualMachine***REMOVED*** from '../virtualmachines/virtualmachinemodels/virtualmachine';
import ***REMOVED***Volume***REMOVED*** from '../virtualmachines/volumes/volume';
import ***REMOVED***IResponseTemplate***REMOVED*** from './response-template';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            ***REMOVED***);

/**
 * Service which provides vm methods.
 */
@Injectable()
export class VirtualmachineService ***REMOVED***
  data: string;
  baseVmUrl: string = `$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***vms/`;

  constructor(private http: HttpClient) ***REMOVED***
  ***REMOVED***

  startVM(flavor: string, image: string, servername: string, project: string, projectid: string, http: boolean, https: boolean, udp: boolean,
          volumename?: string, diskspace?: string, playbook_information?: string, infos?: string): Observable<any> ***REMOVED***

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

    return this.http.post(this.baseVmUrl, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  getAllVM(page: number, filter_name?: string, filter_project?: string,
           filter_status?: string[],
           filter_elixir_id?: string,
           filter_created_at?: string, filter_stopped_at?: string): Observable<VirtualMachine[]> ***REMOVED***
    let params: HttpParams = new HttpParams().set('page', page.toString());
    if (filter_name) ***REMOVED***
      params = params.set('filter_name', filter_name);

    ***REMOVED***
    if (filter_project) ***REMOVED***
      params = params.set('filter_project', filter_project);

    ***REMOVED***
    if (filter_status) ***REMOVED***
      params = params.append('filter_status', JSON.stringify(filter_status));

    ***REMOVED***
    if (filter_elixir_id) ***REMOVED***
      params = params.set('filter_elixir_id', filter_elixir_id);

    ***REMOVED***
    if (filter_created_at) ***REMOVED***
      params = params.set('filter_created_at', filter_created_at);

    ***REMOVED***

    if (filter_stopped_at) ***REMOVED***
      params = params.set('filter_stopped_at', filter_stopped_at);

    ***REMOVED***

    return this.http.get<VirtualMachine[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***voManager/vms/`, ***REMOVED***
      withCredentials: true,
      params: params

    ***REMOVED***)
  ***REMOVED***

  getVmsFromLoggedInUser(page: number, filter_name?: string, filter_project?: string,
                         filter_status?: string[],
                         filter_elixir_id?: string,
                         filter_created_at?: string, filter_stopped_at?: string): Observable<VirtualMachine[]> ***REMOVED***
    let params: HttpParams = new HttpParams().set('page', page.toString());
    if (filter_name) ***REMOVED***
      params = params.set('filter_name', filter_name);

    ***REMOVED***
    if (filter_project) ***REMOVED***
      params = params.set('filter_project', filter_project);

    ***REMOVED***
    if (filter_status) ***REMOVED***
      params = params.append('filter_status', JSON.stringify(filter_status));

    ***REMOVED***
    if (filter_elixir_id) ***REMOVED***
      params = params.set('filter_elixir_id', filter_elixir_id);

    ***REMOVED***
    if (filter_created_at) ***REMOVED***
      params = params.set('filter_created_at', filter_created_at);

    ***REMOVED***

    if (filter_stopped_at) ***REMOVED***
      params = params.set('filter_stopped_at', filter_stopped_at);

    ***REMOVED***

    return this.http.get<VirtualMachine[]>(this.baseVmUrl, ***REMOVED***
      withCredentials: true,
      params: params

    ***REMOVED***)
  ***REMOVED***

  getLogs(openstack_id: string): Observable<any> ***REMOVED***
    return this.http.post(`$***REMOVED***this.baseVmUrl***REMOVED***$***REMOVED***openstack_id***REMOVED***/logs/`, null, ***REMOVED***
      withCredentials: true,

      headers: header
    ***REMOVED***)
  ***REMOVED***

  getVmsFromFacilitiesOfLoggedUser(facility_id: string | number, page: number, filter_name?: string, filter_project?: string,
                                   filter_status?: string[],
                                   filter_elixir_id?: string,
                                   filter_created_at?: string, filter_stopped_at?: string,): Observable<VirtualMachine[]> ***REMOVED***
    let params: HttpParams = new HttpParams().set('page', page.toString());
    if (filter_name) ***REMOVED***
      params = params.set('filter_name', filter_name);

    ***REMOVED***
    if (filter_project) ***REMOVED***
      params = params.set('filter_project', filter_project);

    ***REMOVED***
    if (filter_status) ***REMOVED***
      params = params.append('filter_status', JSON.stringify(filter_status));

    ***REMOVED***
    if (filter_elixir_id) ***REMOVED***
      params = params.set('filter_elixir_id', filter_elixir_id);

    ***REMOVED***
    if (filter_created_at) ***REMOVED***
      params = params.set('filter_created_at', filter_created_at);

    ***REMOVED***

    if (filter_stopped_at) ***REMOVED***
      params = params.set('filter_stopped_at', filter_stopped_at);

    ***REMOVED***

    return this.http.get<VirtualMachine[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***computecenters/$***REMOVED***facility_id***REMOVED***/vms/`,
                                           ***REMOVED***
                                             withCredentials: true,
                                             params:
                                             params

                                           ***REMOVED***
    )
  ***REMOVED***

  getActiveVmsByProject(groupid: string): Observable<VirtualMachine[]> ***REMOVED***

    return this.http.get<VirtualMachine[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***projects/$***REMOVED***groupid***REMOVED***/vms/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  checkStatusInactiveVms(): Observable<VirtualMachine[]> ***REMOVED***

    return this.http.get<VirtualMachine[]>(`$***REMOVED***this.baseVmUrl***REMOVED***status/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  checkVmStatus(openstack_id: string): Observable<any> ***REMOVED***
    return this.http.post(`$***REMOVED***this.baseVmUrl***REMOVED***$***REMOVED***openstack_id***REMOVED***/status/`, null, ***REMOVED***
      withCredentials: true,

      headers: header
    ***REMOVED***)
  ***REMOVED***

  checkVmStatusWhenReboot(openstack_id: string): Observable<any> ***REMOVED***
    const params: HttpParams = new HttpParams().set('reboot', 'true');

    return this.http.post(`$***REMOVED***this.baseVmUrl***REMOVED***$***REMOVED***openstack_id***REMOVED***/status/`, params, ***REMOVED***
      withCredentials: true,

      headers: header
    ***REMOVED***)
  ***REMOVED***

  deleteVM(openstack_id: string): Observable<VirtualMachine> ***REMOVED***

    return this.http.delete<VirtualMachine>(`$***REMOVED***this.baseVmUrl***REMOVED***$***REMOVED***openstack_id***REMOVED***/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  stopVM(openstack_id: string): Observable<VirtualMachine> ***REMOVED***
    const params: HttpParams = new HttpParams().set('os_action', 'stop');

    return this.http.post<VirtualMachine>(`$***REMOVED***this.baseVmUrl***REMOVED***$***REMOVED***openstack_id***REMOVED***/action/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  rebootVM(openstack_id: string, reboot_type: string): Observable<IResponseTemplate> ***REMOVED***
    const params: HttpParams = new HttpParams().set('os_action', 'reboot').set('reboot_type', reboot_type);

    return this.http.post<IResponseTemplate>(`$***REMOVED***this.baseVmUrl***REMOVED***$***REMOVED***openstack_id***REMOVED***/action/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  resumeVM(openstack_id: string): Observable<VirtualMachine> ***REMOVED***

    const params: HttpParams = new HttpParams().set('os_action', 'resume');

    return this.http.post<VirtualMachine>(`$***REMOVED***this.baseVmUrl***REMOVED***$***REMOVED***openstack_id***REMOVED***/action/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  getVolumesByUser(): Observable<Volume[]> ***REMOVED***
    return this.http.get<Volume[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***volumes/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  createVolume(volume_name: string, volume_diskspace: string, vm_openstackid: string): Observable<Volume> ***REMOVED***
    const params: HttpParams = new HttpParams().set('volume_name', volume_name)
      .set('volume_diskspace', volume_diskspace)
      .set('vm_openstackid', vm_openstackid);

    return this.http.post<Volume>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***volumes/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  attachVolumetoServer(volume_id: string, instance_id: string): Observable<IResponseTemplate> ***REMOVED***

    const params: HttpParams = new HttpParams().set('instance_id', instance_id).set('os_action', 'attach');

    return this.http.post<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***volumes/$***REMOVED***volume_id***REMOVED***/action/`, params, ***REMOVED***
                                               withCredentials: true,
                                               headers: header
                                             ***REMOVED***
    )

  ***REMOVED***

  renameVolume(volume_id: string, new_volume_name: string): Observable<Volume> ***REMOVED***
    const params: HttpParams = new HttpParams().set('new_volume_name', new_volume_name);

    return this.http.patch<Volume>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***volumes/$***REMOVED***volume_id***REMOVED***/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  deleteVolume(volume_id: string): Observable<IResponseTemplate> ***REMOVED***

    return this.http.delete<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***volumes/$***REMOVED***volume_id***REMOVED***/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***

  deleteVolumeAttachment(volume_id: string, instance_id: string): Observable<IResponseTemplate> ***REMOVED***

    const params: HttpParams = new HttpParams().set('instance_id', instance_id).set('os_action', 'detach');

    return this.http.post<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***volumes/$***REMOVED***volume_id***REMOVED***/action/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)
  ***REMOVED***
***REMOVED***
