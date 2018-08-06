import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {VirtualMachineComponent} from '../virtualmachines/addvm.component'
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable} from 'rxjs';
import {ApiSettings} from './api-settings.service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {VirtualMachine} from '../virtualmachines/virtualmachinemodels/virtualmachine';
import {Volume} from "../virtualmachines/virtualmachinemodels/volume";

@Injectable()
export class VirtualmachineService {
    data: string;
    baseVmUrl = this.settings.getConnectorBaseUrl() + 'vms/'

    constructor(private http: Http, private settings: ApiSettings) {
    }


    startVM(flavor: string, image: string, servername: string, project: string, projectid: string,volumename?:string, diskspace?: string): Observable<Response> {

        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('flavor', flavor);
        urlSearchParams.append('image', image);
        urlSearchParams.append('servername', servername);

        urlSearchParams.append('project', project);
        urlSearchParams.append('projectid', projectid);
        urlSearchParams.append('diskspace', diskspace);
        urlSearchParams.append('volumename',volumename);

        return this.http.post(this.baseVmUrl + 'createVm/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }

    getAllVM(): Observable<VirtualMachine[]> {


        let urlSearchParams = new URLSearchParams();

        return this.http.get(this.baseVmUrl + 'getallVms/', {
            withCredentials: true,
            search: urlSearchParams
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }


    getVm(elixir_id: string): Observable<VirtualMachine[]> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('elixir_id', elixir_id)

        return this.http.get(this.baseVmUrl + 'getVmByUser/', {
            withCredentials: true,
            search: urlSearchParams
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }

    getActiveVmsByProject(groupid: string): Observable<VirtualMachine[]> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('groupid', groupid)

        return this.http.get(this.baseVmUrl + 'getActiveVmsByProject/', {
            withCredentials: true,
            search: urlSearchParams
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }


    checkStatusInactiveVms(elixir_id: string): Observable<VirtualMachine[]> {
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('elixir_id', elixir_id)

        return this.http.get(this.baseVmUrl + 'checkStatusInactiveVms/', {
            withCredentials: true,
            search: urlSearchParams
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    }


    checkVmStatus(openstack_id: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('openstack_id', openstack_id)


        return this.http.post(this.baseVmUrl + 'checkStatusVm/', urlSearchParams, {
            withCredentials: true,

            headers: header
        });
    }

    deleteVM(openstack_id: string): Observable<Response> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('openstack_id', openstack_id)

        return this.http.post(this.baseVmUrl + 'deleteVm/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }

    stopVM(openstack_id: string): Observable<Response> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('openstack_id', openstack_id)

        return this.http.post(this.baseVmUrl + 'stopVm/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }

    resumeVM(openstack_id: string): Observable<Response> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('openstack_id', openstack_id)

        return this.http.post(this.baseVmUrl + 'resumeVm/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }


    getVolumesByUser(): Observable<Volume[]> {
        let urlSearchParams = new URLSearchParams();

        return this.http.get(this.settings.getConnectorBaseUrl() + 'volumes/get_volumes/', {
            withCredentials: true,
            search: urlSearchParams
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    }




    createVolume(volume_name: string, volume_diskspace: string,vm_openstackid): Observable<Response> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('volume_name', volume_name);
        urlSearchParams.append('volume_diskspace', volume_diskspace);
                urlSearchParams.append('vm_openstackid', vm_openstackid);



        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/createVolume/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }

    attachVolumetoServer(volume_id: string, instance_id: string): Observable<Response> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('volume_id', volume_id)
        urlSearchParams.append('instance_id', instance_id)


        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/attachVolume/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }


    deleteVolume(volume_id: string): Observable<Response> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('volume_id', volume_id)


        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/deleteVolume/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }


    deleteVolumeAttachment(volume_id: string, instance_id: string): Observable<Response> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('volume_id', volume_id)
        urlSearchParams.append('instance_id', instance_id)


        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/deleteVolumeAttachment/', urlSearchParams, {
            withCredentials: true,
            headers: header,
        });
    }


}
