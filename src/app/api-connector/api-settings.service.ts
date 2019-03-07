import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment'

@Injectable()
export class ApiSettings {
    /**
     * Class for getting base urls.
     */

    constructor() {
    }

    /**
     * Provides base URL with trailing slash for all Portal API calls.
     * @returns {string} Base Django API Url
     */
    static getApiBaseURL(): string {
        return environment.apiBaseUrl;
    }

    /**
     *  Returns the format of the API call.
     * @returns {string} 'json'
     */
    static getApiFormat(): string {
        return 'json';
    }

}
