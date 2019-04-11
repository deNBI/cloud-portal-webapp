import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {VirtualMachine} from '../virtualmachines/virtualmachinemodels/virtualmachine';
import {Volume} from '../virtualmachines/volumes/volume';
import {IResponseTemplate} from "./response-template";

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

    startVM(flavor: string, image: string, servername: string, project: string, projectid: string,
            volumename?: string, diskspace?: string): Observable<any> {

        const params: HttpParams = new HttpParams()
            .set('flavor', flavor)
            .set('image', image)
            .set('servername', servername)
            .set('project', project)
            .set('projectid', projectid)
            .set('diskspace', diskspace)
            .set('volumename', volumename);

        return this.http.post(this.baseVmUrl, params, {
            withCredentials: true,
            headers: header
        })
    }

    getAllVM(): Observable<VirtualMachine[]> {

        return this.http.get<VirtualMachine[]>(`${ApiSettings.getApiBaseURL()}voManager/vms/`, {
            withCredentials: true
        })
    }

    getVmsFromLoggedInUser(): Observable<VirtualMachine[]> {

        return this.http.get<VirtualMachine[]>(this.baseVmUrl, {
            withCredentials: true

        })
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

    deleteVM(openstack_id: string): Observable<VirtualMachine> {

        return this.http.delete<VirtualMachine>(`${this.baseVmUrl}${openstack_id}/`, {
            withCredentials: true,
            headers: header
        })

    }

    stopVM(openstack_id: string): Observable<VirtualMachine> {
        const params: HttpParams = new HttpParams().set('os_action', 'stop');

        return this.http.post<VirtualMachine> (`${this.baseVmUrl}${openstack_id}/action/`, params, {
            withCredentials: true,
            headers: header
        })
    }

    rebootVM(openstack_id: string, reboot_type: string): Observable<IResponseTemplate> {
        const params: HttpParams = new HttpParams().set('os_action', 'reboot').set('reboot_type', reboot_type);

        return this.http.post<IResponseTemplate> (`${this.baseVmUrl}${openstack_id}/action/`, params, {
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

        return this.http.post<Volume> (`${ApiSettings.getApiBaseURL()}volumes/`, params, {
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
