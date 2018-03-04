import ***REMOVED***Component, Input, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***AuthzResolver***REMOVED*** from '../perun-connector/authz-resolver.service'
import ***REMOVED***GroupsManager***REMOVED*** from '../perun-connector/groups-manager.service'
import ***REMOVED***MembersManager***REMOVED*** from '../perun-connector/members-manager.service'
import ***REMOVED***UsersManager***REMOVED*** from '../perun-connector/users-manager.service'
import ***REMOVED***Http***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***Project***REMOVED*** from './project.model';
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';
import ***REMOVED***ProjectMember***REMOVED*** from './project_member.model'
import ***REMOVED***ResourcesManager***REMOVED*** from "../perun-connector/resources_manager";
import 'rxjs/add/operator/toPromise';
import ***REMOVED***isNumber***REMOVED*** from "util";
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";

@Component(***REMOVED***
    templateUrl: 'overview.component.html',
    providers: [GroupService, ResourcesManager, AuthzResolver, GroupsManager, MembersManager, UsersManager, PerunSettings, ApiSettings]
***REMOVED***)
export class OverviewComponent ***REMOVED***

  debug_module = false;

  @Input() voRegistrationLink: string = environment.voRegistrationLink;

  userprojects: ***REMOVED******REMOVED***;
  userid: number;
  member_id: number;
  user_data: ***REMOVED******REMOVED***;
  admingroups: ***REMOVED******REMOVED***;
  adminvos: ***REMOVED******REMOVED***;
  filteredMembers = null;
  projects: Project[] = new Array();

  // modal variables for User list
  public usersModal;
  public usersModalProjectMembers: ProjectMember[] = new Array;
  public usersModalProjectID: number;
  public usersModalProjectName: string;

  //modal variables for Add User Modal
  public addUserModal;
  public addUserModalProjectID: number;
  public addUserModalProjectName: string;
  public UserModalFacility: string;


  //notification Modal variables
  public notificationModal;
  public notificationModalTitle: string = "Notification";
  public notificationModalMessage: string = "Please wait...";
  public notificationModalType: string = "info";
  public notificationModalIsClosable: boolean = false;

  constructor(private authzresolver: AuthzResolver,
              private perunsettings: PerunSettings,
              private useresmanager: UsersManager,
              private groupsmanager: GroupsManager,
              private membersmanager: MembersManager,
              private  resourceManager: ResourcesManager,
             private groupservice: GroupService) ***REMOVED***
    this.getUserProjects(groupsmanager, membersmanager, useresmanager);
  ***REMOVED***

  public updateUserProjects() ***REMOVED***
    this.projects = [];
    this.getUserProjects(this.groupsmanager, this.membersmanager, this.useresmanager);
  ***REMOVED***



    getUserProjects(groupsmanager: GroupsManager,
                    membersmanager: MembersManager,
                    usersmanager: UsersManager) ***REMOVED***
        let user_id: number;
        let member_id: number;
        let user_projects: ***REMOVED******REMOVED***;
        let user_data: ***REMOVED******REMOVED***;
        let admin_groups: ***REMOVED******REMOVED***;
        let admin_vos: ***REMOVED******REMOVED***;

        this.authzresolver
            .getLoggedUser().toPromise()
            .then(function (userdata) ***REMOVED***
                //TODO catch errors
                let userid = userdata.json()["id"];
                user_id = userid;
                user_data = userdata.json();
                return membersmanager.getMemberByUser(userid).toPromise();
            ***REMOVED***)
            .then(function (memberdata) ***REMOVED***
                let memberid = memberdata.json()["id"];
                member_id = memberid;
                return groupsmanager.getMemberGroups(memberid).toPromise();
            ***REMOVED***).then(function (groupsdata) ***REMOVED***
            user_projects = groupsdata.json();
        ***REMOVED***).then(function () ***REMOVED***
            return usersmanager.getGroupsWhereUserIsAdmin(user_id).toPromise();
        ***REMOVED***).then(function (admingroups) ***REMOVED***
            admin_groups = admingroups.json();
        ***REMOVED***).then(function () ***REMOVED***
            return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise();
        ***REMOVED***).then(function (adminvos) ***REMOVED***
            admin_vos = adminvos.json();
        ***REMOVED***).then(result => ***REMOVED***

            //hold data in the class just in case
            this.userprojects = user_projects;
            this.userid = user_id;
            this.user_data = user_data;
            this.member_id = member_id;
            this.admingroups = admin_groups;
            this.adminvos = admin_vos;

            let is_admin = false;
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in this.adminvos) ***REMOVED***
                if (this.adminvos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) ***REMOVED***
                    is_admin = true;
                    break;
                ***REMOVED***
            ***REMOVED***


            for (let key in this.userprojects) ***REMOVED***
                let group = this.userprojects[key];
                let dateCreated = new Date(group["createdAt"]);
                let dateDayDifference = Math.ceil((Math.abs(Date.now() - dateCreated.getTime())) / (1000 * 3600 * 24));
                let is_pi = false;

                //check if user is a PI (group manager)
                if (!is_admin) ***REMOVED***
                    for (let gkey in this.admingroups) ***REMOVED***
                        if (group["id"] == this.admingroups[gkey]["id"]) ***REMOVED***
                            is_pi = true;
                            break;
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED*** else ***REMOVED***
                    is_pi = true;
                ***REMOVED***
                this.resourceManager.getGroupAssignedResources(group['id']).subscribe(resource => ***REMOVED***
                    try ***REMOVED***
                        let resource_id = resource.json()[0]['id'];
                        this.resourceManager.getFacilityByResource(resource_id).subscribe(facility => ***REMOVED***
                            let newProject = new Project(
                                group["id"],
                                group["name"],
                                group["description"],
                                dateCreated.getDate() + "." + (dateCreated.getMonth() + 1) + "." + dateCreated.getFullYear(),
                                dateDayDifference,
                                is_pi,
                                is_admin,
                                facility.json()['name'])
                            try ***REMOVED***
                                this.groupservice.getComputeCentersDetails(resource_id).subscribe(details => ***REMOVED***
                                    if (details) ***REMOVED***
                                        let details_array = [];
                                        for (let detail in details) ***REMOVED***
                                            let detail_as_string = detail + ': ' + details[detail];
                                            details_array.push(detail_as_string);
                                        ***REMOVED***
                                        newProject.ComputecenterDetails = details_array;
                                    ***REMOVED***
                                    this.projects.push(newProject);

                                ***REMOVED***)
                            ***REMOVED***
                            catch(e)***REMOVED***
                                this.projects.push(newProject);
                            ***REMOVED***


                        ***REMOVED***)
                    ***REMOVED***
                    catch (e) ***REMOVED***

                        this.projects.push(new Project(
                            group["id"],
                            group["name"],
                            group["description"],
                            dateCreated.getDate() + "." + (dateCreated.getMonth() + 1) + "." + dateCreated.getFullYear(),
                            dateDayDifference,
                            is_pi,
                            is_admin,
                            'None')
                        );


                    ***REMOVED***
                ***REMOVED***)


            ***REMOVED***

        ***REMOVED***);
        // .then( function()***REMOVED*** groupsmanager.getGroupsWhereUserIsAdmin(this.userid); ***REMOVED***);
    ***REMOVED***




  public resetAddUserModal() ***REMOVED***
    this.addUserModalProjectID = null;
    this.addUserModalProjectName = null;
    this.UserModalFacility = null;
  ***REMOVED***

  filterMembers(firstName: string, lastName: string, groupid: number) ***REMOVED***
    this.membersmanager.getMembersOfdeNBIVo(firstName, lastName, groupid.toString()).subscribe(result => ***REMOVED***
      this.filteredMembers = result;
    ***REMOVED***)
  ***REMOVED***


  getMembesOfTheProject(projectid: number, projectname: string) ***REMOVED***
    this.groupsmanager.getGroupRichMembers(projectid).toPromise()
      .then(function (members_raw) ***REMOVED***
        return members_raw.json();
      ***REMOVED***).then(members => ***REMOVED***
      this.usersModalProjectID = projectid;
      this.usersModalProjectName = projectname;
      this.usersModalProjectMembers = new Array();
      for (let member of members) ***REMOVED***
        let member_id = member["id"];
        let user_id = member["userId"];
        let fullName = member["user"]["firstName"] + " " + member["user"]["lastName"];
        this.usersModalProjectMembers.push(new ProjectMember(user_id, fullName, member_id));
      ***REMOVED***

    ***REMOVED***);
  ***REMOVED***

  public showMembersOfTheProject(projectid: number, projectname: string,facility:string) ***REMOVED***
    this.getMembesOfTheProject(projectid, projectname);
    if (facility === 'None') ***REMOVED***
      this.UserModalFacility = null;
    ***REMOVED***
    else ***REMOVED***
      this.UserModalFacility = facility;
    ***REMOVED***
  ***REMOVED***


  public resetNotificaitonModal() ***REMOVED***
    this.notificationModalTitle = "Notification";
    this.notificationModalMessage = "Please wait...";
    this.notificationModalIsClosable = false;
    this.notificationModalType = "info";
  ***REMOVED***

  public updateNotificaitonModal(title: string, message: string, closable: true, type: string) ***REMOVED***
    this.notificationModalTitle = title;
    this.notificationModalMessage = message;
    this.notificationModalIsClosable = closable;
    this.notificationModalType = type;
  ***REMOVED***

  public makeNotificationModalClosable(closable: boolean) ***REMOVED***
    this.notificationModalIsClosable = closable;
  ***REMOVED***

  public changeNotificationModalTitle(title: string) ***REMOVED***
    this.notificationModalTitle = title;
  ***REMOVED***

  public changeNotificationModalMessage(message: string) ***REMOVED***
    this.notificationModalMessage = message;
  ***REMOVED***

  public changeNotificationModalType(type: string) ***REMOVED***
    this.notificationModalType = type;
  ***REMOVED***

  public showAddUserToProjectModal(projectid: number, projectname: string, facility: string) ***REMOVED***
      this.addUserModalProjectID = projectid;
      this.addUserModalProjectName = projectname;
      if (facility === 'None') ***REMOVED***
          this.UserModalFacility = null;
      ***REMOVED***
      else ***REMOVED***
          this.UserModalFacility = facility;

      ***REMOVED***
  ***REMOVED***





    public addMember(groupid: number, memberid: number, firstName: string, lastName: string) ***REMOVED***
        this.groupsmanager.addMember(groupid, memberid).toPromise()
            .then(result => ***REMOVED***
                if (result.status == 200) ***REMOVED***
                    this.updateNotificaitonModal("Success", "Member " + firstName + " " + lastName + " added.", true, "success");

                ***REMOVED*** else ***REMOVED***
                    this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
                ***REMOVED***
            ***REMOVED***).catch(error => ***REMOVED***
            this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
        ***REMOVED***);
    ***REMOVED***

    public removeMember(groupid: number, memberid: number,name:string) ***REMOVED***
        this.groupsmanager.removeMember(groupid, memberid).toPromise()
            .then(result => ***REMOVED***
                if (result.status == 200) ***REMOVED***
                    this.updateNotificaitonModal("Success", "Member " + name + " removed from the group", true, "success");

                ***REMOVED*** else ***REMOVED***
                    this.updateNotificaitonModal("Failed", "Member"  + name + " could not be removed !", true, "danger");
                ***REMOVED***
            ***REMOVED***).catch(error => ***REMOVED***
            this.updateNotificaitonModal("Failed", "Member"  + name + " could not be removed !", true, "danger");
        ***REMOVED***);
    ***REMOVED***

    public comingSoon() ***REMOVED***
        alert("This function will be implemented soon.")
    ***REMOVED***
***REMOVED***
