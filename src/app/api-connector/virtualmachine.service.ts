import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***VirtualMachineComponent***REMOVED*** from '../applications/addvm.component'
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import ***REMOVED***observableToBeFn***REMOVED*** from "rxjs/testing/TestScheduler";
import ***REMOVED***Metadata***REMOVED*** from "../virtualmachinemodels/metadata";
import ***REMOVED***VirtualMachine***REMOVED*** from "../virtualmachinemodels/virtualmachine";

@Injectable()
export class VirtualmachineService ***REMOVED***

  constructor(private http: Http) ***REMOVED***
  ***REMOVED***

  data: string;

  startVM(flavor: string, image: string, public_key: string, servername: string, username: string, elixir_id: string, host: string, port: string, project :string ,userlogin: string): Observable<Response> ***REMOVED***
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('flavor', flavor);
    urlSearchParams.append('image', image);
    let re = /\+/gi;

    let newstr = public_key.replace(re, "%2B");

    urlSearchParams.append('public_key', newstr);
    urlSearchParams.append('username', username);
    urlSearchParams.append('elixir_id', elixir_id)
    urlSearchParams.append('servername', servername);
    urlSearchParams.append('host', host);
    urlSearchParams.append('port', port);
     urlSearchParams.append('project', project);
      urlSearchParams.append('userlogin', userlogin);
    urlSearchParams.append('request', 'add');
    return this.http.post('https://portal-dev.denbi.de/connector/vms/', urlSearchParams);
  ***REMOVED***

  getAllVM(): Observable<VirtualMachine[]> ***REMOVED***


    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'all')
    return this.http.get('https://portal-dev.denbi.de/connector/vms/', ***REMOVED***search: urlSearchParams***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  ***REMOVED***
    getALLVMOPS()***REMOVED*** let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'allOPS')
    return this.http.get('https://portal-dev.denbi.de/connector/vms/', ***REMOVED***search: urlSearchParams***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  ***REMOVED***
  getVm(elixir_id: string): Observable<VirtualMachine[]> ***REMOVED***
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id)
    urlSearchParams.append('request', 'user')
    return this.http.get('https://portal-dev.denbi.de/connector/vms/', ***REMOVED***search: urlSearchParams***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  ***REMOVED***

  stopVM( openstack_id: string): Observable<Response> ***REMOVED***
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('openstack_id', openstack_id)
     urlSearchParams.append('request', 'stop');
    return this.http.post('https://portal-dev.denbi.de/connector/vms/', urlSearchParams);
  ***REMOVED***

  resumeVM( openstack_id: string): Observable<Response> ***REMOVED***
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('openstack_id', openstack_id)
     urlSearchParams.append('request', 'resume');
    return this.http.post('https://portal-dev.denbi.de/connector/vms/', urlSearchParams);
  ***REMOVED***

***REMOVED***
