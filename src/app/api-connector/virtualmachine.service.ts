import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {VirtualMachine} from '../virtualmachines/virtualmachinemodels/virtualmachine';
import {Volume} from '../virtualmachines/virtualmachinemodels/volume';

const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});

@Injectable()
export class VirtualmachineService {
    data: string;
    baseVmUrl = this.settings.getApiBaseURL() + 'vms/';

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }


    startVM(flavor: string, image: string, servername: string, project: string, projectid: string,
            volumename?: string, diskspace?: string): Observable<any> {

        const params = new HttpParams()
            .set('flavor', flavor)
            .set('image', image)
            .set('servername', servername)
            .set('project', project)
            .set('projectid', projectid)
            .set('diskspace', diskspace)
            .set('volumename', volumename);

        return this.http.post(this.baseVmUrl, params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getAllVM(): Observable<VirtualMachine[]> {

        return this.http.get<VirtualMachine[]>(this.settings.getApiBaseURL() + 'voManager/vms/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    getVmsFromLoggedInUser(): Observable<VirtualMachine[]> {

        return this.http.get<VirtualMachine[]>(this.baseVmUrl, {
            withCredentials: true,

        }).pipe(catchError((error: any) => throwError(error)));
    }

    getActiveVmsByProject(groupid: string): Observable<VirtualMachine[]> {

        return this.http.get<VirtualMachine[]>(this.settings.getApiBaseURL() + 'projects/' + groupid + '/vms/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    checkStatusInactiveVms(): Observable<VirtualMachine[]> {

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'status/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    checkVmStatus(openstack_id: string): Observable<any> {
        return this.http.post(this.baseVmUrl + openstack_id + '/status/', null, {
            withCredentials: true,

            headers: header
        }).pipe(catchError((error: any) => throwError(error)));

    }

    deleteVM(openstack_id: string): Observable<any> {

        return this.http.delete(this.baseVmUrl + openstack_id + '/', {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }

    stopVM(openstack_id: string): Observable<any> {
        const params = new HttpParams().set('os_action', 'stop');


        return this.http.post(this.baseVmUrl + openstack_id + '/action/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    rebootVM(openstack_id: string, reboot_type: string): Observable<any> {
        const params = new HttpParams().set('os_action', 'reboot').set('reboot_type', reboot_type);


        return this.http.post(this.baseVmUrl + openstack_id + '/action/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    resumeVM(openstack_id: string): Observable<any> {

        const params = new HttpParams().set('os_action', 'resume');


        return this.http.post(this.baseVmUrl + openstack_id + '/action/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }


    getVolumesByUser(): Observable<Volume[]> {
        return this.http.get<Volume[]>(this.settings.getApiBaseURL() + 'volumes/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }


    createVolume(volume_name: string, volume_diskspace: string, vm_openstackid): Observable<any> {
        const params = new HttpParams().set('volume_name', volume_name)
            .set('volume_diskspace', volume_diskspace)
            .set('vm_openstackid', vm_openstackid);

        return this.http.post(this.settings.getApiBaseURL() + 'volumes/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    attachVolumetoServer(volume_id: string, instance_id: string): Observable<any> {

        const params = new HttpParams().set('instance_id', instance_id).set('os_action', 'attach');


        return this.http.post(this.settings.getApiBaseURL() + 'volumes/' + volume_id + '/action/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    renameVolume(volume_id: string, new_volume_name: string): Observable<any> {
        const params = new HttpParams().set('new_volume_name', new_volume_name);

        return this.http.patch(this.settings.getApiBaseURL() + 'volumes/' + volume_id + '/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }


    deleteVolume(volume_id: string): Observable<any> {

        return this.http.delete(this.settings.getApiBaseURL() + 'volumes/' + volume_id + '/', {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    deleteVolumeAttachment(volume_id: string, instance_id: string): Observable<any> {

        const params = new HttpParams().set('instance_id', instance_id).set('os_action', 'detach');

        return this.http.post(this.settings.getApiBaseURL() + 'volumes/' + volume_id + '/action/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }


}
