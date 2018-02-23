import {Component, OnInit} from '@angular/core';
import {UsersManager} from "../perun-connector/users-manager.service";
import {AuthzResolver} from "../perun-connector/authz-resolver.service";
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {ClientService} from "../api-connector/vmClients.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  providers: [ClientService, AuthzResolver, UsersManager, PerunSettings, ApiSettings]
})
export class FullLayoutComponent implements OnInit {

  public year = new Date().getFullYear();
  public disabled = false;
  public status: { isopen: boolean } = {isopen: false};
  private is_vo_admin = false;
  client_avaiable;

  constructor(private clientservice: ClientService, private perunsettings: PerunSettings, private usersmanager: UsersManager, private authzresolver: AuthzResolver) {
    this.is_client_avaiable();
  }

  public get_is_vo_admin(): boolean {
    return this.is_vo_admin;
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  is_client_avaiable() {
    this.clientservice.getRRFirstClient().subscribe(result => {
      try {
        if (result['status'] === 'Connected') {
          this.client_avaiable = true;
          return
        }
        this.client_avaiable = false;
        return;
      }
      catch (e) {
        this.client_avaiable = false;
        return;
      }

    })

  }

  checkVOstatus(usersmanager: UsersManager) {
    let user_id: number;
    let admin_vos: {};
    this.authzresolver
      .getLoggedUser().toPromise()
      .then(function (userdata) {
        //TODO catch errors
        user_id = userdata.json()["id"];
        return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise();
      }).then(function (adminvos) {
      admin_vos = adminvos.json();
    }).then(result => {
      //check if user is a Vo admin so we can serv according buttons
      for (let vkey in admin_vos) {
        if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
          this.is_vo_admin = true;
        }

      }
    });
  }

  ngOnInit(): void {
    this.checkVOstatus(this.usersmanager);
  }
}
