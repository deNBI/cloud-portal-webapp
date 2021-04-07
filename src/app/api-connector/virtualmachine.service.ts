import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiSettings } from './api-settings.service';
import { VirtualMachine } from '../virtualmachines/virtualmachinemodels/virtualmachine';
import { Volume } from '../virtualmachines/volumes/volume';
import { IResponseTemplate } from './response-template';
import { Clusterinfo, WorkerBatch } from '../virtualmachines/clusters/clusterinfo';
import { Image } from '../virtualmachines/virtualmachinemodels/image';
import { Condalog } from '../virtualmachines/conda/condalog';

/**
 * Service which provides vm methods.
 */
@Injectable()
export class VirtualmachineService {

	data: string;
	baseVmUrl: string = `${ApiSettings.getApiBaseURL()}vms/`;

	constructor(private http: HttpClient) {
		this.http = http;
	}

	getClusterAllowed(): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}clusters/allowed/`, {
			withCredentials: true,
		});
	}

	startCluster(masterFlavor: string, masterImage: Image, workerBatches: WorkerBatch[],
		project_id: string | number): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('master_flavor', masterFlavor)
			.set('master_image', JSON.stringify(masterImage))
			.set('worker_batches', encodeURIComponent(JSON.stringify(workerBatches)))
			.set('project_id', project_id.toString());

		return this.http.post(`${ApiSettings.getApiBaseURL()}clusters/`, params, {
			withCredentials: true,
		});
	}

	getClusterInfo(cluster_id: string): Observable<Clusterinfo> {
		return this.http.get<Clusterinfo>(`${ApiSettings.getApiBaseURL()}clusters/${cluster_id}/`, {
			withCredentials: true,
		});
	}

	scaleCluster(cluster_id: string, worker_batch: WorkerBatch): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('worker_batch', encodeURIComponent(JSON.stringify(worker_batch)));

		return this.http.post(`${ApiSettings.getApiBaseURL()}clusters/${cluster_id}/scale-up/`, params, {
			withCredentials: true,
		});
	}

	scaleClusterNewBatch(cluster_id: string, worker_batch: WorkerBatch): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('worker_batch', encodeURIComponent(JSON.stringify(worker_batch)));

		return this.http.post(`${ApiSettings.getApiBaseURL()}clusters/${cluster_id}/scale-up/new/`, params, {
			withCredentials: true,
		});
	}

	scaleDownCluster(cluster_id: string, worker_batches: WorkerBatch[]): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('worker_batches', encodeURIComponent(JSON.stringify(worker_batches)));

		return this.http.post(`${ApiSettings.getApiBaseURL()}clusters/${cluster_id}/scale-down/`, params, {
			withCredentials: true,
		});
	}

	getClusters(page: number, cluster_per_site: number, filter?: string): Observable<Clusterinfo[]> {
		let params: HttpParams = new HttpParams().set('page', page.toString()).set('cluster_per_site', cluster_per_site.toString());

		if (filter) {
			params = params.set('filter', filter);

		}

		return this.http.get<Clusterinfo[]>(`${ApiSettings.getApiBaseURL()}clusters/`, {
			withCredentials: true,
			params,
		});
	}

	deleteCluster(cluster_id: string): Observable<void> {
		return this.http.delete<void>(`${ApiSettings.getApiBaseURL()}clusters/${cluster_id}/`, {
			withCredentials: true,
		});
	}

	startVM(flavor: string, image: Image, servername: string, project: string, projectid: string,
		http: boolean, https: boolean, udp: boolean, new_volumes: Volume[], attach_volumes: Volume[],
		playbook_information?: string, additional_elixir_ids?: string[]): Observable<any> {

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
			.set('additional_elixir_ids', JSON.stringify(additional_elixir_ids));

		return this.http.post(this.baseVmUrl, params, {
			withCredentials: true,
		});
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
			params,

		});
	}

	getAllClusters(page: number, vm_per_site: number, filter?: string): Observable<Clusterinfo[]> {
		let params: HttpParams = new HttpParams().set('page', page.toString()).set('cluster_per_site', vm_per_site.toString());

		if (filter) {
			params = params.set('filter', filter);

		}

		return this.http.get<Clusterinfo[]>(`${ApiSettings.getApiBaseURL()}voManager/vms/clusters/`, {
			withCredentials: true,
			params,
		});
	}

	getVmById(openstackId: string): Observable<VirtualMachine> {

		return this.http.get<VirtualMachine>(`${this.baseVmUrl}${openstackId}/details/`, {
			withCredentials: true,
		});
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
			params,

		});
	}

	getCondaLogs(openstack_id: string): Observable<Condalog> {
		return this.http.post<Condalog>(`${this.baseVmUrl}${openstack_id}/logs/`, null, {
			withCredentials: true,
		});
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
				params,

			});
	}

	getActiveVmsByProject(groupid: string): Observable<VirtualMachine[]> {

		return this.http.get<VirtualMachine[]>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/vms/`, {
			withCredentials: true,
		});
	}

	checkStatusInactiveVms(): Observable<VirtualMachine[]> {

		return this.http.get<VirtualMachine[]>(`${this.baseVmUrl}status/`, {
			withCredentials: true,
		});
	}

	checkVmStatus(openstack_id: string, name?: string): Observable<any> {
		if (openstack_id) {
			return this.http.post(`${this.baseVmUrl}${openstack_id}/status/`, null, {
				withCredentials: true,
			});
		} else if (name) {
			return this.http.post(`${this.baseVmUrl}${name}/status/`, null, {
				withCredentials: true,
			});
		} else {
			return null;
		}
	}

	deleteVms(vm_ids: string[]): Observable<IResponseTemplate> {
		const params: HttpParams = new HttpParams().set('vm_ids', JSON.stringify(vm_ids));

		return this.http.post<IResponseTemplate>(`${this.baseVmUrl}/delete/`, params, {
			withCredentials: true,
		});
	}

	checkVmStatusWhenReboot(openstack_id: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('reboot', 'true');

		return this.http.post(`${this.baseVmUrl}${openstack_id}/status/`, params, {
			withCredentials: true,
		});
	}

	deleteVM(openstack_id: string): Observable<VirtualMachine> {

		return this.http.delete<VirtualMachine>(`${this.baseVmUrl}${openstack_id}/`, {
			withCredentials: true,
		});

	}

	setVmNeeded(openstack_id: string): Observable<any> {
		return this.http.post<any>(`${this.baseVmUrl}${openstack_id}/need/`, null, {
			withCredentials: true,
		});
	}

	stopVM(openstack_id: string): Observable<VirtualMachine> {
		const params: HttpParams = new HttpParams().set('os_action', 'stop');

		return this.http.post<VirtualMachine>(`${this.baseVmUrl}${openstack_id}/action/`, params, {
			withCredentials: true,
		});
	}

	rebootVM(openstack_id: string, reboot_type: string): Observable<IResponseTemplate> {
		const params: HttpParams = new HttpParams().set('os_action', 'reboot').set('reboot_type', reboot_type);

		return this.http.post<IResponseTemplate>(`${this.baseVmUrl}${openstack_id}/action/`, params, {
			withCredentials: true,
		});
	}

	resumeVM(openstack_id: string): Observable<VirtualMachine> {

		const params: HttpParams = new HttpParams().set('os_action', 'resume');

		return this.http.post<VirtualMachine>(`${this.baseVmUrl}${openstack_id}/action/`, params, {
			withCredentials: true,
		});

	}

	getDetachedVolumesByProject(project_id: string | number): Observable<Volume[]> {

		return this.http.get<Volume[]>(`${ApiSettings.getApiBaseURL()}volumes/project/${project_id}/`, {
			withCredentials: true,
		});

	}

	getVolumesByUser(items_per_page: number, current_page: number, filter?: string): Observable<Volume[]> {
		let params: HttpParams = new HttpParams().set('items_per_page', items_per_page.toString()).set('page', current_page.toString());
		if (filter) {
			params = params.set('filter', filter);

		}

		return this.http.get<Volume[]>(`${ApiSettings.getApiBaseURL()}volumes/`, {
			withCredentials: true,
			params,
		});

	}

	getVolumeById(id: string): Observable<Volume> {
		return this.http.get<Volume>(`${ApiSettings.getApiBaseURL()}volumes/${id}/`, {
			withCredentials: true,
		});

	}

	getVolumeByNameAndVmName(volume_name: string, virtualmachine_name: string): Observable<Volume> {
		const params: HttpParams = new HttpParams().set('volume_name', volume_name);

		return this.http.get<Volume>(`${ApiSettings.getApiBaseURL()}volumes/vms/${virtualmachine_name}/`, {
			withCredentials: true,
			params,
		});

	}

	createVolume(volume_name: string, volume_storage: string, vm_openstackid: string): Observable<Volume> {
		const params: HttpParams = new HttpParams().set('volume_name', volume_name)
			.set('volume_storage', volume_storage)
			.set('vm_openstackid', vm_openstackid);

		return this.http.post<Volume>(`${ApiSettings.getApiBaseURL()}volumes/`, params, {
			withCredentials: true,
		});
	}

	extendVolume(volume_id: string, new_size: string): Observable<IResponseTemplate> {

		const params: HttpParams = new HttpParams().set('os_action', 'extend').set('new_size', new_size);

		return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/action/`, params, {
			withCredentials: true,
		});

	}

	attachVolumetoServer(volume_id: string, instance_id: string): Observable<IResponseTemplate> {

		const params: HttpParams = new HttpParams().set('instance_id', instance_id).set('os_action', 'attach');

		return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/action/`, params, {
			withCredentials: true,
		});

	}

	renameVolume(volume_id: string, new_volume_name: string): Observable<Volume> {
		const params: HttpParams = new HttpParams().set('new_volume_name', new_volume_name);

		return this.http.patch<Volume>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/`, params, {
			withCredentials: true,
		});

	}

	deleteVolume(volume_id: string): Observable<IResponseTemplate> {

		return this.http.delete<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/`, {
			withCredentials: true,
		});
	}

	deleteVolumes(volume_ids: string[]): Observable<IResponseTemplate> {
		const params: HttpParams = new HttpParams().set('volume_ids', JSON.stringify(volume_ids));

		return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/delete/`, params, {
			withCredentials: true,
		});
	}

	deleteVolumeAttachment(volume_id: string, instance_id: string): Observable<IResponseTemplate> {

		const params: HttpParams = new HttpParams().set('instance_id', instance_id).set('os_action', 'detach');

		return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/${volume_id}/action/`, params, {
			withCredentials: true,
		});
	}

	deleteVolumeAttachments(volume_ids: string[]): Observable<IResponseTemplate> {

		const params: HttpParams = new HttpParams().set('volume_ids', JSON.stringify(volume_ids));

		return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}volumes/attachments/delete/`, params, {
			withCredentials: true,
		});
	}
}
