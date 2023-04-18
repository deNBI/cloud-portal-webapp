import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSettings } from './api-settings.service';
import { EdamOntologyTerm } from '../applications/edam-ontology-term';
import { Application } from '../applications/application.model/application.model';
import { ApplicationLifetimeExtension } from '../applications/application_extension.model';
import { ApplicationModification } from '../applications/application_modification.model';
import { ApplicationCreditRequest } from '../applications/application_credit_request';

/**
 * Service which provides methods for creating application.
 */
@Injectable()
export class ApplicationsService {
	constructor(private http: HttpClient) {
		this.http = http;
	}

	adjustApplication(application: Application): Observable<Application> {
		return this.http.post<Application>(`${ApiSettings.getApiBaseURL()}project_applications/adjust/`, application, {
			withCredentials: true,
		});
	}

	adjustLifetimeExtension(application: ApplicationLifetimeExtension): Observable<Application> {
		return this.http.post<Application>(
			`${ApiSettings.getApiBaseURL()}project_applications/adjust/lifetime/`,
			application,
			{
				withCredentials: true,
			},
		);
	}

	adjustModification(application: ApplicationModification): Observable<Application> {
		return this.http.post<Application>(
			`${ApiSettings.getApiBaseURL()}project_applications/adjust/modification/`,
			application,
			{
				withCredentials: true,
			},
		);
	}

	getApplicationValidationByHash(hash: string): Observable<Application> {
		return this.http.get<Application>(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, {
			withCredentials: true,
		});
	}

	resetPIValidation(application: Application): Observable<Application> {
		return this.http.post<Application>(
			`${ApiSettings.getApiBaseURL()}project_applications/validation/${application.project_application_id}/reset/`,
			null,
			{
				withCredentials: true,
			},
		);
	}

	validateApplicationAsPIByHash(hash: string, application: Application): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/validation/${hash}/`, application, {
			withCredentials: true,
		});
	}

	getApplication(app_id: string): Observable<Application> {
		return this.http
			.get<Application>(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/`, {
				withCredentials: true,
			})
			.pipe(map((app: Application) => new Application(app)));
	}

	getApplicationMigratedByGroupId(group_id: string): Observable<boolean> {
		return this.http.get<boolean>(`${ApiSettings.getApiBaseURL()}project_applications/migrated/${group_id}/`, {
			withCredentials: true,
		});
	}

	getApplicationsMigratedByProjectIds(project_ids: string[]): Observable<any> {
		const params: HttpParams = new HttpParams().set('project_ids', project_ids.join());

		return this.http.get<any>(`${ApiSettings.getApiBaseURL()}project_applications/migrated/byList/`, {
			withCredentials: true,
			params,
		});
	}

	getFullApplicationByUserPermissions(app_id: string): Observable<Application> {
		return this.http
			.get<Application>(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/byPermission/`, {
				withCredentials: true,
			})
			.pipe(map((app: Application) => new Application(app)));
	}

	getApplicationPerunId(app_id: string): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/perun/`, {
			withCredentials: true,
		});
	}

	getApplicationClient(app_id: string): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/client/`, {
			withCredentials: true,
		});
	}

	getEdamOntologyTerms(): Observable<EdamOntologyTerm[]> {
		return this.http.get<EdamOntologyTerm[]>(`${ApiSettings.getApiBaseURL()}edam_ontology/`, {
			withCredentials: true,
		});
	}

	addEdamOntologyTerms(application_id: number | string, data: EdamOntologyTerm[]): Observable<any> {
		const params: any = { edam_ontology_terms: data };

		return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/${application_id}/edam_terms/`, params, {
			withCredentials: true,
		});
	}

	/**
	 * Checks if some client has the resource available for an application.
	 *
	 * @param app_id
	 * @returns
	 */
	getApplicationClientAvaiable(app_id: string): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/clients/resource/`, {
			withCredentials: true,
		});
	}

	getAllApplications(): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}project_applications/`, {
			withCredentials: true,
		});
	}

	getSubmittedApplications(): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}project_applications/submitted/`, {
			withCredentials: true,
		});
	}

	getExtensionRequestsCounter(): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/extensions_counter/`, {
			withCredentials: true,
		});
	}

	getLifetimeRequestedApplications(): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}project_applications/lifetime_requests/`, {
			withCredentials: true,
		});
	}

	getModificationRequestedApplications(): Observable<Application[]> {
		return this.http.get<Application[]>(`${ApiSettings.getApiBaseURL()}project_applications/modifications_requests/`, {
			withCredentials: true,
		});
	}

	getCreditsExtensionRequest(): Observable<any> {
		return this.http.get(`${ApiSettings.getApiBaseURL()}project_applications/credits_requests/`, {
			withCredentials: true,
		});
	}

	addNewApplication(application: Application): Observable<Application> {
		return this.http.post<Application>(`${ApiSettings.getApiBaseURL()}project_applications/`, application, {
			withCredentials: true,
		});
	}

	requestModification(modification: ApplicationModification): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/modifications/`, modification, {
			withCredentials: true,
		});
	}

	requestAdditionalLifetime(lifetimeRequest: ApplicationLifetimeExtension): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/lifetime/extensions/`, lifetimeRequest, {
			withCredentials: true,
		});
	}

	requestAdditionalCredits(creditRequest: ApplicationCreditRequest): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/credits/extensions/`, creditRequest, {
			withCredentials: true,
		});
	}

	deleteAdditionalCreditsRequests(request_id: number | string): Observable<any> {
		return this.http.delete(`${ApiSettings.getApiBaseURL()}project_applications/credits/extensions/${request_id}/`, {
			withCredentials: true,
		});
	}

	declineAdditionalCredits(request_id: number | string): Observable<any> {
		return this.http.post(
			`${ApiSettings.getApiBaseURL()}project_applications/credits/extensions/${request_id}/decline/`,
			null,
			{
				withCredentials: true,
			},
		);
	}

	declineApplication(app_id: number | string): Observable<any> {
		return this.http.post(`${ApiSettings.getApiBaseURL()}project_applications/${app_id}/decline/`, null, {
			withCredentials: true,
		});
	}

	approveAdditionalCreditsRequest(request_id: number | string): Observable<any> {
		return this.http.post(
			`${ApiSettings.getApiBaseURL()}project_applications/credits/extensions/${request_id}/approve/`,
			null,
			{
				withCredentials: true,
				observe: 'response',
			},
		);
	}

	approveAdditionalLifetime(request_id: number | string): Observable<any> {
		return this.http.post(
			`${ApiSettings.getApiBaseURL()}project_applications/lifetime/extensions/${request_id}/approve/`,
			null,
			{
				withCredentials: true,
				observe: 'response',
			},
		);
	}

	declineAdditionalLifetime(request_id: number | string): Observable<any> {
		return this.http.post(
			`${ApiSettings.getApiBaseURL()}project_applications/lifetime/extensions/${request_id}/decline/`,
			null,
			{
				withCredentials: true,
			},
		);
	}

	deleteAdditionalLifetimeRequests(request_id: number | string): Observable<any> {
		return this.http.delete(`${ApiSettings.getApiBaseURL()}project_applications/lifetime/extensions/${request_id}/`, {
			withCredentials: true,
		});
	}

	approveModificationRequest(request_id: number | string): Observable<any> {
		return this.http.post(
			`${ApiSettings.getApiBaseURL()}project_applications/modifications/${request_id}/approve/`,
			null,
			{
				withCredentials: true,
				observe: 'response',
			},
		);
	}

	declineModificationRequest(request_id: number | string): Observable<any> {
		return this.http.post(
			`${ApiSettings.getApiBaseURL()}project_applications/modifications/${request_id}/decline/`,
			null,
			{
				withCredentials: true,
			},
		);
	}

	deleteModificationRequest(request_id: number | string): Observable<any> {
		return this.http.delete(`${ApiSettings.getApiBaseURL()}project_applications/modifications/${request_id}/`, {
			withCredentials: true,
		});
	}

	deleteApplication(application_id: string | number): Observable<any> {
		return this.http.delete(`${ApiSettings.getApiBaseURL()}project_applications/${application_id}/`, {
			withCredentials: true,
		});
	}
}
