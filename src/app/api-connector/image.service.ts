import {Injectable} from '@angular/core';
import {Image} from '../virtualmachines/virtualmachinemodels/image';
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

    getImages(): Observable<Image[]> {
        let urlSearchParams = new URLSearchParams();


        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getImages/', {
            withCredentials: true,
            search: urlSearchParams
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    }


    getImageTags(): Observable<any> {
        let urlSearchParams = new URLSearchParams();


        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getImageTags/', {
            withCredentials: true,
            search: urlSearchParams
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    }


    addImageTags(imageTag:string, description:string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('imageTag',imageTag)
        urlSearchParams.append('description',description)

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/addImageTag/', urlSearchParams,{
            withCredentials: true,
            headers:header
        }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    }

}
