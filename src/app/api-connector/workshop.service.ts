import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UrlData, WorkshopUrlInfoModel } from '../virtualmachines/workshop/workshop-urlinfo.model';
import { ApiSettings } from './api-settings.service';
import { Workshop } from '../virtualmachines/workshop/workshop.model';
import { WorkshopVM } from '../virtualmachines/workshop/workshop-vm.model';

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
					(workshop_info: WorkshopUrlInfoModel): WorkshopUrlInfoModel => new WorkshopUrlInfoModel(workshop_info),
				),
			),
		);
	}

	getUrlDataForWorkshopVm(workshop_id: number, openstackid: string): Observable<UrlData> {
		const params: HttpParams = new HttpParams()
			.set('openstackid', openstackid);

		return this.http.get<UrlData>(`${ApiSettings.getApiBaseURL()}workshops/${workshop_id}/url_info/one_vm/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(urlData: UrlData): UrlData => new UrlData(urlData),
			),
		);
	}

	getResenvUrlForWorkshopVm(workshop_id: number, openstackid: string): Observable<UrlData> {
		const params: HttpParams = new HttpParams()
			.set('openstackid', openstackid);

		return this.http.get<UrlData>(`${ApiSettings.getApiBaseURL()}workshops/${workshop_id}/url_info/one_vm/resenv_only/`, {
			withCredentials: true,
			params,
		}).pipe(
			map(
				(urlData: UrlData): UrlData => new UrlData(urlData),
			),
		);
	}

	loadWorkshopWithVms(workshop_id: number): Observable<Workshop> {
		return this.http.get<Workshop>(`${ApiSettings.getApiBaseURL()}workshops/${workshop_id}/vms/`, {
			withCredentials: true,
		}).pipe(
			map(
				(workshop: Workshop): Workshop => new Workshop(workshop),
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

	sendWorkshopVmEmail(workshop_id: number, openstackid: string): Observable<WorkshopVM> {
		const params: HttpParams = new HttpParams()
			.set('openstackid', openstackid);

		return this.http.post<WorkshopVM>(`${ApiSettings.getApiBaseURL()}workshops/${workshop_id}/email/`, params, {
			withCredentials: true,
		}).pipe(
			map(
				(workshop_new: WorkshopVM): WorkshopVM => new WorkshopVM(workshop_new),
			),
		);
	}

	deleteWorkshop(workshop_id: number): Observable<boolean> {
		return this.http.delete<boolean>(`${ApiSettings.getApiBaseURL()}workshops/${workshop_id}/`, {
			withCredentials: true,
		});
	}

}
