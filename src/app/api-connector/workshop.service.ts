import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiSettings } from './api-settings.service'
import { Workshop } from '../virtualmachines/workshop/workshop.model'
import { WorkshopVM } from '../virtualmachines/workshop/workshop-vm.model'
import { WorkshopTimeFrame } from '../virtualmachines/workshop/workshopTimeFrame.model'

@Injectable()
export class WorkshopService {
	constructor(private http: HttpClient) {}

	loadWorkshopCalender(workshop_id: number): Observable<WorkshopTimeFrame[]> {
		return this.http
			.get<WorkshopTimeFrame[]>(`${ApiSettings.getApiBaseURL()}workshops/${workshop_id}/calender/`, {
				withCredentials: true
			})
			.pipe(
				map((workshopTimeFrames: WorkshopTimeFrame[]): WorkshopTimeFrame[] =>
					workshopTimeFrames.map(
						(workshopTimeFrame: WorkshopTimeFrame): WorkshopTimeFrame => new WorkshopTimeFrame(workshopTimeFrame)
					)
				)
			)
	}

	loadWorkshopTimeFrames(): Observable<WorkshopTimeFrame[]> {
		return this.http
			.get<WorkshopTimeFrame[]>(`${ApiSettings.getApiBaseURL()}workshops/calender/all/`, {
				withCredentials: true
			})
			.pipe(
				map((workshopTimeFrames: WorkshopTimeFrame[]): WorkshopTimeFrame[] =>
					workshopTimeFrames.map(
						(workshopTimeFrame: WorkshopTimeFrame): WorkshopTimeFrame => new WorkshopTimeFrame(workshopTimeFrame)
					)
				)
			)
	}

	addWorkshopTimeFrame(application_id: number | string, timeframe: WorkshopTimeFrame): Observable<WorkshopTimeFrame> {
		const params: HttpParams = new HttpParams()
			.set('start_time', timeframe.start_time.toJSON())
			.set('end_time', timeframe.end_time.toJSON())
			.set('description', timeframe.description)
			.set('process', 'add')
			.set('workshop_id', timeframe.workshop?.id)

		return this.http.post<WorkshopTimeFrame>(
			`${ApiSettings.getApiBaseURL()}workshops/${application_id}/calender/`,
			params,
			{
				withCredentials: true
			}
		)
	}

	removeWorkshopTimeFrame(application_id: number | string, timeframe: WorkshopTimeFrame): Observable<any> {
		const params: HttpParams = new HttpParams().set('timeframe_id', timeframe.id).set('process', 'delete')

		return this.http.post<any>(`${ApiSettings.getApiBaseURL()}workshops/${application_id}/calender/`, params, {
			withCredentials: true
		})
	}

	getWorkshops(application_id: string | number): Observable<Workshop[]> {
		const params: HttpParams = new HttpParams().set('application_id', application_id)

		return this.http
			.get<Workshop[]>(`${ApiSettings.getApiBaseURL()}workshops/`, {
				withCredentials: true,
				params
			})
			.pipe(
				map((workshops: Workshop[]): Workshop[] =>
					workshops.map((workshop: Workshop): Workshop => new Workshop(workshop))
				)
			)
	}

	createWorkshop(application_id: string | number, workshop: Workshop): Observable<Workshop> {
		const params: HttpParams = new HttpParams()
			.set('application_id', application_id)
			.set('workshop', encodeURIComponent(JSON.stringify(workshop)))

		return this.http
			.post<Workshop>(`${ApiSettings.getApiBaseURL()}workshops/`, params, {
				withCredentials: true
			})
			.pipe(map((workshop_new: Workshop): Workshop => new Workshop(workshop_new)))
	}

	sendWorkshopVmEmail(workshop_id: number, openstackid: string): Observable<WorkshopVM> {
		const params: HttpParams = new HttpParams().set('openstackid', openstackid)

		return this.http
			.post<WorkshopVM>(`${ApiSettings.getApiBaseURL()}workshops/${workshop_id}/email/`, params, {
				withCredentials: true
			})
			.pipe(map((workshop_new: WorkshopVM): WorkshopVM => new WorkshopVM(workshop_new)))
	}

	deleteWorkshop(workshop_id: number): Observable<boolean> {
		return this.http.delete<boolean>(`${ApiSettings.getApiBaseURL()}workshops/${workshop_id}/`, {
			withCredentials: true
		})
	}
}
