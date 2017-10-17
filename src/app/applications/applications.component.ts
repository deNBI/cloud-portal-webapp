import ***REMOVED***Component, ViewChild***REMOVED*** from '@angular/core';
import 'rxjs/add/operator/toPromise';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***SpecialHardwareService***REMOVED*** from '../api-connector/special-hardware.service'
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***AuthzResolver***REMOVED*** from '../perun-connector/authz-resolver.service'
import ***REMOVED***UsersManager***REMOVED*** from '../perun-connector/users-manager.service'
import ***REMOVED***MembersManager***REMOVED*** from '../perun-connector/members-manager.service'
import ***REMOVED***GroupsManager***REMOVED*** from '../perun-connector/groups-manager.service'
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***Application***REMOVED*** from "./application.model";
import ***REMOVED***ApplicationStatus***REMOVED*** from "./application_status.model";
import ***REMOVED***SpecialHardware***REMOVED*** from "./special_hardware.model";
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';

@Component(***REMOVED***
  templateUrl: 'applications.component.html',
  providers: [AuthzResolver, UsersManager, MembersManager, GroupsManager, PerunSettings, ApplicationsService, ApplicationStatusService, SpecialHardwareService, ApiSettings]
***REMOVED***)
export class ApplicationsComponent ***REMOVED***

  user_applications: Application[] = [];
  is_vo_admin = false;
  all_applications: Application[] = [];
  application_status: ApplicationStatus[] = [];
  special_hardware: SpecialHardware[] = [];

  //notification Modal variables
  public notificationModal;
  public notificationModalTitle: string = "Notification";
  public notificationModalMessage: string = "Please wait...";
  public notificationModalType: string = "info";
  public notificationModalIsClosable: boolean = false;


  collapse_status: ***REMOVED***[id: string]: boolean***REMOVED*** = ***REMOVED******REMOVED***;

  constructor(private applicataionsservice: ApplicationsService,
              private applicationstatusservice: ApplicationStatusService,
              private specialhardwareservice: SpecialHardwareService,
              private authzresolver: AuthzResolver,
              private perunsettings: PerunSettings,
              private groupsmanager: GroupsManager,
              private usersmanager: UsersManager,
              private membersmanager: MembersManager) ***REMOVED***
    this.getUserApplications();
    this.getAllApplications(usersmanager);
    this.getApplicationStatus();
    this.getSpecialHardware();

  ***REMOVED***


  getUserApplications() ***REMOVED***
    this.applicataionsservice
      .getUserApplications().toPromise()
      .then(result => ***REMOVED***
        let res = result.json();
        for (let key in res) ***REMOVED***
          let aj = res[key];
          let a = new Application();
          a.Id = aj["project_application_id"];
          a.Name = aj["project_application_name"];
          a.Lifetime = aj["project_application_lifetime"];
          a.DateSubmitted = aj["project_application_date_submitted"];
          a.Status = aj["project_application_status"]["application_status_name"];
          a.Description = aj["project_application_description"];
          a.VMsRequested = aj["project_application_vms_requested"];
          a.RamPerVM = aj["project_application_ram_per_vm"];
          a.DiskSpace = aj["project_application_disk_space"];
          a.ObjectStorage = aj["project_application_object_storage"];
          a.SpecialHardware = aj["project_application_special_hardware"];

          this.user_applications.push(a)
        ***REMOVED***
      ***REMOVED***);
  ***REMOVED***

  getApplicationStatus() ***REMOVED***
    this.applicationstatusservice.getAllApplicationStatus().toPromise()
      .then(result => ***REMOVED***
        let res = result.json();
        for (let key in res) ***REMOVED***
          let asj = res[key];
          let aj = new ApplicationStatus(asj["application_status_id"], asj["application_status_name"]);
          this.application_status.push(aj)
        ***REMOVED***
      ***REMOVED***);
  ***REMOVED***

  getSpecialHardware() ***REMOVED***
    this.specialhardwareservice.getAllSpecialHardware().toPromise()
      .then(result => ***REMOVED***
        let res = result.json();
        for (let key in res) ***REMOVED***
          let shj = res[key];
          let sh = new SpecialHardware(shj["special_hardware_id"], shj["special_hardware_key"], shj["special_hardware_name"]);
          this.special_hardware.push(sh)
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
                a.Id = aj["project_application_id"];

                a.Name = aj["project_application_name"];
                a.Description = aj["project_application_description"];
                a.Lifetime = aj["project_application_lifetime"];

                a.VMsRequested = aj["project_application_vms_requested"];
                a.RamPerVM = aj["project_application_ram_per_vm"];
                a.DiskSpace = aj["project_application_disk_space"];
                a.ObjectStorage = aj["project_application_object_storage"];
                a.SpecialHardware = aj["project_application_special_hardware"];

                a.Institute = aj["project_application_institute"];
                a.Workgroup = aj["project_application_workgroup"];

                a.DateSubmitted = aj["project_application_date_submitted"];
                a.DateStatusChanged = aj["project_application_date_status_changed"];
                a.User = aj["project_application_user"]["username"];
                a.UserEmail = aj["project_application_user"]["email"];
                a.Status = aj["project_application_status"];


                this.all_applications.push(a)
              ***REMOVED***
            ***REMOVED***);
          break;
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  public getCollapseStatus(id: string) ***REMOVED***
    if (id in this.collapse_status) ***REMOVED***
      return this.collapse_status[id];
    ***REMOVED*** else ***REMOVED***
      this.collapse_status[id] = true;
      return true;
    ***REMOVED***
  ***REMOVED***

  public switchCollapseStatus(id: string) ***REMOVED***
    this.collapse_status[id] = !this.getCollapseStatus(id);
  ***REMOVED***


  public getStatusById(id: number): string ***REMOVED***
    let s = "Unknown";
    for (let status of this.application_status) ***REMOVED***
      if (status.Id == id) ***REMOVED***
        return status.Name;
      ***REMOVED***
    ***REMOVED***
    return s;
  ***REMOVED***

  public getIdByStatus(name: string): number ***REMOVED***
    let s = -1;
    for (let status of this.application_status) ***REMOVED***
      if (status.Name == name) ***REMOVED***
        return status.Id;
      ***REMOVED***
    ***REMOVED***
    return s;
  ***REMOVED***

  public updateNotificaitonModal(title: string, message: string, closable: true, type: string) ***REMOVED***
    this.notificationModalTitle = title;
    this.notificationModalMessage = message;
    this.notificationModalIsClosable = closable;
    this.notificationModalType = type;
  ***REMOVED***

  public createGroup(name, description, manager_elixir_id, application_id) ***REMOVED***
    //get memeber id in order to add the user later as the new member and manager of the group
    let manager_member_id: number;
    let manager_member_user_id: number;
    let new_group_id: number;

    this.membersmanager.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).toPromise()
      .then(member_raw => ***REMOVED***
          let member = member_raw.json();
          manager_member_id = member["id"];
          manager_member_user_id = member["userId"];
          // create new group
          return this.groupsmanager.createGroup(name, description).toPromise();
        ***REMOVED***
      ).then(group_raw => ***REMOVED***
      let group = group_raw.json();
      new_group_id = group["id"];

      //add the application user to the group
      return this.groupsmanager.addMember(new_group_id, manager_member_id).toPromise();

    ***REMOVED***).then(null_result => ***REMOVED***
      return this.groupsmanager.addAdmin(new_group_id, manager_member_user_id).toPromise();
    ***REMOVED***).then(null_result => ***REMOVED***
      return this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("approved")).toPromise();
    ***REMOVED***).then(null_result => ***REMOVED***
      //update modal
      this.updateNotificaitonModal("Success", "The new project was created", true, "success");
      //update applications
      this.all_applications = [];
      this.user_applications = [];
      this.getUserApplications();
      this.getAllApplications(this.usersmanager);
    ***REMOVED***).catch(error => ***REMOVED***
      this.updateNotificaitonModal("Failed", "Project could not be created!", true, "danger");
    ***REMOVED***);

  ***REMOVED***

  public declineApplication(application_id) ***REMOVED***
    this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("declined")).toPromise()
      .then(result => ***REMOVED***
        this.all_applications = [];
        this.user_applications = [];
        this.getUserApplications();
        this.getAllApplications(this.usersmanager);
        this.updateNotificaitonModal("Success", "The Application was declined", true, "success");
      ***REMOVED***)
      .catch(error => ***REMOVED***
        this.updateNotificaitonModal("Failed", "Application could be decilned!", true, "danger");
      ***REMOVED***);
  ***REMOVED***

  public activeApplicationsAvailable(): boolean ***REMOVED***
    for (let application of this.all_applications) ***REMOVED***
      if (application.Status == 1) ***REMOVED***
        return true;
      ***REMOVED***
    ***REMOVED***
    return false;
  ***REMOVED***

  public comingSoon() ***REMOVED***
    alert("This functinality will be implemented soon!")
  ***REMOVED***


***REMOVED***

