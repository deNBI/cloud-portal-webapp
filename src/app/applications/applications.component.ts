import {Component} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {ApplicationsService} from '../api-connector/applications.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {AuthzResolver} from '../perun-connector/authz-resolver.service'
import {UsersManager} from '../perun-connector/users-manager.service'
import {GroupsManager} from '../perun-connector/groups-manager.service'
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Application} from "./application.model";

@Component({
  templateUrl: 'applications.component.html',
  providers: [AuthzResolver, UsersManager, GroupsManager, PerunSettings, ApplicationsService, ApiSettings]
})
export class ApplicationsComponent {

  user_applications: Application[] = new Array();
  is_vo_admin = false;
  all_applications = [];

  constructor(private applicataionsservice: ApplicationsService,
              private authzresolver: AuthzResolver,
              private perunsettings: PerunSettings,
              private groupsmanager: GroupsManager,
              private usersmanager: UsersManager,) {
    this.getUserApplications();
    this.getAllApplications(usersmanager);

  }

  getUserApplications() {
    this.applicataionsservice
      .getUserApplications().toPromise()
      .then(result => {
        let res = result.json();
        for (let key in res) {
          let aj = res[key];
          let a = new Application();
          a.Name = aj["project_application_name"];
          a.Description = aj["project_application_description"];
          a.DateSubmitted = aj["project_application_date_submitted"];
          a.Status = aj["project_application_status"];
          this.user_applications.push(a)
        }
      });
  }

  getAllApplications(usersmanager: UsersManager) {
    //todo check if user is VO Admin
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
          this.applicataionsservice
            .getAllApplications().toPromise()
            .then(result => {
              let res = result.json();
              for (let key in res) {
                let aj = res[key];
                let a = new Application();
                a.Name = aj["project_application_name"];
                a.Description = aj["project_application_description"];
                a.Institute = aj["project_application_institute"];
                a.Workgroup = aj["project_application_workgroup"];
                a.DateSubmitted = aj["project_application_date_submitted"];
                a.DateStatusChanged = aj["project_application_date_status_changed"];
                a.User = aj["project_application_user"]
                a.Status = aj["project_application_status"];


                this.all_applications.push(a)
              }
            });
          break;
        }
      }
    });
  }

  public createGroup(event, name, description) {
    alert('Creating group  is currently disabled, due to Perun problems.');
    this.groupsmanager.createGroup(name, description).toPromise();
    //todo add user to the group
    //todo change application status
    this.getUserApplications();
    this.getAllApplications(this.usersmanager);
  }

}

