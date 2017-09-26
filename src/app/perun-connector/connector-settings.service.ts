import ***REMOVED***Injectable***REMOVED*** from '@angular/core';

@Injectable()
export class PerunSettings ***REMOVED***
  constructor() ***REMOVED******REMOVED***

  /*
    Provides base URL with trailing slash for all perun RPC endpoints.
    All requiest inside of the perun-connector use it on order to make requests
   */
  getPerunBaseURL(): string ***REMOVED***
    return 'https://perun.elixir-czech.cz/fed-denbi/rpc/json/';
  ***REMOVED***

  /*
    Return the VO of the denbi.
    3334 is the denbi-dev VO
   */
  getPerunVO(int: boolean = false): number***REMOVED***
    return 3334;
  ***REMOVED***

***REMOVED***
