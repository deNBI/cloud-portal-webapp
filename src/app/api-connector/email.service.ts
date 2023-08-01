import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiSettings } from './api-settings.service';
import { IResponseTemplate } from './response-template';
import { CsvMailTemplateModel } from '../shared/classes/csvMailTemplate.model';

/**
 * Service which provides methods for Flavors.
 */
@Injectable({
	providedIn: 'root',
})
export class EmailService {
	constructor(private http: HttpClient) {}

	getMailTemplates(): Observable<string[]> {
		return this.http.get<string[]>(`${ApiSettings.getApiBaseURL()}emails/templates/`, {
			withCredentials: true,
		});
	}

	sendCsvTemplate(csvFile: File): Observable<CsvMailTemplateModel> {
		const formData = new FormData();
		formData.append('csv_file', csvFile, csvFile.name);

		return this.http.post<CsvMailTemplateModel>(`${ApiSettings.getApiBaseURL()}emails/templated/csv/`, formData, {
			withCredentials: true,
		});
	}

	sendCsvTemplatedMail(
		csvFile: File,
		projectIds: (string | number)[],
		subject: string,
		message: string,
		adminsOnly: boolean,
		reply?: string,
	): Observable<IResponseTemplate> {
		const formData = new FormData();
		formData.append('csv_file', csvFile, csvFile.name);
		formData.append('project_ids', JSON.stringify(projectIds));
		formData.append('subject', subject);
		formData.append('message', message);
		formData.append('adminsOnly', String(adminsOnly));
		if (reply !== undefined) {
			formData.append('reply', reply);
		}

		return this.http.post<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}emails/templated/csv/projects/`, formData, {
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
