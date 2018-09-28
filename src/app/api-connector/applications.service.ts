import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';


const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get("csrftoken"),
    'Content-Type': 'application/json'

***REMOVED***);

const header_csrf = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get("csrftoken"),
    'Content-Type': 'application/json'

***REMOVED***);

@Injectable()
export class ApplicationsService ***REMOVED***
    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***


    getUserApplications(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'users/current/project_applications/', ***REMOVED***
            headers: header_csrf,
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));
    ***REMOVED***

    getAllApplications(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'project_applications/', ***REMOVED***
            withCredentials: true,
            headers: header_csrf,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    addNewApplication(data): Observable<any> ***REMOVED***
        let parameter = data;


        return this.http.post(this.settings.getApiBaseURL() + 'project_applications/', parameter,
            ***REMOVED***
                headers: header,
                withCredentials: true
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    requestRenewal(data): Observable<any> ***REMOVED***
        let parameter = data;

        return this.http.post(this.settings.getApiBaseURL() + 'applicationRenewals/', parameter,
            ***REMOVED***
                headers: header,
                withCredentials: true
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    approveRenewal(application_id: number): Observable<any> ***REMOVED***


        return this.http.post(this.settings.getApiBaseURL() +  'applicationRenewals/'  + application_id + '/status/',null, ***REMOVED***
            headers: header_csrf,
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    declineRenewal(application_id: number): Observable<any> ***REMOVED***


        return this.http.delete(this.settings.getApiBaseURL() + 'applicationRenewals/' +application_id + '/status/',
            ***REMOVED***
                headers: header_csrf,
                withCredentials: true,
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    getAllApplicationsRenewalRequests(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'applicationsRenewals/', ***REMOVED***
            withCredentials: true,
            headers: header_csrf,

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getApplicationsRenewalRequest(application_id: number): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'applicationsRenewals/' + application_id + '/', ***REMOVED***
            withCredentials: true,
            headers: header_csrf,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    deleteApplication(application_id: number): Observable<any> ***REMOVED***


        return this.http.delete(this.settings.getApiBaseURL() +'project_applications/' + application_id +'/',
            ***REMOVED***
                headers: header_csrf,
                withCredentials: true,
            ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


***REMOVED***
