import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***UsersManager***REMOVED*** from "../perun-connector/users-manager.service";
import ***REMOVED***AuthzResolver***REMOVED*** from "../perun-connector/authz-resolver.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";

@Component(***REMOVED***
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  providers: [AuthzResolver, UsersManager, PerunSettings, ApiSettings]
***REMOVED***)
export class FullLayoutComponent implements OnInit ***REMOVED***

  public year = new Date().getFullYear();
  public disabled = false;
  public status: ***REMOVED*** isopen: boolean ***REMOVED*** = ***REMOVED***isopen: false***REMOVED***;
  private is_vo_admin = false;

  constructor(  private perunsettings: PerunSettings, private usersmanager: UsersManager, private authzresolver: AuthzResolver) ***REMOVED***

  ***REMOVED***

  public toggled(open: boolean): void ***REMOVED***
    console.log('Dropdown is now: ', open);
  ***REMOVED***

  public toggleDropdown($event: MouseEvent): void ***REMOVED***
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  ***REMOVED***

  checkVOstatus(usersmanager: UsersManager) ***REMOVED***
    let user_id: number;
    let admin_vos: ***REMOVED******REMOVED***;
    this.authzresolver
      .getLoggedUser().toPromise()
      .then(function (userdata) ***REMOVED***
        //TODO catch errors
        user_id = userdata.json()["id"];
        return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise();
      ***REMOVED***).then(function (adminvos) ***REMOVED***
      admin_vos = adminvos.json();
    ***REMOVED***).then(result => ***REMOVED***
      //check if user is a Vo admin so we can serv according buttons
      for (let vkey in admin_vos) ***REMOVED***
        if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) ***REMOVED***
          this.is_vo_admin = true;
        ***REMOVED***
        break;
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.checkVOstatus(this.usersmanager);
  ***REMOVED***
***REMOVED***
