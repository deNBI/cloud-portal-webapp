import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***VirtualMachine***REMOVED*** from '../virtualmachines/virtualmachinemodels/virtualmachine';
import ***REMOVED***Volume***REMOVED*** from "../virtualmachines/virtualmachinemodels/volume";

const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get("csrftoken")
***REMOVED***);

@Injectable()
export class VirtualmachineService ***REMOVED***
    data: string;
    baseVmUrl = this.settings.getConnectorBaseUrl() + 'vms/';

    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***


    startVM(flavor: string, image: string, servername: string, project: string, projectid: string, volumename?: string, diskspace?: string): Observable<any> ***REMOVED***

        let params = new HttpParams()
            .set('flavor', flavor)
            .set('image', image)
            .set('servername', servername)
            .set('project', project)
            .set('projectid', projectid)
            .set('diskspace', diskspace)
            .set('volumename', volumename);

        return this.http.post(this.baseVmUrl + 'createVm/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getAllVM(): Observable<VirtualMachine[]> ***REMOVED***

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'getallVms/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getVm(elixir_id: string): Observable<VirtualMachine[]> ***REMOVED***
        let params = new HttpParams().set('elixir_id', elixir_id);

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'getVmByUser/', ***REMOVED***
            withCredentials: true,
            params: params
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getActiveVmsByProject(groupid: string): Observable<VirtualMachine[]> ***REMOVED***
        let params = new HttpParams().set('groupid', groupid);

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'getActiveVmsByProject/', ***REMOVED***
            withCredentials: true,
            params: params
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    checkStatusInactiveVms(elixir_id: string): Observable<VirtualMachine[]> ***REMOVED***
        let params = new HttpParams().set('elixir_id', elixir_id);

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'checkStatusInactiveVms/', ***REMOVED***
            withCredentials: true,
            params: params
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    checkVmStatus(openstack_id: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('openstack_id', openstack_id);
        return this.http.post(this.baseVmUrl + 'checkStatusVm/', params, ***REMOVED***
            withCredentials: true,

            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
        ;
    ***REMOVED***

    deleteVM(openstack_id: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('openstack_id', openstack_id);
        return this.http.post(this.baseVmUrl + 'deleteVm/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
        ;
    ***REMOVED***

    stopVM(openstack_id: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('openstack_id', openstack_id);

        return this.http.post(this.baseVmUrl + 'stopVm/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    resumeVM(openstack_id: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('openstack_id', openstack_id);
        ;

        return this.http.post(this.baseVmUrl + 'resumeVm/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    getVolumesByUser(): Observable<Volume[]> ***REMOVED***
        return this.http.get<Volume[]>(this.settings.getConnectorBaseUrl() + 'volumes/get_volumes/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    createVolume(volume_name: string, volume_diskspace: string, vm_openstackid): Observable<any> ***REMOVED***
        let params = new HttpParams().set('volume_name', volume_name)
            .set('volume_diskspace', volume_diskspace)
            .set('vm_openstackid', vm_openstackid);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/createVolume/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    attachVolumetoServer(volume_id: string, instance_id: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('volume_id', volume_id).set('instance_id', instance_id);


        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/attachVolume/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    deleteVolume(volume_id: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('volume_id',volume_id);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/deleteVolume/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    deleteVolumeAttachment(volume_id: string, instance_id: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('volume_id',volume_id).set('instance_id',instance_id)

        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/deleteVolumeAttachment/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


***REMOVED***
