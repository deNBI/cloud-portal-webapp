import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiSettings } from './api-settings.service';
import { IResponseTemplate } from './response-template';
import { Client } from '../vo_manager/clients/client.model';
import { ProjectEnumeration } from '../projectmanagement/project-enumeration';
import { Doi } from '../applications/doi/doi';
import { ApplicationRessourceUsage } from '../applications/application-ressource-usage/application-ressource-usage';
import { ProjectMember } from '../projectmanagement/project_member.model';

/**
 * Service which provides Group methods.
 */
@Injectable()
export class GroupService {

	constructor(private http: HttpClient) {
		this.http = http;
	}

	getProjectOSDetails(groupId: number | string): Observable<object> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupId}/os_details/`, {
			withCredentials: true,
		});

	}

	requestProjectTermination(appId: number | string): Observable<any> {
		return this.http.delete(`${ApiSettings.getApiBaseURL()}projects/${appId}/`, {
			withCredentials: true,
		});

	}

	getFacilityByGroup(groupid: string): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/computecenter/`, {
			withCredentials: true,
		});

	}

	getClient(groupid: string): Observable<Client> {

		return this.http.get<Client>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/client/`, {
			withCredentials: true,
		});

	}

	getClientBibigrid(groupid: string): Observable<Client> {

		return this.http.get<Client>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/cluster/client/`, {
			withCredentials: true,
		});

	}

	getClientForcUrl(groupid: string, isClient?: string): Observable<any> {
		if (isClient) {
			const params: HttpParams = new HttpParams().set('client', isClient);

			return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/client/getForc/`, {
				withCredentials: true,
				params,
			});
		} else {
			return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/client/getForc/`, {
				withCredentials: true,
			});
		}
	}

	assignGroupToResource(groupid: string, computecenter: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('compute_center', computecenter);

		return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/resource/`, params, {
			withCredentials: true,
			// headers: header
		});

	}

	removeGroupFromResource(groupid: string): Observable<any> {

		return this.http.delete(`${ApiSettings.getApiBaseURL()}projects/${groupid}/resource/`, {
			withCredentials: true,
		});

	}

	getCreditsAllowedByPerunId(groupid: number | string): Observable<any> {
		return this.http.get(
			`${ApiSettings.getApiBaseURL()}projects/${groupid}/credits_allowed_perun/`,
			{
				withCredentials: true,
			},
		);
	}

	getGroupAdminIds(groupid: number | string): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/admins/ids/`, {
			withCredentials: true,
		});
	}

	isLoggedUserGroupAdmin(groupid: number | string): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/admin/`, {
			withCredentials: true,
		});
	}

	addMember(group_id: string | number, member_id: string | number, facility_id?: string | number): Observable<any> {
		const params: HttpParams = new HttpParams();
		if (facility_id !== null) {
			params.set('facility_id', facility_id.toString());

		}

		return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/members/${member_id}/`, params, {
			withCredentials: true,
			observe: 'response',
		});
	}

	addAdmin(group_id: string | number, user_id: string | number, facility_id?: string | number): Observable<any> {
		const params: HttpParams = new HttpParams();

		if (facility_id !== null) {
			params.set('facility_id', facility_id.toString());

		}

		return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/admins/${user_id}/`, params, {
			withCredentials: true,
			observe: 'response',
		});
	}

	removeMember(group_id: number | string, member_id: number | string, facility_id?: number | string): Observable<any> {
		const params: HttpParams = new HttpParams();

		if (facility_id !== null) {
			params.set('facility_id', facility_id.toString());

		}

		return this.http.request('delete', `${ApiSettings.getApiBaseURL()}projects/${group_id}/members/${member_id}/`, {
			withCredentials: true,
			body: params,
			responseType: 'text',
			observe: 'response',
		});
	}

	leaveGroup(group_id: number | string, member_id: number | string, facility_id?: number | string): Observable<any> {
		const params: HttpParams = new HttpParams();

		console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nParameters:\n")
		console.log(params);

		if (facility_id !== null) {
			params.set('facility_id', facility_id.toString());
		}

		return this.http.request('delete', `${ApiSettings.getApiBaseURL()}projects/${group_id}/members/${member_id}/leave/`, {
			withCredentials: true,
			body: params,
			responseType: 'text',
			observe: 'response',
		});
	}

	removeAdmin(group_id: number | string, user_id: number | string, facility_id?: number | string): Observable<any> {

		const params: HttpParams = new HttpParams();

		if (facility_id !== null) {
			params.set('facility_id', facility_id.toString());

		}

		return this.http.request('delete', `${ApiSettings.getApiBaseURL()}projects/${group_id}/admins/${user_id}/`, {
			withCredentials: true,
			responseType: 'text',
			body: params,
			observe: 'response',
		});
	}

	getGroupsEnumeration(): Observable<ProjectEnumeration[]> {
		return this.http.get<ProjectEnumeration[]>(`${ApiSettings.getApiBaseURL()}projects/enumeration/`, {
			withCredentials: true,
		});
	}

	getGroupDetails(groupid: number | string): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/details/`, {
			withCredentials: true,
		});
	}

	getGroupApplications(group: number | string): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${group}/applications/`, {
			withCredentials: true,
		});

	}

	approveGroupApplication(groupid: number, application: number): Observable<any> {

		return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/applications/${application}/status/`, null, {
			withCredentials: true,
		});

	}

	rejectGroupApplication(groupid: number, application: number): Observable<any> {

		return this.http.delete(`${ApiSettings.getApiBaseURL()}projects/${groupid}/applications/${application}/status/`, {
			withCredentials: true,
		});

	}

	getSimpleVmByUser(): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}projects/simpleVm/`, {
			withCredentials: true,

		});
	}

	getSimpleVmByUserWhereWorkshopAndAdmin(): Observable<any> {
		return this.http.get<any>(`${ApiSettings.getApiBaseURL()}projects/simpleVmWorkshops/`, {
			withCredentials: true,
		});
	}

	getGroupDois(application_id: string | number): Observable<Doi[]> {
		const params: HttpParams = new HttpParams()
			.set('application', application_id.toString());

		return this.http.get<Doi[]>(`${ApiSettings.getApiBaseURL()}doi/`, {
			withCredentials: true,
			params,
		});
	}

	addGroupDoi(application_id: string | number, doi: string): Observable<Doi[]> {
		const params: HttpParams = new HttpParams()
			.set('application', application_id.toString()).set('doi', doi);

		return this.http.post<Doi[]>(`${ApiSettings.getApiBaseURL()}doi/`, params, {
			withCredentials: true,

		});
	}

	deleteGroupDoi(id: string | number): Observable<Doi[]> {
		return this.http.delete<Doi[]>(`${ApiSettings.getApiBaseURL()}doi/${id}/`, {
			withCredentials: true,

		});
	}

	createGroupOpenStack(application_id: string | number, compute_center_id: string | number): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('application_id', application_id.toString())
			.set('compute_center_id', compute_center_id.toString());

		return this.http.post(
			`${ApiSettings.getApiBaseURL()}projects/openStack/`,
			params,
			{
				withCredentials: true,
			},
		);
	}

	createGroupByApplication(application_id: string | number, compute_center_id?: string): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('application_id', application_id.toString()).set('compute_center_id', compute_center_id);

		return this.http.post(
			`${ApiSettings.getApiBaseURL()}projects/simple_vm/`,
			params,
			{
				withCredentials: true,
			},
		);
	}

	getLifetime(groupid: string | number): Observable<IResponseTemplate> {

		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/lifetime/`, {
			withCredentials: true,
		});

	}

	getGroupMembers(groupid: string): Observable<ProjectMember[]> {

		return this.http.get<ProjectMember[]>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/members/`, {
			withCredentials: true,

		});

	}

	getWorkshopMembers(groupid: string): Observable<ProjectMember[]> {

		return this.http.get<ProjectMember[]>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/workshopmembers/`, {
			withCredentials: true,

		});

	}

	getGroupMaxDiskspace(groupid: string): Observable<IResponseTemplate> {
		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/approvedDiskspace/`, {
			withCredentials: true,
		});

	}

	getGroupUsedDiskspace(groupid: string): Observable<IResponseTemplate> {
		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/usedDiskspace/`, {
			withCredentials: true,
		});

	}

	getGroupResources(groupid: string): Observable<ApplicationRessourceUsage> {
		return this.http.get<ApplicationRessourceUsage>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/all/`, {
			withCredentials: true,
		});

	}

	getVolumesUsed(groupid: string): Observable<IResponseTemplate> {
		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/usedVolumes/`, {
			withCredentials: true,
		});
	}

	getVolumeCounter(groupid: string): Observable<IResponseTemplate> {
		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/volumesCounter/`, {
			withCredentials: true,
		});
	}

	isFreemiumActive(): Observable<IResponseTemplate> {
		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}freemium/`, {
			withCredentials: true,
		});
	}

	addMemberToFreemium(): Observable<any> {

		return this.http.post(`${ApiSettings.getApiBaseURL()}freemium/`, {
			withCredentials: true,
		});
	}
	getFilteredMembersByProject(searchString: string, groupid: string | number): Observable<any> {

		return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/members/filter/`, {
			withCredentials: true,
			params: {
				searchString,
			},
		});
	}
}
