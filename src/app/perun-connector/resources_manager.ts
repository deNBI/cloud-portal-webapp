import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from './connector-settings.service'
import ***REMOVED*** Observable***REMOVED*** from 'rxjs';
import 'rxjs/add/operator/map';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';

@Injectable()
export class ResourcesManager ***REMOVED***
  constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getGroupAssignedResources(group_id: number) ***REMOVED***
    return this.http.get(this.settings.getPerunBaseURL() + 'resourcesManager/getAssignedResources', ***REMOVED***
      headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      params: ***REMOVED***group: group_id***REMOVED***
    ***REMOVED***);
  ***REMOVED***

   getFacilityByResource(resource_id: number) ***REMOVED***
    return this.http.get(this.settings.getPerunBaseURL() + 'resourcesManager/getFacility', ***REMOVED***
      headers: new Headers(***REMOVED***'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()***REMOVED***),
      params: ***REMOVED***resource: resource_id***REMOVED***
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
