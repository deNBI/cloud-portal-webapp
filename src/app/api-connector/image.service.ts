import {Injectable} from '@angular/core';
import {Image} from '../virtualmachines/virtualmachinemodels/image';
import {SnapshotModel} from "../virtualmachines/virtualmachinemodels/snapshot.model";
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import 'rxjs/add/operator/catch';

const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken")
});


@Injectable()
export class ImageService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getImages(): Observable<Image[]> {

        return this.http.get<Image[]>(this.settings.getConnectorBaseUrl() + 'images/getImages/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));


    }


    getImageTags(): Observable<any> {
        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getImageTags/', {
            withCredentials: true,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }


    addImageTags(imageTag: string, description: string): Observable<any> {

        let params = new HttpParams();
        params = params.append('imageTag', imageTag);
        params.append('description', description);


        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/addImageTag/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }


    deleteImageTag(imageTag: string): Observable<any> {

        let params = new HttpParams();
        params = params.append('imageTag', imageTag);


        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/deleteImageTag/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }


    createSnapshot(snaptshot_instance: string, snapshot_name: string,): Observable<any> {

        let params = new HttpParams();
        params = params.append('snapshot_name', snapshot_name);
        params.append('snapshot_instance', snaptshot_instance);


        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/createSnapshot/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }

    deleteSnapshot(snapshot_id: string): Observable<any> {
        let params = new HttpParams();
        params = params.append('snapshot_id', snapshot_id);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/deleteSnapshot/', params, {
            withCredentials: true,
            headers: header
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));

    }

    getSnapshotsByUser(): Observable<SnapshotModel[]> {


        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getSnapshots/', {
            withCredentials: true,
        }).pipe(map((res: Response) => res.json())).pipe(catchError((error: any) => throwError(error)));


    }


}
