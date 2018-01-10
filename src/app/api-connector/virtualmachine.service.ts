import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***VirtualMachineComponent***REMOVED*** from '../applications/addvm.component'
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***ApiSettings***REMOVED***  from './api-settings.service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import ***REMOVED***observableToBeFn***REMOVED*** from "rxjs/testing/TestScheduler";
import ***REMOVED***Metadata***REMOVED*** from "../virtualmachinemodels/metadata";
import ***REMOVED***VirtualMachine***REMOVED*** from "../virtualmachinemodels/virtualmachine";

@Injectable()
export class VirtualmachineService ***REMOVED***
  data: string;
  baseVmUrl='https://portal-dev.denbi.de/connector/vms/'

  constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
  ***REMOVED***


  startVM(flavor: string, image: string, servername: string,host: string, port: string, project: string): Observable<Response> ***REMOVED***
     let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('flavor', flavor);
    urlSearchParams.append('image', image);
    urlSearchParams.append('servername', servername);
    urlSearchParams.append('host', host);
    urlSearchParams.append('port', port);
    urlSearchParams.append('project', project);

    return this.http.post(this.baseVmUrl + 'addVm/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***

  getAllVM(): Observable<VirtualMachine[]> ***REMOVED***


    let urlSearchParams = new URLSearchParams();

    return this.http.get(this.baseVmUrl + 'getallVms/', ***REMOVED***    withCredentials: true,
      search: urlSearchParams***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  ***REMOVED***



  getVm(elixir_id: string): Observable<VirtualMachine[]> ***REMOVED***
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id)

    return this.http.get(this.baseVmUrl + 'getVmByUser/', ***REMOVED***    withCredentials: true,
      search: urlSearchParams***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  ***REMOVED***
  deleteVM(openstack_id: string): Observable<Response> ***REMOVED***
       let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('openstack_id', openstack_id)

    return this.http.post(this.baseVmUrl + 'deleteVm/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***
  stopVM(openstack_id: string): Observable<Response> ***REMOVED***
       let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('openstack_id', openstack_id)

    return this.http.post(this.baseVmUrl + 'stopVm/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***

  resumeVM(openstack_id: string): Observable<Response> ***REMOVED***
       let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('openstack_id', openstack_id)

    return this.http.post(this.baseVmUrl + 'resumeVm/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***

***REMOVED***
