import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***AuthzResolver***REMOVED*** from '../perun-connector/authz-resolver.service'
import ***REMOVED***GroupsManager***REMOVED*** from '../perun-connector/groups-manager.service'
import ***REMOVED***MembersManager***REMOVED*** from '../perun-connector/members-manager.service'
import ***REMOVED***UsersManager***REMOVED*** from '../perun-connector/users-manager.service'
import ***REMOVED***Http***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import 'rxjs/add/operator/toPromise';
@Component(***REMOVED***
  templateUrl: 'overview.component.html',
  providers: [AuthzResolver, GroupsManager, MembersManager, UsersManager, PerunSettings]
***REMOVED***)
export class OverviewComponent ***REMOVED***

  debug_module = false;

  userprojects: ***REMOVED******REMOVED***;
  userid: number;
  member_id: number;
  user_data: ***REMOVED******REMOVED***;
  admingroups: ***REMOVED******REMOVED***;
  adminvos: ***REMOVED******REMOVED***;
  projects = [];


  constructor(private authzresolver: AuthzResolver,
              private perunsettings: PerunSettings,
              useresmanager: UsersManager,
              groupsmanager: GroupsManager,
              membersmanager: MembersManager) ***REMOVED***
    this.getUserProjects(groupsmanager, membersmanager, useresmanager);
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

        this.projects.push(***REMOVED***
          id: group["id"],
          name: group["name"],
          description: group["description"],
          created: dateCreated.getDate() + "." + dateCreated.getMonth() + "." + dateCreated.getFullYear(),
          days_running: dateDayDifference,
          is_pi: is_pi,
          is_admin: is_admin

        ***REMOVED***);


      ***REMOVED***

    ***REMOVED***);
    // .then( function()***REMOVED*** groupsmanager.getGroupsWhereUserIsAdmin(this.userid); ***REMOVED***);


  ***REMOVED***
***REMOVED***
