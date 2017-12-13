import {Injectable} from '@angular/core';
import {URLSearchParams} from "@angular/http";
import {VirtualMachineComponent} from '../applications/addvm.component'
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {ApiSettings}  from './api-settings.service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {observableToBeFn} from "rxjs/testing/TestScheduler";
import {Metadata} from "../virtualmachinemodels/metadata";
import {VirtualMachine} from "../virtualmachinemodels/virtualmachine";

@Injectable()
export class VirtualmachineService {
  data: string;

  constructor(private http: Http, private settings: ApiSettings) {
  }


  startVM(flavor: string, image: string, public_key: string, servername: string, username: string,
          elixir_id: string, host: string, port: string, project: string, userlogin: string): Observable<Response> {
     let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
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
    return this.http.post('https://portal-dev.denbi.de/connector/vms/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }

  getAllVM(): Observable<VirtualMachine[]> {


    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'all')
    return this.http.get('https://portal-dev.denbi.de/connector/vms/', {    withCredentials: true,
      search: urlSearchParams}).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  getALLVMOPS() {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('request', 'allOPS')
    return this.http.get('https://portal-dev.denbi.de/connector/vms/', {    withCredentials: true,
      search: urlSearchParams}).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  getVm(elixir_id: string): Observable<VirtualMachine[]> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id)
    urlSearchParams.append('request', 'user')
    return this.http.get('https://portal-dev.denbi.de/connector/vms/', {    withCredentials: true,
      search: urlSearchParams}).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }
  deleteVM(openstack_id: string): Observable<Response> {
       let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('openstack_id', openstack_id)
    urlSearchParams.append('request', 'delete');
    return this.http.post('https://portal-dev.denbi.de/connector/vms/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }
  stopVM(openstack_id: string): Observable<Response> {
       let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('openstack_id', openstack_id)
    urlSearchParams.append('request', 'stop');
    return this.http.post('https://portal-dev.denbi.de/connector/vms/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }

  resumeVM(openstack_id: string): Observable<Response> {
       let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('openstack_id', openstack_id)
    urlSearchParams.append('request', 'resume');
    return this.http.post('https://portal-dev.denbi.de/connector/vms/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }

}
