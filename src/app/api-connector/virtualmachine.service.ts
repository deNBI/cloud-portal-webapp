import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***VirtualMachine***REMOVED*** from '../virtualmachines/virtualmachinemodels/virtualmachine';
import ***REMOVED***Volume***REMOVED*** from '../virtualmachines/volumes/volume';
import ***REMOVED***IResponseTemplate***REMOVED*** from "./response-template";
import ***REMOVED***IBiocondaTool***REMOVED*** from '../virtualmachines/conda/bioconda.component';

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
            volumename?: string, diskspace?: string, bioconda_tools?: string): Observable<any> ***REMOVED***

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
            .set('bioconda_tools', bioconda_tools);

        return this.http.post(this.baseVmUrl, params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***)
    ***REMOVED***

    getAllVM(): Observable<VirtualMachine[]> ***REMOVED***

        return this.http.get<VirtualMachine[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***voManager/vms/`, ***REMOVED***
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getVmsFromLoggedInUser(): Observable<VirtualMachine[]> ***REMOVED***

        return this.http.get<VirtualMachine[]>(this.baseVmUrl, ***REMOVED***
            withCredentials: true

        ***REMOVED***)
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
