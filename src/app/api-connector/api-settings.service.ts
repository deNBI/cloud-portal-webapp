import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Class for getting base urls.
 */
@Injectable()
export class ApiSettings {
	/**
	 *  Provides base URL with trailing slash for all Portal API calls.
	 * @returns {string} the connector api base url
	 */
	static getApiBaseURL(): string {
		return environment.apiBaseUrl;
	}

	/**
	 *  Provides base URL with trailing slash for all Portal API calls.
	 * @returns {string} the connector api base url
	 */
	static getApiBase(): string {
		return environment.apiBase;
	}

	/**
	 *  Returns the format of the API call.
	 * @returns {string} 'json'
	 */
	static getApiFormat(): string {
		return 'json';
	}

	static getWagtailBase(): string {
		return environment.wagtailBase;
	}
}
