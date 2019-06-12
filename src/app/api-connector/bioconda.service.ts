import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service'
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***IBiocondaTool***REMOVED*** from '../virtualmachines/conda/bioconda.component';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            ***REMOVED***);

@Injectable()
export class BiocondaService ***REMOVED***

  constructor(private http: HttpClient) ***REMOVED***
  ***REMOVED***

  getBiocondaTools(page: number, name?: string, version?: string, build?: string): Observable<any> ***REMOVED***
    const params: HttpParams = new HttpParams()
      .set('page', page.toString())
      .set('build', build)
      .set('version', version)
      .set('name', name);

    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***conda/bioconda/`, ***REMOVED***
      headers: header,
      withCredentials: true,
      params: params
    ***REMOVED***)
  ***REMOVED***

  getAnacondaTools(): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***conda/anaconda/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***

  getCondaforgeTools(): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***conda/conda-forge/`, ***REMOVED***
      headers: header,
      withCredentials: true
    ***REMOVED***)
  ***REMOVED***
***REMOVED***
