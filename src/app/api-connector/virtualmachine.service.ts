import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import 'rxjs/add/operator/catch';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {VirtualMachine} from '../virtualmachines/virtualmachinemodels/virtualmachine';
import {Volume} from "../virtualmachines/virtualmachinemodels/volume";

const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken")
});

@Injectable()
export class VirtualmachineService {
    data: string;
    baseVmUrl = this.settings.getConnectorBaseUrl() + 'vms/';

    constructor(private http: HttpClient, private settings: ApiSettings) {
    }


    startVM(flavor: string, image: string, servername: string, project: string, projectid: string, volumename?: string, diskspace?: string): Observable<any> {

        let params = new HttpParams()
            .set('flavor', flavor)
            .set('image', image)
            .set('servername', servername)
            .set('project', project)
            .set('projectid', projectid)
            .set('diskspace', diskspace)
            .set('volumename', volumename);

        return this.http.post(this.baseVmUrl + 'createVm/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getAllVM(): Observable<VirtualMachine[]> {

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'getallVms/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    getVm(elixir_id: string): Observable<VirtualMachine[]> {
        let params = new HttpParams().set('elixir_id', elixir_id);

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'getVmByUser/', {
            withCredentials: true,
            params: params
        }).pipe(catchError((error: any) => throwError(error)));
    }

    getActiveVmsByProject(groupid: string): Observable<VirtualMachine[]> {
        let params = new HttpParams().set('groupid', groupid);

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'getActiveVmsByProject/', {
            withCredentials: true,
            params: params
        }).pipe(catchError((error: any) => throwError(error)));
    }


    checkStatusInactiveVms(elixir_id: string): Observable<VirtualMachine[]> {
        let params = new HttpParams().set('elixir_id', elixir_id);

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'checkStatusInactiveVms/', {
            withCredentials: true,
            params: params
        }).pipe(catchError((error: any) => throwError(error)));
    }


    checkVmStatus(openstack_id: string): Observable<any> {
        let params = new HttpParams().set('openstack_id', openstack_id);
        return this.http.post(this.baseVmUrl + 'checkStatusVm/', params, {
            withCredentials: true,

            headers: header
        }).pipe(catchError((error: any) => throwError(error)));
        ;
    }

    deleteVM(openstack_id: string): Observable<any> {

        let params = new HttpParams().set('openstack_id', openstack_id);
        return this.http.post(this.baseVmUrl + 'deleteVm/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
        ;
    }

    stopVM(openstack_id: string): Observable<any> {

        let params = new HttpParams().set('openstack_id', openstack_id);

        return this.http.post(this.baseVmUrl + 'stopVm/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    resumeVM(openstack_id: string): Observable<any> {

        let params = new HttpParams().set('openstack_id', openstack_id);
        ;

        return this.http.post(this.baseVmUrl + 'resumeVm/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));

    }


    getVolumesByUser(): Observable<Volume[]> {
        return this.http.get<Volume[]>(this.settings.getConnectorBaseUrl() + 'volumes/get_volumes/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));

    }


    createVolume(volume_name: string, volume_diskspace: string, vm_openstackid): Observable<any> {
        let params = new HttpParams().set('volume_name', volume_name)
            .set('volume_diskspace', volume_diskspace)
            .set('vm_openstackid', vm_openstackid);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/createVolume/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }

    attachVolumetoServer(volume_id: string, instance_id: string): Observable<any> {

        let params = new HttpParams().set('volume_id', volume_id).set('instance_id', instance_id);


        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/attachVolume/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    deleteVolume(volume_id: string): Observable<any> {

        let params = new HttpParams().set('volume_id',volume_id);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/deleteVolume/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }


    deleteVolumeAttachment(volume_id: string, instance_id: string): Observable<any> {

        let params = new HttpParams().set('volume_id',volume_id).set('instance_id',instance_id)

        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/deleteVolumeAttachment/', params, {
            withCredentials: true,
            headers: header,
        }).pipe(catchError((error: any) => throwError(error)));
    }


}
