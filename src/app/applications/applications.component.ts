import ***REMOVED***Component***REMOVED*** from '@angular/core';
import 'rxjs/add/operator/toPromise';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***AuthzResolver***REMOVED*** from '../perun-connector/authz-resolver.service'
import ***REMOVED***UsersManager***REMOVED*** from '../perun-connector/users-manager.service'
import ***REMOVED***GroupsManager***REMOVED*** from '../perun-connector/groups-manager.service'
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***Application***REMOVED*** from "./application.model";

@Component(***REMOVED***
  templateUrl: 'applications.component.html',
  providers: [AuthzResolver, UsersManager, GroupsManager, PerunSettings, ApplicationsService, ApiSettings]
***REMOVED***)
export class ApplicationsComponent ***REMOVED***

  user_applications: Application[] = new Array();
  is_vo_admin = false;
  all_applications = [];

  constructor(private applicataionsservice: ApplicationsService,
              private authzresolver: AuthzResolver,
              private perunsettings: PerunSettings,
              private groupsmanager: GroupsManager,
              private usersmanager: UsersManager,) ***REMOVED***
    this.getUserApplications();
    this.getAllApplications(usersmanager);

  ***REMOVED***

  getUserApplications() ***REMOVED***
    this.applicataionsservice
      .getUserApplications().toPromise()
      .then(result => ***REMOVED***
        let res = result.json();
        for (let key in res) ***REMOVED***
          let aj = res[key];
          let a = new Application();
          a.Name = aj["project_application_name"];
          a.Description = aj["project_application_description"];
          a.DateSubmitted = aj["project_application_date_submitted"];
          a.Status = aj["project_application_status"];
          this.user_applications.push(a)
        ***REMOVED***
      ***REMOVED***);
  ***REMOVED***

  getAllApplications(usersmanager: UsersManager) ***REMOVED***
    //todo check if user is VO Admin
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
          this.applicataionsservice
            .getAllApplications().toPromise()
            .then(result => ***REMOVED***
              let res = result.json();
              for (let key in res) ***REMOVED***
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
              ***REMOVED***
            ***REMOVED***);
          break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  public createGroup(event, name, description) ***REMOVED***
    alert('Creating group  is currently disabled, due to Perun problems.');
    this.groupsmanager.createGroup(name, description).toPromise();
    //todo add user to the group
    //todo change application status
    this.getUserApplications();
    this.getAllApplications(this.usersmanager);
  ***REMOVED***

***REMOVED***

