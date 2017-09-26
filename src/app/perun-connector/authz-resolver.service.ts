import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings}  from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class AuthzResolver {
  constructor(private http: Http, private settings: PerunSettings) {
  }

  getLoggedUser() {
    return this.http.get(this.settings.getPerunBaseURL() + 'authzResolver/getLoggedUser', {withCredentials: true});
  }

}
