import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from '../virtualmachines/virtualmachinemodels/image';
import ***REMOVED***SnapshotModel***REMOVED*** from "../virtualmachines/virtualmachinemodels/snapshot.model";
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from '@angular/http';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ImageService ***REMOVED***
    constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
    ***REMOVED***

    getImages(): Observable<Image[]> ***REMOVED***
        let urlSearchParams = new URLSearchParams();


        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getImages/', ***REMOVED***
            withCredentials: true,
            search: urlSearchParams
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***


    getImageTags(): Observable<any> ***REMOVED***
        let urlSearchParams = new URLSearchParams();


        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getImageTags/', ***REMOVED***
            withCredentials: true,
            search: urlSearchParams
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    ***REMOVED***


    addImageTags(imageTag: string, description: string): Observable<any> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('imageTag', imageTag)
        urlSearchParams.append('description', description)

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/addImageTag/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    ***REMOVED***


    deleteImageTag(imageTag: string): Observable<any> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('imageTag', imageTag)


        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/deleteImageTag/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    ***REMOVED***


    createSnapshot(snaptshot_instance: string, snapshot_name: string,): Observable<any> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('snapshot_name', snapshot_name)
        urlSearchParams.append('snapshot_instance', snaptshot_instance)

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/createSnapshot/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

    ***REMOVED***

    deleteSnapshot(snapshot_id: string): Observable<any> ***REMOVED***
        let header = new Headers(***REMOVED***
            'X-CSRFToken': this.settings.getCSRFToken(),
        ***REMOVED***);
        let urlSearchParams = new URLSearchParams();

        urlSearchParams.append('snapshot_id', snapshot_id)

        return this.http.post(this.settings.getConnectorBaseUrl() + 'images/deleteSnapshot/', urlSearchParams, ***REMOVED***
            withCredentials: true,
            headers: header
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***

    getSnapshotsByUser(): Observable<SnapshotModel[]> ***REMOVED***
        let urlSearchParams = new URLSearchParams();


        return this.http.get(this.settings.getConnectorBaseUrl() + 'images/getSnapshots/', ***REMOVED***
            withCredentials: true,
            search: urlSearchParams
        ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))


    ***REMOVED***


***REMOVED***
