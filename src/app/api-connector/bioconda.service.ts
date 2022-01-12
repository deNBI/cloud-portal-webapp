import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSettings } from './api-settings.service';
import { ResearchEnvironment } from '../virtualmachines/virtualmachinemodels/res-env';
import { VirtualMachine } from '../virtualmachines/virtualmachinemodels/virtualmachine';
import { Backend } from '../virtualmachines/conda/backend/backend';

/**
 * Bioconda service.
 */
@Injectable()
export class BiocondaService {

	constructor(private http: HttpClient) {
		this.http = http;
	}

	getAllTools(page: number, name?: string): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('page', page.toString())
			.set('name', name);

		return this.http.get(`${ApiSettings.getApiBaseURL()}conda/all/`, {
			withCredentials: true,
			params,
		});
	}

	getForcTemplates(clientid: string): Observable<ResearchEnvironment[]> {
		const params: HttpParams = new HttpParams()
			.set('clientid', clientid);

		return this.http.get<ResearchEnvironment[]>(`${ApiSettings.getApiBaseURL()}forc/templates/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(resenvs: ResearchEnvironment[]): ResearchEnvironment[] => resenvs.map(
					(resenv: ResearchEnvironment): ResearchEnvironment => new ResearchEnvironment(resenv),
				),
			),
		);
	}

	getSuggestedForcTemplates(facility_id?: string): Observable<any> {
		const params: HttpParams = new HttpParams()
			.set('facility_id', facility_id);

		return this.http.get(`${ApiSettings.getApiBaseURL()}forc/templates/allowed/`, {
			withCredentials: true,
			params,
		});
	}

	getTemplateNameByVmName(vm: VirtualMachine): Observable<Backend> {
		const params: HttpParams = new HttpParams().set('vm', vm.name);

		return this.http.get<Backend>(`${ApiSettings.getApiBaseURL()}forc/backends/vm_name/`, {
			withCredentials: true,
			params,
		});
	}

	getUsersForBackend(vmId: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('vm_id', vmId);

		return this.http.get(`${ApiSettings.getApiBaseURL()}forc/backs/users/`, {
			withCredentials: true,
			params,
		});
	}

	addUserToBackend(vmId: string, user_id: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('vm_id', vmId).set('user_id', user_id);

		return this.http.post(`${ApiSettings.getApiBaseURL()}forc/backs/users/`, params, {
			withCredentials: true,
		});
	}

	deleteUserFromBackend(vmId: string, user_id: string): Observable<any> {
		const params: HttpParams = new HttpParams().set('vm_id', vmId).set('user_id', user_id);

		return this.http.delete(`${ApiSettings.getApiBaseURL()}forc/backs/users/`, {
			withCredentials: true,
			params,
		});
	}
}
