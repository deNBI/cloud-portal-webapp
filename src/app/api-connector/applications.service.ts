import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***HttpClient, HttpHeaders***REMOVED*** from '@angular/common/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken'),
    'Content-Type': 'application/json'

***REMOVED***);

const header_csrf: HttpHeaders = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken'),
    'Content-Type': 'application/json'

***REMOVED***);

/**
 * Service which provides methods for creating application.
 */
@Injectable()
export class ApplicationsService ***REMOVED***
    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    getUserApplications(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/project_applications/`, ***REMOVED***
            headers: header_csrf,
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getUserApplication(project_id: string): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***users/current/project_applications/$***REMOVED*** project_id ***REMOVED***/`, ***REMOVED***
            headers: header_csrf,
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getApplication(app_id: string): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***app_id***REMOVED***/`, ***REMOVED***
            headers: header_csrf,
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getApplicationClient(app_id: string): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***app_id***REMOVED***/client/`, ***REMOVED***
            headers: header_csrf,
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    /**
     * Checks if some client has the ressource avaiable for an application.
     * @param ***REMOVED***string***REMOVED*** app_id
     * @returns ***REMOVED***Observable<any>***REMOVED***
     */
    getApplicationClientAvaiable(app_id: string): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***app_id***REMOVED***/clients/resource/`, ***REMOVED***
            headers: header_csrf,
            withCredentials: true
        ***REMOVED***)
    ***REMOVED***

    getAllApplications(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/`, ***REMOVED***
            withCredentials: true,
            headers: header_csrf

        ***REMOVED***)

    ***REMOVED***

    addNewApplication(data: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED***): Observable<any> ***REMOVED***

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/`, data, ***REMOVED***
            headers: header,
            withCredentials: true
        ***REMOVED***)

    ***REMOVED***

    requestRenewal(data: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED***): Observable<any> ***REMOVED***

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationRenewals/`, data, ***REMOVED***
            headers: header,
            withCredentials: true
        ***REMOVED***)

    ***REMOVED***

    approveRenewal(application_id: number): Observable<any> ***REMOVED***

        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationRenewals/$***REMOVED***application_id***REMOVED***/status/`, null, ***REMOVED***
            headers: header_csrf,
            withCredentials: true
        ***REMOVED***)

    ***REMOVED***

    declineRenewal(application_id: number): Observable<any> ***REMOVED***

        return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationRenewals/$***REMOVED***application_id***REMOVED***/status/`, ***REMOVED***
            headers: header_csrf,
            withCredentials: true
        ***REMOVED***)

    ***REMOVED***

    getAllApplicationsRenewalRequests(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationsRenewals/`, ***REMOVED***
            withCredentials: true,
            headers: header_csrf

        ***REMOVED***)

    ***REMOVED***

    getApplicationsRenewalRequest(application_id: number): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***applicationsRenewals/$***REMOVED***application_id***REMOVED***/`, ***REMOVED***
            withCredentials: true,
            headers: header_csrf
        ***REMOVED***)

    ***REMOVED***

    deleteApplication(application_id: string): Observable<any> ***REMOVED***

        return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***project_applications/$***REMOVED***application_id***REMOVED***/`, ***REMOVED***
            headers: header_csrf,
            withCredentials: true
        ***REMOVED***)

    ***REMOVED***

***REMOVED***
