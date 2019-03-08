import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from '../virtualmachines/virtualmachinemodels/image';
import ***REMOVED***SnapshotModel***REMOVED*** from '../virtualmachines/virtualmachinemodels/snapshot.model';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get('csrftoken')
***REMOVED***);


@Injectable()
export class ImageService ***REMOVED***
    constructor(private http: HttpClient) ***REMOVED***
    ***REMOVED***

    getImages(project_id: number): Observable<Image[]> ***REMOVED***
        const params = new HttpParams().set('project_id', project_id.toString());


        return this.http.get<Image[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***images/', ***REMOVED***
            withCredentials: true,
            params: params,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    getImagesSnapshotsNames(): Observable<any> ***REMOVED***

        return this.http.get<Image[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/names/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


    checkSnapshotNameVaiable(snapshot_name: string): Observable<any> ***REMOVED***


        return this.http.get<Image[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/names/', ***REMOVED***
            withCredentials: true,
            params: ***REMOVED***snapshot_name: snapshot_name***REMOVED***

        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


    getSnapshot(openstack_id: string): Observable<Image> ***REMOVED***

        return this.http.get<Image>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/' + openstack_id + '/status/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


    getImageTags(): Observable<any> ***REMOVED***
        return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***imageTags/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


    addImageTags(imageTag: string, description: string): Observable<any> ***REMOVED***

        const params = new HttpParams().set('imageTag', imageTag).set('description', description);


        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***imageTags/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    deleteImageTag(imageTag: string): Observable<any> ***REMOVED***


        return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***imageTags/' + imageTag + '/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


    createSnapshot(snaptshot_instance: string, snapshot_name: string): Observable<any> ***REMOVED***

        const params = new HttpParams().set('snapshot_name', snapshot_name).set('snapshot_instance', snaptshot_instance);


        return this.http.post(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    deleteSnapshot(snapshot_id: string): Observable<any> ***REMOVED***
        return this.http.delete(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/' + snapshot_id + '/', ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getSnapshotsByUser(): Observable<SnapshotModel[]> ***REMOVED***


        return this.http.get<SnapshotModel[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


***REMOVED***
