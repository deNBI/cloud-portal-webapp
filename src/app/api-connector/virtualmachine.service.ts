import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***URLSearchParams***REMOVED*** from '@angular/http';
import ***REMOVED***VirtualMachineComponent***REMOVED*** from '../virtualmachines/addvm.component'
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import ***REMOVED***VirtualMachine***REMOVED*** from '../virtualmachines/virtualmachinemodels/virtualmachine';
import ***REMOVED***Volume***REMOVED*** from "../virtualmachines/virtualmachinemodels/volume";

@Injectable()
export class VirtualmachineService ***REMOVED***
    data: string;
    baseVmUrl = this.settings.getConnectorBaseUrl() + 'vms/'

    constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***


    startVM(flavor: string, image: string, servername: string, project: string, projectid: string,volumename?:string, diskspace?: string): Observable<Response> ***REMOVED***

        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('flavor', flavor);
        urlSearchParams.append('image', image);
        urlSearchParams.append('servername', servername);

        urlSearchParams.append('project', project);
        urlSearchParams.append('projectid', projectid);
        urlSearchParams.append('diskspace', diskspace);
        urlSearchParams.append('volumename',volumename);

        return this.http.post(this.baseVmUrl + 'createVm/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***

    getAllVM(): Observable<VirtualMachine[]> ***REMOVED***


        let urlSearchParams = new URLSearchParams();

        return this.http.get(this.baseVmUrl + 'getallVms/', ***REMOVED***
            withCredentials: true,
            search: urlSearchParams
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    ***REMOVED***


    getVm(elixir_id: string): Observable<VirtualMachine[]> ***REMOVED***
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('elixir_id', elixir_id)

        return this.http.get(this.baseVmUrl + 'getVmByUser/', ***REMOVED***
            withCredentials: true,
            search: urlSearchParams
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    ***REMOVED***

    getActiveVmsByProject(groupid: string): Observable<VirtualMachine[]> ***REMOVED***
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('groupid', groupid)

        return this.http.get(this.baseVmUrl + 'getActiveVmsByProject/', ***REMOVED***
            withCredentials: true,
            search: urlSearchParams
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    ***REMOVED***


    checkStatusInactiveVms(elixir_id: string): Observable<VirtualMachine[]> ***REMOVED***
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('elixir_id', elixir_id)

        return this.http.get(this.baseVmUrl + 'checkStatusInactiveVms/', ***REMOVED***
            withCredentials: true,
            search: urlSearchParams
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
    ***REMOVED***


    checkVmStatus(openstack_id: string): Observable<any> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('openstack_id', openstack_id)


        return this.http.post(this.baseVmUrl + 'checkStatusVm/', urlSearchParams, ***REMOVED***
            withCredentials: true,

            headers: header
        ***REMOVED***);
    ***REMOVED***

    deleteVM(openstack_id: string): Observable<Response> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('openstack_id', openstack_id)

        return this.http.post(this.baseVmUrl + 'deleteVm/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***

    stopVM(openstack_id: string): Observable<Response> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('openstack_id', openstack_id)

        return this.http.post(this.baseVmUrl + 'stopVm/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***

    resumeVM(openstack_id: string): Observable<Response> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('openstack_id', openstack_id)

        return this.http.post(this.baseVmUrl + 'resumeVm/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***


    getVolumesByUser(): Observable<Volume[]> ***REMOVED***
        let urlSearchParams = new URLSearchParams();

        return this.http.get(this.settings.getConnectorBaseUrl() + 'volumes/get_volumes/', ***REMOVED***
            withCredentials: true,
            search: urlSearchParams
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'));


    ***REMOVED***




    createVolume(volume_name: string, volume_diskspace: string,vm_openstackid): Observable<Response> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('volume_name', volume_name);
        urlSearchParams.append('volume_diskspace', volume_diskspace);
                urlSearchParams.append('vm_openstackid', vm_openstackid);



        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/createVolume/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***

    attachVolumetoServer(volume_id: string, instance_id: string): Observable<Response> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('volume_id', volume_id)
        urlSearchParams.append('instance_id', instance_id)


        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/attachVolume/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***


    deleteVolume(volume_id: string): Observable<Response> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('volume_id', volume_id)


        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/deleteVolume/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***


    deleteVolumeAttachment(volume_id: string, instance_id: string): Observable<Response> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('volume_id', volume_id)
        urlSearchParams.append('instance_id', instance_id)


        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/deleteVolumeAttachment/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***


***REMOVED***
