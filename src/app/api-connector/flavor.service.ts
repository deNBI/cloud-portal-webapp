import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Flavor } from '../virtualmachines/virtualmachinemodels/flavor';
import { ApiSettings } from './api-settings.service';
import { FlavorType } from '../virtualmachines/virtualmachinemodels/flavorType';

/**
 * Service which provides methods for Flavors.
 */
@Injectable()
export class FlavorService {
	constructor(private http: HttpClient) {
		this.http = http;
	}

	getFlavors(project_id: number | string): Observable<Flavor[]> {
		return this.http
			.get<Flavor[]>(`${ApiSettings.getApiBaseURL()}projects/${project_id}/flavors/`, {
				withCredentials: true,
			})
			.pipe(map((flavors: Flavor[]): Flavor[] => flavors.map((flavor: Flavor): Flavor => new Flavor(flavor))));
	}

	getAllFlavors(): Observable<Flavor[]> {
		return this.http
			.get<Flavor[]>(`${ApiSettings.getApiBase()}public/flavors/`)
			.pipe(map((flavors: Flavor[]): Flavor[] => flavors.map((flavor: Flavor): Flavor => new Flavor(flavor))));
	}

	getListOfTypesAvailable(): Observable<FlavorType[]> {
		return this.http
			.get<FlavorType[]>(`${ApiSettings.getApiBaseURL()}project_applications/flavorTypes/`, {
				withCredentials: true,
			})
			.pipe(
				map((flavors: FlavorType[]): FlavorType[] => flavors.map((flavor: FlavorType): FlavorType => new FlavorType(flavor))),
			);
	}

	getListOfFlavorsAvailable(project_id: string = '', specific: boolean = false): Observable<Flavor[]> {
		const params: HttpParams = new HttpParams().set('project_id', project_id).set('specific', JSON.stringify(specific));

		return this.http
			.get<Flavor[]>(`${ApiSettings.getApiBaseURL()}project_applications/flavors/`, {
				withCredentials: true,
				params,
			})
			.pipe(map((flavors: Flavor[]): Flavor[] => flavors.map((flavor: Flavor): Flavor => new Flavor(flavor))));
	}

	sortFlavors(flavors: Flavor[]): { [name: string]: Flavor[] } {
		const flavor_types: { [name: string]: Flavor[] } = {};
		for (const flavor of flavors) {
			if (flavor.type.long_name in flavor_types) {
				flavor_types[flavor.type.long_name].push(flavor);
			} else {
				flavor_types[flavor.type.long_name] = [flavor];
			}
		}

		return flavor_types;
	}
}
