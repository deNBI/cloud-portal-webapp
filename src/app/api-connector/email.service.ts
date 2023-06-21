import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiSettings} from './api-settings.service';
import {IResponseTemplate} from './response-template';

/**
 * Service which provides methods for Flavors.
 */
@Injectable()
export class EmailService {
		constructor(private http: HttpClient) {
		}


		getMailTemplates(): Observable<string[]> {
				return this.http.get<string[]>(`${ApiSettings.getApiBaseURL()}emails/templates/`, {
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
						`${ApiSettings.getApiBaseURL()}emails/templated/projects/`,
						{
								project_ids: projectIds,
								subject,
								message,
								adminsOnly,
								reply,
						},
						{
								withCredentials: true,
						},
				);
		}


}
