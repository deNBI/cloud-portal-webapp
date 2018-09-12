import {Injectable} from '@angular/core';
import {Image} from '../virtualmachines/virtualmachinemodels/image';
import {SnapshotModel} from "../virtualmachines/virtualmachinemodels/snapshot.model";
import {ApiSettings} from './api-settings.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders({
    'X-CSRFToken': Cookie.get("csrftoken")
});


@Injectable()
export class ImageService {
    constructor(private http: HttpClient, private settings: ApiSettings) {
    }

    getImages(project_id:number): Observable<Image[]> {
        let params = new HttpParams().set('project_id', project_id.toString())


        return this.http.get<Image[]>(this.settings.getConnectorBaseUrl() + 'images/getImages/', {
            withCredentials: true,
            params:params,
        }).pipe(catchError((error: any) => throwError(error)));


    }


    getImageTags(): Observable<any> {
        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getImageTags/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));


    }


    addImageTags(imageTag: string, description: string): Observable<any> {

        let params = new HttpParams().set('imageTag', imageTag).set('description', description);


        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/addImageTag/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error)));

    }


    deleteImageTag(imageTag: string): Observable<any> {

        let params = new HttpParams().set('imageTag', imageTag);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/deleteImageTag/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error)));


    }


    createSnapshot(snaptshot_instance: string, snapshot_name: string): Observable<any> {

        let params = new HttpParams().set('snapshot_name', snapshot_name).set('snapshot_instance', snaptshot_instance);


        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/createSnapshot/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error)));


    }

    deleteSnapshot(snapshot_id: string): Observable<any> {
        let params = new HttpParams().set('snapshot_id', snapshot_id);

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/deleteSnapshot/', params, {
            withCredentials: true,
            headers: header
        }).pipe(catchError((error: any) => throwError(error)));

    }

    getSnapshotsByUser(): Observable<SnapshotModel[]> {


        return this.http.get<SnapshotModel[]>(this.settings.getConnectorBaseUrl() + 'images/getSnapshots/', {
            withCredentials: true,
        }).pipe(catchError((error: any) => throwError(error)));


    }


}
