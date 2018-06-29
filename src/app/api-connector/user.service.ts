import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class UserService ***REMOVED***
    constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    setUserFacilityPassword(facility: string): Observable<Response> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('facility', facility);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'user/setUserPassword/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***

    getLogins(user: number): Observable<Response> ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + 'user/getLogins/',
            ***REMOVED***
                withCredentials: true,
                params: ***REMOVED***user: user***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    getLoggedUser() ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'user/getLoggedUser/',
            ***REMOVED***
                withCredentials: true,

            ***REMOVED***);
    ***REMOVED***

    getMemberByUser(user_id: number) ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + `user/getMemberByUser/`, ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***user: user_id***REMOVED***
        ***REMOVED***);
    ***REMOVED***


    getMemberByExtSourceNameAndExtLogin(ext_login: string) ***REMOVED***

        return this.http.get(this.settings.getApiBaseURL() + `user/getMemberByExtSourceNameAndExtLogin/`, ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***

                extLogin: ext_login,

            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***


    getVosWhereUserIsAdmin(user_id: number) ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'user/getVosWhereUserIsAdmin/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***userid: user_id***REMOVED***
        ***REMOVED***);
    ***REMOVED***

    getGroupsWhereUserIsAdmin(user_id: number) ***REMOVED***
        return this.http.get(this.settings.getApiBaseURL() + 'user/getGroupsWhereUserIsAdmin/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***userid: user_id***REMOVED***
        ***REMOVED***);
    ***REMOVED***

    setNewsletterSubscription(subscribed: boolean): Observable<any> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('subscribed', subscribed.toString());

        return this.http.post(this.settings.getApiBaseURL() + 'newsletter/setNewsletterSubscription/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header,
        ***REMOVED***);
    ***REMOVED***

    getNewsletterSubscription(): Observable<any> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        return this.http.get(this.settings.getApiBaseURL() + 'newsletter/getNewsletterSubscription/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***);


    ***REMOVED***


***REMOVED***
