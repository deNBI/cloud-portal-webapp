import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***stringDistance***REMOVED*** from "codelyzer/util/utils";
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'

@Injectable()
export class PerunSettings ***REMOVED***
  constructor() ***REMOVED******REMOVED***

  /*
    Provides base URL with trailing slash for all perun RPC endpoints.
    All requiest inside of the perun-connector use it on order to make requests
   */
  getPerunBaseURL(): string ***REMOVED***
    return 'https://perun.elixir-czech.cz/oauth/rpc/json/';
  ***REMOVED***

  /*
    Return the VO of the denbi.
    3334 is the denbi-dev VO
   */
  getPerunVO(int: boolean = false): number***REMOVED***
    return environment.vo;
  ***REMOVED***

  /*
    returns the current used IdP service, which is configured with shibboleth
    Reuired for the member identification by VO and elixir ID
   */
  getUserExtSource(): string***REMOVED***
    return "https://login.elixir-czech.org/idp/";
  ***REMOVED***

***REMOVED***

