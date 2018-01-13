import {Injectable} from '@angular/core';
import {Image} from '../virtualmachinemodels/image';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ImageService {
  constructor(private http: Http, private settings: ApiSettings) {
  }

  getImages(host: string, port: string): Observable<Image[]> {
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.set('host', host);
    urlSearchParams.set('port', port);


    return this.http.get(this.settings.getConnectorBaseUrl() + 'images/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  }

}
