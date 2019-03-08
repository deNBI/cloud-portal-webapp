import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment'

@Injectable()
export class PerunSettings {
    constructor() {
    }

    /*
      Provides base URL with trailing slash for all perun RPC endpoints.
      All requiest inside of the perun-connector use it on order to make requests
     */
    getPerunBaseURL(): string {
        return 'https://perun.elixir-czech.cz/oauth/rpc/json/';
    }

    /*
      Return the VO of the denbi.
      3334 is the denbi-dev VO
     */
    getPerunVO(int: boolean = false): number {
        return environment.vo;
    }

    /*
      returns the current used IdP service, which is configured with shibboleth
      Reuired for the member identification by VO and elixir ID
     */
    getUserExtSource(): string {
        return 'https://login.elixir-czech.org/idp/';
    }

}
