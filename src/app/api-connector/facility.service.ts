import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiSettings } from './api-settings.service';
import { Application } from '../applications/application.model/application.model';
import { VolumeStorageFactor } from '../facility_manager/resources/volume-storage-factor';
import { ObjectStorageFactor } from '../facility_manager/resources/object-storage-factor';
import { ResourceMachine } from '../facility_manager/resources/resource-machine';
import { ProjectMember } from '../projectmanagement/project_member.model';
import { GPUSpecification } from '../facility_manager/resources/gpu-specification';
import { GeneralStorageFactor } from '../facility_manager/resources/general-storage-factor';
import { ClusterPage } from '../virtualmachines/clusters/clusterPage.model';
import { VolumePage } from '../virtualmachines/volumes/volumePage.model';
import { SnapshotPage } from '../virtualmachines/snapshots/snapshotPage.model';

/**
 * Service which provides methods for the facilities.
 */
@Injectable()
export class FacilityService {
	constructor(private http: HttpClient) {
		this.http = http;
	}

	/**
	 * Get all available computecenters.
	 *
	 * @returns
	 */
	getComputeCenters(): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/`, {
			withCredentials: true,
		});
	}

	getWfcSubmittedApplications(facility_id: number | string): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/wfc/submitted/`, {
			withCredentials: true,

		});

	}

	getWfcLifetimeRequestedApplications(facility_id: number | string): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/wfc/lifetime_requests/`, {
			withCredentials: true,

		});

	}

	getWfcTerminationRequestedApplications(facility_id: number | string): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/wfc/termination_requests/`, {
			withCredentials: true,
		});
	}

	getClustersFacility(facility_id: string, page: number, vm_per_site: number, filter?: string): Observable<ClusterPage> {
		let params: HttpParams = new HttpParams().set('page', page.toString()).set('cluster_per_site', vm_per_site.toString());

		if (filter) {
			params = params.set('filter', filter);

		}

		return this.http.get<ClusterPage>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/clusters/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(cluster_page: ClusterPage): ClusterPage => new ClusterPage(cluster_page),
			),
		);
	}

	getComputeCenterClientLimits(facility_id): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/simpleVM/limits/`, {
			withCredentials: true,
		});
	}

	getComputeCenterClientLimitsAvailable(facility_id, application_id): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/simpleVM/${application_id}/limits/`, {
			withCredentials: true,
		});
	}

	getWfcModificationRequestedApplications(facility_id: number | string): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/wfc/modifications_requests/`, {
			withCredentials: true,
		});

	}

	getWfcCreditsRequestedApplications(facility_id: number | string): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/wfc/credits_requests/`, {
			withCredentials: true,
		});

	}

	getExtensionRequestsCounterFacility(facility_id: number | string): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility_id}/extensions_counter/`, {
			withCredentials: true,
		});

	}

	/**
	 * Sets the newsID of the facility news which contains the motd for facility with the corresponding facility ID.
	 *
	 * @param facilityID facility id of the facility to set the id
	 * @param newsId the id of the news containing the motd
	 */
	setMOTDForFacility(facilityID: string, newsId: string): Observable<any> {
		const httpParams: HttpParams = new HttpParams().set('facilityID', facilityID).set('newsID', newsId);

		return this.http.post(`${ApiSettings.getApiBaseURL()}wp-motd-management/`, httpParams, {
			withCredentials: true,
		});
	}

	/**
	 * Get all facility, where the current user is manager.
	 *
	 * @returns
	 */
	getManagerFacilities(): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}facilityManagers/current/facilities/`, {
			withCredentials: true,
		});

	}

	getAllMembersOfFacility(facility: number | string, status: number): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/members/`, {
			withCredentials: true,
			params: { status: status.toString() },

		});
	}

	/**
	 * Get allowed groups from a facility with a specific status.
	 *
	 * @param facility
	 * @param status
	 * @returns
	 */
	getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility: number | string, status: number): Observable<Application[]> {

		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/`, {
			withCredentials: true,
			params: { status: status.toString() },
		}).pipe(
			map(
				(applications: Application[]): Application[] => applications.map(
					(application: Application): Application => new Application(application),
				),
			),
		);
	}

	/**
	 * Gets FacilityGroups by the elixirId of the member.
	 *
	 * @param facility the facility
	 * @param elixir_id the id of the member
	 */
	getFacilityGroupsByMemberElixirId(facility: number | string, elixir_id: string): Observable<Application[]> {

		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/filter/`, {
			withCredentials: true,
			params: { elixir_id: elixir_id.toString() },
		}).pipe(
			map(
				(applications: Application[]): Application[] => applications.map(
					(application: Application): Application => new Application(application),
				),
			),
		);
	}

	/**
	 * Get all resources assigned to a facility.
	 *
	 * @param facility id of the facility
	 * @returns
	 */
	getFacilityResources(facility: number | string): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/resources/`, {
			withCredentials: true,
		});
	}

	/**
	 * Gets all facility applications which are waiting for conirmation.
	 *
	 * @param facility
	 * @returns
	 */
	getFacilityApplicationsWaitingForConfirmation(facility: number | string): Observable<Application[]> {

		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/`, {
			withCredentials: true,
		});
	}

	/**
	 * Gets all facility applications history.
	 *
	 * @param facility
	 * @returns
	 */
	getFacilityApplicationsHistory(facility: number | string): Observable<Application[]> {

		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications_history/`, {
			withCredentials: true,
		});
	}

	/**
	 * Get application for facility by id.
	 *
	 * @param facility self-speaking
	 * @param id self-speaking
	 */
	getFacilityApplicationById(facility: number | string, id: string): Observable<Application> {

		return this.http.get<Application>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/${id}/detail/`, {
			withCredentials: true,
		});
	}

	/**
	 * Gets all volumes from a specific facility.
	 *
	 * @param facility
	 * @returns
	 */
	getFacilityVolumes(facility: number | string, items_per_page: number, current_page: number): Observable<VolumePage> {
		const params: HttpParams = new HttpParams().set('items_per_page', items_per_page.toString()).set('page', current_page.toString());

		return this.http.get<VolumePage>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/volumes/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(volume_page: VolumePage): VolumePage => new VolumePage(volume_page),
			),
		);
	}

	/**
	 * Gets all volumes from a specific facility.
	 *
	 * @param facility
	 * @param currentPage
	 * @param snapsPerSite
	 * @returns
	 */
	getFacilitySnapshots(facility: number | string, currentPage: number, snapsPerSite: number, filter?: string): Observable<SnapshotPage> {
		let params: HttpParams = new HttpParams().set('page', currentPage.toString()).set('snaps_per_site', snapsPerSite.toString());
		if (filter) {
			params = params.set('filter', filter);
		}

		return this.http.get<SnapshotPage>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/snapshots/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(snapshot_page: SnapshotPage): SnapshotPage => new SnapshotPage(snapshot_page),
			),
		);
	}

	/**
	 * Gets all facility modification applications which are waiting for conirmation.
	 *
	 * @param facility
	 * @returns
	 */
	getFacilityModificationApplicationsWaitingForConfirmation(facility: number | string): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/modification_applications/`, {
			withCredentials: true,
		});
	}

	/**
	 * Approves an facility application.
	 *
	 * @param facility
	 * @param application_id
	 * @returns
	 */
	approveFacilityApplication(facility: number | string, application_id: number | string): Observable<any> {
		const params: HttpParams = new HttpParams().set('action', 'approve');

		return this.http.post(
			`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/${application_id}/status/`,
			params,
			{
				withCredentials: true,
				observe: 'response',
			},
		);
	}

	addVolumeStorageFactor(facility: number | string, volumeStorageFactor: VolumeStorageFactor): Observable<VolumeStorageFactor[]> {
		const params: HttpParams = new HttpParams().set('volumeStorageFactor', JSON.stringify(volumeStorageFactor));

		return this.http.post<VolumeStorageFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/volumeStorageFactors/`, params, {
			withCredentials: true,
		});
	}

	addObjectStorageFactor(facility: number | string, objectStorageFactor: ObjectStorageFactor): Observable<ObjectStorageFactor[]> {
		const params: HttpParams = new HttpParams().set('objectStorageFactor', JSON.stringify(objectStorageFactor));

		return this.http.post<VolumeStorageFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/objectStorageFactors/`, params, {
			withCredentials: true,
		});
	}

	/**
	 * Deletes an RamFactor.
	 *
	 * @param facility
	 * @param resource_machine_id
	 * @returns
	 */
	deleteResourceMachine(facility: number | string, resource_machine_id: number | string): Observable<ResourceMachine[]> {

		return this.http.delete<ResourceMachine[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/resourcesMachine/${resource_machine_id}/`, {
			withCredentials: true,
		});
	}

	addResourceMachine(facility: number | string, resource_machine: ResourceMachine): Observable<ResourceMachine[]> {
		const params: HttpParams = new HttpParams().set('resource_machine', JSON.stringify(resource_machine));

		return this.http.post<ResourceMachine[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/resourcesMachine/`, params, {
			withCredentials: true,
		});
	}

	updateResourceMachine(facility: number | string, resource_machine: ResourceMachine): Observable<ResourceMachine> {
		const params: HttpParams = new HttpParams().set('resource_machine', JSON.stringify(resource_machine));

		// tslint:disable-next-line:max-line-length
		return this.http.post<ResourceMachine>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/resourcesMachine/${resource_machine.id}/`, params, {
			withCredentials: true,
		});
	}

	getResourceMachine(facility: number | string, resource_machine_id: number | string): Observable<ResourceMachine> {

		return this.http.get<ResourceMachine>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/resourcesMachine/${resource_machine_id}/`, {
			withCredentials: true,
		});
	}

	getResourceMachines(facility: number | string): Observable<ResourceMachine[]> {

		return this.http.get<ResourceMachine[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/resourcesMachine/`, {
			withCredentials: true,
		});
	}

	updateGPUSpecification(facility: number | string, gpu_specification: GPUSpecification): Observable<GPUSpecification> {
		const params: HttpParams = new HttpParams().set('gpu_specification', JSON.stringify(gpu_specification));

		return this.http.post<GPUSpecification>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/gpuSpecification/${gpu_specification.id}/`, params, {
			withCredentials: true,
		});
	}

	getGPUSpecification(facility: number | string, gpu_spec_id: number | string): Observable<GPUSpecification> {
		return this.http.get<GPUSpecification>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/gpuSpecification/${gpu_spec_id}/`, {
			withCredentials: true,
		});
	}

	getGPUSpecifications(facility: number | string): Observable<GPUSpecification[]> {
		return this.http.get<GPUSpecification[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/gpuSpecification/`, {
			withCredentials: true,
		});
	}

	deleteGPUSpecification(facility: number | string, gpu_spec_id: number | string): Observable<GPUSpecification[]> {
		return this.http.delete<GPUSpecification[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/gpuSpecification/${gpu_spec_id}/`, {
			withCredentials: true,
		});
	}

	addGPUSpecification(facility: number | string, gpu_specification: GPUSpecification): Observable<GPUSpecification[]> {
		const params: HttpParams = new HttpParams().set('gpu_specification', JSON.stringify(gpu_specification));

		return this.http.post<GPUSpecification[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/gpuSpecification/`, params, {
			withCredentials: true,
		});
	}

	getVolumeStorageFactor(facility: number | string, factor_id: number | string): Observable<VolumeStorageFactor> {

		return this.http.get<VolumeStorageFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/volumeStorageFactors/${factor_id}/`, {
			withCredentials: true,
		});
	}

	getObjectStorageFactor(facility: number | string, factor_id: number | string): Observable<ObjectStorageFactor> {

		return this.http.get<ObjectStorageFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/objectStorageFactors/${factor_id}/`, {
			withCredentials: true,
		});
	}

	/**
	 * Updates the CoreFactor.
	 *
	 * @param facility
	 * @param factor
	 */
	updateVolumeStorageFactor(facility: number | string, factor: VolumeStorageFactor): Observable<VolumeStorageFactor> {
		const params: HttpParams = new HttpParams().set('factor', JSON.stringify(factor));

		// tslint:disable-next-line:max-line-length
		return this.http.post<VolumeStorageFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/volumeStorageFactors/${factor.id}/`, params, {
			withCredentials: true,
		});
	}

	/**
	 * Updates the CoreFactor.
	 *
	 * @param facility
	 * @param factor
	 */
	updateObjectStorageFactor(facility: number | string, factor: ObjectStorageFactor): Observable<ObjectStorageFactor> {
		const params: HttpParams = new HttpParams().set('factor', JSON.stringify(factor));

		// tslint:disable-next-line:max-line-length
		return this.http.post<ObjectStorageFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/objectStorageFactors/${factor.id}/`, params, {
			withCredentials: true,
		});
	}

	/**
	 * Deletes an CoreFactor.
	 *
	 * @param facility
	 * @param factor_id
	 * @returns
	 */
	deleteVolumeStorageFactor(facility: number | string, factor_id: number | string): Observable<VolumeStorageFactor[]> {

		return this.http.delete<VolumeStorageFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/volumeStorageFactors/${factor_id}/`, {
			withCredentials: true,
		});
	}

	/**
	 * Deletes an CoreFactor.
	 *
	 * @param facility
	 * @param factor_id
	 * @returns
	 */
	deleteObjectStorageFactor(facility: number | string, factor_id: number | string): Observable<ObjectStorageFactor[]> {

		return this.http.delete<ObjectStorageFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/objectStorageFactors/${factor_id}/`, {
			withCredentials: true,
		});
	}

	getGeneralStorageFactors(facility: number | string): Observable<GeneralStorageFactor[]> {

		return this.http.get<GeneralStorageFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/generalStorageFactors/`, {
			withCredentials: true,
		});
	}

	getGeneralStorageFactor(facility: number | string, factor_id: number | string): Observable<GeneralStorageFactor> {

		return this.http.get<GeneralStorageFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/generalStorageFactors/${factor_id}/`, {
			withCredentials: true,
		});
	}

	updateGeneralStorageFactor(facility: number | string, factor: GeneralStorageFactor): Observable<GeneralStorageFactor> {
		const params: HttpParams = new HttpParams().set('factor', JSON.stringify(factor));

		// tslint:disable-next-line:max-line-length
		return this.http.post<GeneralStorageFactor>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/generalStorageFactors/${factor.id}/`, params, {
			withCredentials: true,
		});
	}

	deleteGeneralStorageFactor(facility: number | string, factor_id: number | string): Observable<GeneralStorageFactor[]> {

		return this.http.delete<GeneralStorageFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/generalStorageFactors/${factor_id}/`, {
			withCredentials: true,
		});
	}

	addGeneralStorageFactor(facility: number | string, generalStorageFactor: GeneralStorageFactor): Observable<GeneralStorageFactor[]> {
		const params: HttpParams = new HttpParams().set('generalStorageFactor', JSON.stringify(generalStorageFactor));

		return this.http.post<GeneralStorageFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/generalStorageFactors/`, params, {
			withCredentials: true,
		});
	}

	/**
	 * Get CoreFactors from a facility.
	 *
	 * @param facility
	 * @returns
	 */
	getVolumeStorageFactors(facility: number | string): Observable<VolumeStorageFactor[]> {

		return this.http.get<VolumeStorageFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/volumeStorageFactors/`, {
			withCredentials: true,
		});
	}

	/**
	 * Get CoreFactors from a facility.
	 *
	 * @param facility
	 * @returns
	 */
	getObjectStorageFactors(facility: number | string): Observable<ObjectStorageFactor[]> {

		return this.http.get<ObjectStorageFactor[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/resources/objectStorageFactors/`, {
			withCredentials: true,
		});
	}

	/**
	 * Declines an application for the facility
	 *
	 * @param facility
	 * @param application_id
	 * @returns
	 */
	declineFacilityApplication(facility: number, application_id: number): Observable<any> {
		const params: HttpParams = new HttpParams().set('action', 'decline');

		return this.http.post(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/applications/${application_id}/status/`, params, {
			withCredentials: true,
			observe: 'response',
		});
	}

	/**
	 * Sends an email to all members of the facility.
	 *
	 * @param facility facility that should be contacted
	 * @param subject email subject
	 * @param message email message
	 * @param project_type which users to email
	 * @param reply reply address
	 * @param sendNews boolean if news should be send
	 * @param alternative_news_text an alternative news text
	 * @param news_tags additional tags
	 * @returns
	 */
	sendMailToFacility(
		facility: string,
		subject: string,
		message: string,
		project_type: string,
		reply?: string,
		sendNews?: any,
		alternative_news_text?: string,
		tags?: string,
	): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('subject', subject)
			.set('facility_id', facility)
			.set('message', message)
			.set('reply', reply)
			.set('type', project_type)
			.set('sendNews', sendNews)
			.set('alternative_message', alternative_news_text)
			.set('tags', tags);

		return this.http.post(`${ApiSettings.getApiBaseURL()}facilityManagers/current/facilityMail/`, params, {
			withCredentials: true,
			observe: 'response',
		});
	}

	/**
	 * Get Members of a project with emails.
	 *
	 * @param groupid id of the group
	 * @param facility id of the facility
	 * @returns
	 */
	getFacilityGroupRichMembers(groupid: number, facility: number): Observable<ProjectMember[]> {
		return this.http.get<ProjectMember[]>(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/${groupid}/members/`, {
			withCredentials: true,
		});
	}

	getFilteredMembersOfFacility(searchString: string): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}users/filterFacility/`, {
			withCredentials: true,
			params: {
				searchString,
			},
		});
	}

	approveTerminationByFM(groupId: number | string, facility: number): Observable<object> {
		return this.http.delete(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/${groupId}/`, {
			withCredentials: true,
		});
	}

	declineTerminationByFM(groupId: number | string, facility: number): Observable<object> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}computecenters/${facility}/projects/${groupId}/`, {
			withCredentials: true,
		});
	}

}
