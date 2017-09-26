import {Injectable} from '@angular/core';

@Injectable()
export class PerunSettings {
  constructor() {}

  /*
    Provides base URL with trailing slash for all perun RPC endpoints.
    All requiest inside of the perun-connector use it on order to make requests
   */
  getPerunBaseURL(): string {
    return 'https://perun.elixir-czech.cz/fed-denbi/rpc/json/';
  }

  /*
    Return the VO of the denbi.
    3334 is the denbi-dev VO
   */
  getPerunVO(int: boolean = false): number{
    return 3334;
  }

}
