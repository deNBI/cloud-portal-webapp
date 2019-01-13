import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from '../virtualmachines/virtualmachinemodels/image';
import ***REMOVED***SnapshotModel***REMOVED*** from "../virtualmachines/virtualmachinemodels/snapshot.model";
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable, throwError***REMOVED*** from 'rxjs';
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';

const header = new HttpHeaders(***REMOVED***
    'X-CSRFToken': Cookie.get("csrftoken")
***REMOVED***);


@Injectable()
export class ImageService ***REMOVED***
    constructor(private http: HttpClient, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getImages(project_id:number): Observable<Image[]> ***REMOVED***
        let params = new HttpParams().set('project_id', project_id.toString());


        return this.http.get<Image[]>(this.settings.getConnectorBaseUrl() + 'images/', ***REMOVED***
            withCredentials: true,
            params:params,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***
    getImagesSnapshotsNames(): Observable<any> ***REMOVED***

        return this.http.get<Image[]>(this.settings.getConnectorBaseUrl() + 'snapshots/names/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


    getImageTags(): Observable<any> ***REMOVED***
        return this.http.get(this.settings.getConnectorBaseUrl() + 'imageTags/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


    addImageTags(imageTag: string, description: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('imageTag', imageTag).set('description', description);


        return this.http.post(this.settings.getConnectorBaseUrl() + 'imageTags/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***


    deleteImageTag(imageTag: string): Observable<any> ***REMOVED***


        return this.http.delete(this.settings.getConnectorBaseUrl() + 'imageTags/' + imageTag +'/',  ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


    createSnapshot(snaptshot_instance: string, snapshot_name: string): Observable<any> ***REMOVED***

        let params = new HttpParams().set('snapshot_name', snapshot_name).set('snapshot_instance', snaptshot_instance);


        return this.http.post(this.settings.getConnectorBaseUrl() + 'snapshots/', params, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***

    deleteSnapshot(snapshot_id: string): Observable<any> ***REMOVED***
        return this.http.delete(this.settings.getConnectorBaseUrl() + 'snapshots/' + snapshot_id + '/',  ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));

    ***REMOVED***

    getSnapshotsByUser(): Observable<SnapshotModel[]> ***REMOVED***


        return this.http.get<SnapshotModel[]>(this.settings.getConnectorBaseUrl() + 'snapshots/', ***REMOVED***
            withCredentials: true,
        ***REMOVED***).pipe(catchError((error: any) => throwError(error)));


    ***REMOVED***


***REMOVED***
