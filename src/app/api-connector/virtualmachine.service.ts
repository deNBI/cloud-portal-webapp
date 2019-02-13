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

        return this.http.post(this.baseVmUrl, params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getAllVM(): Observable<VirtualMachine[]> ***REMOVED***

        return this.http.get<VirtualMachine[]>(this.settings.getConnectorBaseUrl() + 'voManager/vms/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    getVmsFromLoggedInUser(): Observable<VirtualMachine[]> ***REMOVED***

        return this.http.get<VirtualMachine[]>(this.baseVmUrl, ***REMOVED***
            withCredentials: true,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getActiveVmsByProject(groupid: string): Observable<VirtualMachine[]> ***REMOVED***

        return this.http.get<VirtualMachine[]>(this.settings.getApiBaseURL() + 'projects/' + groupid + '/vms/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    checkStatusInactiveVms(): Observable<VirtualMachine[]> ***REMOVED***

        return this.http.get<VirtualMachine[]>(this.baseVmUrl + 'status/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    checkVmStatus(openstack_id: string): Observable<any> ***REMOVED***
        return this.http.post(this.baseVmUrl + openstack_id + '/status/', null,***REMOVED***
            withCredentials: true,

            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    deleteVM(openstack_id: string): Observable<any> ***REMOVED***

        return this.http.delete(this.baseVmUrl + openstack_id +'/', ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    stopVM(openstack_id: string): Observable<any> ***REMOVED***
                let params = new HttpParams().set('os_action', 'stop');


        return this.http.post(this.baseVmUrl + openstack_id + '/action/' , params,***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


      rebootVM(openstack_id: string,reboot_type:string): Observable<any> ***REMOVED***
                let params = new HttpParams().set('os_action', 'reboot').set('reboot_type',reboot_type);


        return this.http.post(this.baseVmUrl + openstack_id + '/action/' , params,***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    resumeVM(openstack_id: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('os_action', 'resume');


        return this.http.post(this.baseVmUrl + openstack_id + '/action/',params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    getVolumesByUser(): Observable<Volume[]> ***REMOVED***
        return this.http.get<Volume[]>(this.settings.getConnectorBaseUrl() + 'volumes/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    createVolume(volume_name: string, volume_diskspace: string, vm_openstackid): Observable<any> ***REMOVED***
        let params = new HttpParams().set('volume_name', volume_name)
            .set('volume_diskspace', volume_diskspace)
            .set('vm_openstackid', vm_openstackid);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    attachVolumetoServer(volume_id: string, instance_id: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('instance_id', instance_id).set('os_action','attach');


        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/'+ volume_id + '/action/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    renameVolume(volume_id: string, new_volume_name: string): Observable<any> ***REMOVED***
        let params = new HttpParams().set('new_volume_name', new_volume_name);

        return this.http.patch(this.settings.getConnectorBaseUrl() + 'volumes/' + volume_id + '/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    deleteVolume(volume_id: string): Observable<any> ***REMOVED***

        return this.http.delete(this.settings.getConnectorBaseUrl() + 'volumes/'+ volume_id + '/', ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


    deleteVolumeAttachment(volume_id: string, instance_id: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('instance_id', instance_id).set('os_action','detach');

        return this.http.post(this.settings.getConnectorBaseUrl() + 'volumes/' + volume_id + '/action/', params, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***


***REMOVED***
