import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {VirtualMachineComponent} from '../applications/addvm.component'
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {ApiSettings} from './api-settings.service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {VirtualMachine} from '../virtualmachinemodels/virtualmachine';

@Injectable()
export class VirtualmachineService {
  data: string;
  baseVmUrl = this.settings.getConnectorBaseUrl() + 'vms/'

  constructor(private http: Http, private settings: ApiSettings) {
  }


  startVM(flavor: string, image: string, servername: string, host: string, port: string, project: string,projectid :string): Observable<Response> {
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('flavor', flavor);
    urlSearchParams.append('image', image);
    urlSearchParams.append('servername', servername);
    urlSearchParams.append('host', host);
    urlSearchParams.append('port', port);
    urlSearchParams.append('project', project);
     urlSearchParams.append('projectid', projectid);

    return this.http.post(this.baseVmUrl + 'addVm/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }

  getAllVM(): Observable<VirtualMachine[]> {


    let urlSearchParams = new URLSearchParams();

    return this.http.get(this.baseVmUrl + 'getallVms/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }


  getVm(elixir_id: string): Observable<VirtualMachine[]> {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id)

    return this.http.get(this.baseVmUrl + 'getVmByUser/', {
      withCredentials: true,
      search: urlSearchParams
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  deleteVM(openstack_id: string): Observable<Response> {
    let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    let urlSearchParams = new URLSearchParams();

    urlSearchParams.append('openstack_id', openstack_id)

    return this.http.post(this.baseVmUrl + 'deleteVm/', urlSearchParams, {
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

    return this.http.post(this.baseVmUrl + 'stopVm/', urlSearchParams, {
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

    return this.http.post(this.baseVmUrl + 'resumeVm/', urlSearchParams, {
      withCredentials: true,
      headers: header,
    });
  }

}
