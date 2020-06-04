import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {VirtualMachine} from '../virtualmachines/virtualmachinemodels/virtualmachine';
import {Volume} from '../virtualmachines/volumes/volume';
import {IResponseTemplate} from './response-template';
import {Clusterinfo} from '../virtualmachines/clusters/clusterinfo';
import {Image} from '../virtualmachines/virtualmachinemodels/image';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which provides vm methods.
 */
@Injectable()
export class VirtualmachineService {
  /**
   * Data for service.
   */
  data: string;

  /**
   * Base API-Endpoint for the vms.
   */
  baseVmUrl: string = `${ApiSettings.getApiBaseURL()}vms/`;

  constructor(private http: HttpClient) {
  }

  getClusterAllowed(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}clusters/allowed/`, {
      withCredentials: true,
      headers: header
    })
  }

  startCluster(masterFlavor: string, masterImage: Image, workerFlavor: string, workerImage: Image, workerCount: string | number,
               project_id: string | number): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('master_flavor', masterFlavor)
      .set('master_image', JSON.stringify(masterImage))
      .set('worker_image', JSON.stringify(workerImage))
      .set('worker_flavor', workerFlavor)
      .set('worker_count', workerCount.toString())
      .set('project_id', project_id.toString());

    return this.http.post(`${ApiSettings.getApiBaseURL()}clusters/`, params, {
      withCredentials: true,
      headers: header
    })
  }

  getClusterInfo(cluster_id: string): Observable<Clusterinfo> {
    return this.http.get<Clusterinfo>(`${ApiSettings.getApiBaseURL()}clusters/${cluster_id}/`, {
      withCredentials: true,
      headers: header
    })
  }

  getClusters(page: number, vm_per_site: number, filter?: string): Observable<Clusterinfo[]> {
    let params: HttpParams = new HttpParams().set('page', page.toString()).set('vm_per_site', vm_per_site.toString());

    if (filter) {
      params = params.set('filter', filter);

    }

    return this.http.get<Clusterinfo[]>(`${ApiSettings.getApiBaseURL()}clusters/`, {
      withCredentials: true,
      headers: header,
      params: params
    })
  }

  deleteCluster(cluster_id: string): Observable<void> {
    return this.http.delete<void>(`${ApiSettings.getApiBaseURL()}clusters/${cluster_id}/`, {
      withCredentials: true,
      headers: header
    })
  }

  startVM(flavor: string, image: Image, servername: string, project: string, projectid: string,
          http: boolean, https: boolean, udp: boolean, new_volumes: Volume[], attach_volumes: Volume[],
          playbook_information?: string, user_key_url?: string): Observable<any> {

    const params: HttpParams = new HttpParams()
      .set('flavor', flavor)
      .set('image', JSON.stringify(image))
      .set('servername', servername)
      .set('project', project)
      .set('projectid', projectid)
      .set('new_volumes', JSON.stringify(new_volumes))
      .set('attach_volumes', JSON.stringify(attach_volumes))
      .set('http_allowed', http.toString())
      .set('https_allowed', https.toString())
      .set('udp_allowed', udp.toString())
      .set('playbook_information', playbook_information)
      .set('user_key_url', user_key_url);

    return this.http.post(this.baseVmUrl, params, {
      withCredentials: true,
      headers: header
    })
  }

  getAllVM(page: number, vm_per_site: number, filter?: string,
           filter_status?: string[], filter_cluster: boolean = false,
           filter_set_for_termination: boolean = false): Observable<VirtualMachine[]> {
    let params: HttpParams = new HttpParams().set('page', page.toString()).set('vm_per_site', vm_per_site.toString());
    if (filter) {
      params = params.append('filter', filter);

    }
    if (filter_status) {
      params = params.append('filter_status', JSON.stringify(filter_status));

    }
    if (filter_cluster) {
      params = params.append('filter_cluster', 'true');

    }
    if (filter_set_for_termination) {
      params = params.append('filter_set_for_termination', 'true');

    }

    return this.http.get<VirtualMachine[]>(`${ApiSettings.getApiBaseURL()}voManager/vms/`, {
      withCredentials: true,
      params: params

    })
  }

  getVmById(openstackId: string): Observable<VirtualMachine> {

    return this.http.get<VirtualMachine>(`${this.baseVmUrl}${openstackId}/details/`, {
      withCredentials: true
    })
  }

  getVmsFromLoggedInUser(page: number, vm_per_site: number, filter?: string,
                         filter_status?: string[], filter_cluster: boolean = false,
                         filter_set_for_termination: boolean = false): Observable<VirtualMachine[]> {
    let params: HttpParams = new HttpParams().set('page', page.toString()).set('vm_per_site', vm_per_site.toString());

    if (filter) {
      params = params.set('filter', filter);

    }
    if (filter_status) {
      params = params.append('filter_status', JSON.stringify(filter_status));

    }
    if (filter_cluster) {
      params = params.append('filter_cluster', 'true');

    }
    if (filter_set_for_termination) {
      params = params.append('filter_set_for_termination', 'true');

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

  getLocationUrl(openstack_id: string): Observable<any> {
    return this.http.post(`${this.baseVmUrl}${openstack_id}/location_url/`, null, {
      withCredentials: true,
      headers: header
    })
  }

  getVmsFromFacilitiesOfLoggedUser(facility_id: string | number,
                                   page: number, vm_per_site: number,
                                   filter?: string, filter_status?: string[],
                                   filter_cluster: boolean = false,
                                   filter_set_for_termination: boolean = false): Observable<VirtualMachine[]> {
    let params: HttpParams = new HttpParams().set('page', page.toString()).set('vm_per_site', vm_per_site.toString());
    if (filter) {
      params = params.set('filter', filter);

    }
    if (filter_status) {
      params = params.append('filter_status', JSON.stringify(filter_status));

    }
    if (filter_cluster) {
      params = params.append('filter_cluster', 'true');

    }
    if (filter_set_for_termination) {
      params = params.append('filter_set_for_termination', 'true');

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

  checkVmStatus(openstack_id: string, name?: string): Observable<any> {
    if (openstack_id) {
      return this.http.post(`${this.baseVmUrl}${openstack_id}/status/`, null, {
        withCredentials: true,

        headers: header
      })
    } else if (name) {
      return this.http.post(`${this.baseVmUrl}${name}/status/`, null, {
        withCredentials: true,

        headers: header
      })
    }
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

  setVmNeeded(openstack_id: string): Observable<any> {
    return this.http.post<any>(`${this.baseVmUrl}${openstack_id}/need/`, null, {
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

  getDetachedVolumesByProject(project_id: string | number): Observable<Volume[]> {

    return this.http.get<Volume[]>(`${ApiSettings.getApiBaseURL()}volumes/project/${project_id}/`, {
      withCredentials: true
    })

  }

  getVolumesByUser(items_per_page: number, current_page: number, filter?: string): Observable<Volume[]> {
    let params: HttpParams = new HttpParams().set('items_per_page', items_per_page.toString()).set('page', current_page.toString());
    if (filter) {
      params = params.set('filter', filter);

    }

    return this.http.get<Volume[]>(`${ApiSettings.getApiBaseURL()}volumes/`, {
      withCredentials: true,
      params: params
    })

  }

  getVolumeById(id: string): Observable<Volume> {
    return this.http.get<Volume>(`${ApiSettings.getApiBaseURL()}volumes/${id}/`, {
      withCredentials: true
    })

  }

  getVolumeByNameAndVmName(volume_name: string, virtualmachine_name: string): Observable<Volume> {
    const params: HttpParams = new HttpParams().set('volume_name', volume_name);

    return this.http.get<Volume>(`${ApiSettings.getApiBaseURL()}volumes/vms/${virtualmachine_name}/`, {
      withCredentials: true,
      params: params
    })

  }

  createVolume(volume_name: string, volume_storage: string, vm_openstackid: string): Observable<Volume> {
    const params: HttpParams = new HttpParams().set('volume_name', volume_name)
      .set('volume_storage', volume_storage)
      .set('vm_openstackid', vm_openstackid);

    return this.http.post<Volume>(`${ApiSettings.getApiBaseURL()}volumes/`, params, {
      withCredentials: true,
      headers: header
    })
  }

  extendVolume(volume_id: string, new_size: string): Observable<IResponseTemplate> {

    const params: HttpParams = new HttpParams().set('os_action', 'extend').set('new_size', new_size);

    return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/action/`, params, {
                                               withCredentials: true,
                                               headers: header
                                             }
    )

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
