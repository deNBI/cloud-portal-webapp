import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiSettings } from './api-settings.service';
import { IResponseTemplate } from './response-template';
import { Resources } from '../vo_manager/resources/resources';
import { ProjectMember } from '../projectmanagement/project_member.model';
import { Application } from '../applications/application.model/application.model';
import { MaintenanceTimeFrame } from '../vo_manager/maintenance/maintenanceTimeFrame.model';

/**
 * Service which provides vo methods.
 */
@Injectable()
export class VoService {
	constructor(private http: HttpClient) {
		this.http = http;
	}

	getAllProjectsForTsvExport(): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}voManagers/all_projects	/`, {
			withCredentials: true,
		});
	}
	sendTestError(): Observable<IResponseTemplate> {
		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}voManagers/test_bug/`, {
			withCredentials: true,
		});
	}

	isVo(): Observable<IResponseTemplate> {
		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}voManagers/current/status/`, {
			withCredentials: true,
		});
	}

	getNewsletterSubscriptionCounter(): Observable<IResponseTemplate> {
		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}newsletter/subscription/counter/`, {
			withCredentials: true,
		});
	}

	terminateProject(groupId: number | string): Observable<object> {
		return this.http.delete(`${ApiSettings.getApiBaseURL()}vo/projects/${groupId}/`, {
			withCredentials: true,
		});
	}

	removeResourceFromGroup(groupid: number | string): Observable<object> {
		return this.http.delete(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/resource/`, {
			withCredentials: true,
		});
	}

	resumeProject(groupid: number | string): Observable<object> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/resource/`, null, {
			withCredentials: true,
		});
	}

	getAllGroupsWithDetails(): Observable<Application[]> {
		return this.http
			.get<Application[]>(`${ApiSettings.getApiBaseURL()}vo/projects/details/`, {
				withCredentials: true,
			})
			.pipe(
				map((applications: Application[]): Application[] => applications.map((application: Application): Application => new Application(application))),
			);
	}

	getProjectStatus(groupid: number | string): Observable<IResponseTemplate> {
		return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/status/`, {
			withCredentials: true,
		});
	}

	getVoProjectResources(): Observable<Resources[]> {
		return this.http.get<Resources[]>(`${ApiSettings.getApiBaseURL()}vo/projects/resources/`, {
			withCredentials: true,
		});
	}

	getVoProjectResourcesTimeframes(): Observable<Resources[]> {
		return this.http.get<Resources[]>(`${ApiSettings.getApiBaseURL()}vo/projects/resources/timeFrames/`, {
			withCredentials: true,
		});
	}

	getVoProjectDates(): Observable<Resources[]> {
		return this.http.get<Resources[]>(`${ApiSettings.getApiBaseURL()}vo/projects/dates/`, {
			withCredentials: true,
		});
	}

	getVoProjectCounter(): Observable<Resources[]> {
		return this.http.get<Resources[]>(`${ApiSettings.getApiBaseURL()}vo/projects/counter/`, {
			withCredentials: true,
		});
	}

	setProjectStatus(groupid: number | string, status: number): Observable<any> {
		const params: HttpParams = new HttpParams().set('status', status.toString());

		return this.http.post(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/status/`, params, {
			withCredentials: true,
		});
	}

	sendNewsletterToVo(
		subject: string,
		message: string,
		type: string,
		adminsOnly: boolean,
		reply?: string,
	): Observable<IResponseTemplate> {
		const params: HttpParams = new HttpParams()
			.set('subject', subject)
			.set('message', message)
			.set('admins_only', adminsOnly)
			.set('reply', reply)
			.set('type', type);

		return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}voManagers/current/newsletter/`, params, {
			withCredentials: true,
		});
	}

	sendMailToVo(
		subject: string,
		message: string,
		facility: string,
		type: string,
		adminsOnly: boolean,
		expiredTemplate: boolean,
		removalDate: Date,
		reply?: string,
	): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('subject', subject)
			.set('message', message)
			.set('admins_only', adminsOnly)
			.set('reply', reply)
			.set('facility', facility)
			.set('expired_template', expiredTemplate)
			.set('removal_date', removalDate.toUTCString())
			.set('type', type);

		return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}voManagers/current/voMail/`, params, {
			withCredentials: true,
		});
	}

	sendMailToProjects(
		projectIds: (string | number)[],
		subject: string,
		message: string,
		adminsOnly: boolean,
		reply?: string,
	): Observable<any> {
		return this.http.post<IResponseTemplate>(
			`${ApiSettings.getApiBaseURL()}voManagers/current/voMail/projects/`,
			{
				project_ids: projectIds, subject, message, adminsOnly, reply,
			},
			{
				withCredentials: true,
			},
		);
	}

	getMailTemplates(): Observable<string[]> {
		return this.http.get<string[]>(`${ApiSettings.getApiBaseURL()}voManagers/current/voMail/projects/templates/`, {
			withCredentials: true,
		});
	}

	/**
	 * Get members of a project with emails.
	 *
	 * @param groupid id of the group
	 * @returns
	 */
	getVoGroupRichMembers(groupid: number | string): Observable<ProjectMember[]> {
		return this.http.get<ProjectMember[]>(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/members/`, {
			withCredentials: true,
		});
	}

	setCurrentUserProcessingVoManager(application_id: number | string): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}vo/projects/${application_id}/vo_manager/`, null, {
			withCredentials: true,
		});
	}

	unsetProcessingVoManager(application_id: number | string): Observable<any> {
		return this.http.delete(`${ApiSettings.getApiBaseURL()}vo/projects/${application_id}/vo_manager/`, {
			withCredentials: true,
		});
	}

	setProtected(groupid: number | string, set: boolean): Observable<any> {
		const parameters: HttpParams = new HttpParams().set('action', set ? 'set' : 'unset');

		return this.http.get(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/protected/`, {
			withCredentials: true,
			params: parameters,
		});
	}

	declineTermination(groupid: number | string): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}vo/projects/${groupid}/termination/decline/`, {
			withCredentials: true,
		});
	}

	loadMaintenanceTimeFrames(): Observable<MaintenanceTimeFrame[]> {
		return this.http
			.get<MaintenanceTimeFrame[]>(`${ApiSettings.getApiBaseURL()}voManagers/maintenance/`, {
				withCredentials: true,
			})
			.pipe(
				map((maintenanceTimeFrames: MaintenanceTimeFrame[]): MaintenanceTimeFrame[] => maintenanceTimeFrames.map(
					(maintenanceTimeFrame: MaintenanceTimeFrame): MaintenanceTimeFrame => new MaintenanceTimeFrame(maintenanceTimeFrame),
				)),
			);
	}

	addMaintenanceTimeFrame(timeframe: MaintenanceTimeFrame): Observable<MaintenanceTimeFrame> {
		const params: HttpParams = new HttpParams()
			.set('start_time', timeframe.start_time.toJSON())
			.set('end_time', timeframe.end_time.toJSON())
			.set('name', timeframe.name)
			.set('message', timeframe.message);

		return this.http.post<MaintenanceTimeFrame>(`${ApiSettings.getApiBaseURL()}voManagers/maintenance/`, params, {
			withCredentials: true,
		});
	}

	deleteMaintenanceTimeFrame(timeframe: MaintenanceTimeFrame): Observable<any> {
		return this.http.delete<any>(`${ApiSettings.getApiBaseURL()}voManagers/maintenance/${timeframe.id}/`, {
			withCredentials: true,
		});
	}
}
