import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UrlData, WorkshopUrlInfoModel } from '../virtualmachines/workshop/workshop-urlinfo.model';
import { ApiSettings } from './api-settings.service';
import { Workshop } from '../virtualmachines/workshop/workshop.model';

@Injectable()
export class WorkshopService {

	constructor(private http: HttpClient) {
		this.http = http;
	}

	getWorkshopInfoUrl(application_id: string | number): Observable<WorkshopUrlInfoModel[]> {
		const params: HttpParams = new HttpParams()
			.set('application_id', application_id);

		return this.http.get<WorkshopUrlInfoModel[]>(`${ApiSettings.getApiBaseURL()}workshops/url_info/all_vms/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(workshops_infos: WorkshopUrlInfoModel[]): WorkshopUrlInfoModel[] => workshops_infos.map(
					(workshops_info: WorkshopUrlInfoModel): WorkshopUrlInfoModel => new WorkshopUrlInfoModel(workshops_info),
				),
			),
		);
	}

	getUrlDataForWorkshopVm(applicationId: number, workshopShortname: string, openstackid: string): Observable<UrlData> {
		const params: HttpParams = new HttpParams()
			.set('application_id', applicationId)
			.set('workshop_shortname', workshopShortname)
			.set('openstackid', openstackid);

		return this.http.get<UrlData>(`${ApiSettings.getApiBaseURL()}workshops/url_info/one_vm/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(urlData: UrlData): UrlData => new UrlData(urlData),
			),
		);
	}

	getWorkshops(application_id: string | number): Observable<Workshop[]> {
		const params: HttpParams = new HttpParams()
			.set('application_id', application_id);

		return this.http.get<Workshop[]>(`${ApiSettings.getApiBaseURL()}workshops/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(workshops: Workshop[]): Workshop[] => workshops.map(
					(workshop: Workshop): Workshop => new Workshop(workshop),
				),
			),
		);
	}

	createWorkshop(application_id: string | number, workshop: Workshop): Observable<Workshop> {
		const params: HttpParams = new HttpParams()
			.set('application_id', application_id)
			.set('workshop', encodeURIComponent(JSON.stringify(workshop)));

		return this.http.post<Workshop>(`${ApiSettings.getApiBaseURL()}workshops/`, params, {
			withCredentials: true,
		}).pipe(
			map(
				(workshop_new: Workshop): Workshop => new Workshop(workshop_new),
			),
		);
	}

	deleteWorkshop(applicationId: string, workshopShortname: string): void {

	}

}
