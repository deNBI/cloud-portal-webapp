import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });
@Injectable()
export class BiocondaService {

  constructor(private http: HttpClient) {
  }

  getBiocondaTools(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}conda/bioconda/`, {
      headers: header,
      withCredentials: true
    })
  }

  getAnacondaTools(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}conda/anaconda/`, {
      headers: header,
      withCredentials: true
    })
  }

  getCondaforgeTools(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}conda/conda-forge/`, {
      headers: header,
      withCredentials: true
    })
  }
}
