import {Injectable} from '@angular/core';
import {Image} from '../virtualmachines/virtualmachinemodels/image';
import {SnapshotModel} from "../virtualmachines/virtualmachinemodels/snapshot.model";
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import { map } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

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
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }


    getImageTags(): Observable<any> {
        let urlSearchParams = new URLSearchParams();


        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getImageTags/', {
            withCredentials: true,
            search: urlSearchParams
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }


    addImageTags(imageTag: string, description: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('imageTag', imageTag)
        urlSearchParams.append('description', description)

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/addImageTag/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }


    deleteImageTag(imageTag: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('imageTag', imageTag)


        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/deleteImageTag/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) =>throwError(error.json().error || 'Server error'))

    }


    createSnapshot(snaptshot_instance: string, snapshot_name: string,): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('snapshot_name', snapshot_name)
        urlSearchParams.append('snapshot_instance', snaptshot_instance)

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/createSnapshot/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))

    }

    deleteSnapshot(snapshot_id: string): Observable<any> {
        let header = new Headers({
            'X-CSRFToken': this.settings.getCSRFToken(),
        });
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('snapshot_id', snapshot_id)

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/deleteSnapshot/', urlSearchParams, {
            withCredentials: true,
            headers: header
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }

    getSnapshotsByUser(): Observable<SnapshotModel[]> {
        let urlSearchParams = new URLSearchParams();


        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getSnapshots/', {
            withCredentials: true,
            search: urlSearchParams
        }).map((res: Response) => res.json()).catch((error: any) => throwError(error.json().error || 'Server error'))


    }


}
