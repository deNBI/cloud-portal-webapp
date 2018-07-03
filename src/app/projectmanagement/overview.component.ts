import ***REMOVED***Component, Input, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***Http***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***Project***REMOVED*** from './project.model';
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';
import ***REMOVED***ProjectMember***REMOVED*** from './project_member.model'
import 'rxjs/add/operator/toPromise';
import ***REMOVED***isNumber***REMOVED*** from "util";
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import  * as moment from 'moment';
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";


@Component(***REMOVED***
    templateUrl: 'overview.component.html',
    providers: [VoService,UserService, GroupService,  PerunSettings, ApiSettings]
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
    public UserModalFacilityDetails: [string, string][];
    public UserModalFacility: [string, number];


    //notification Modal variables
    public notificationModal;
    public notificationModalTitle: string = "Notification";
    public notificationModalMessage: string = "Please wait...";
    public notificationModalType: string = "info";
    public notificationModalInfoMessage: string = ''
    public notificationModalIsClosable: boolean = false;

    public passwordModalTitle: string = "Changing Password";
    public passwordModalType: string = 'info';
    public passwordModalPassword: string = '';
    public passwordModalFacility: string = '';
    public passwordModalEmail: string = '';

    constructor(
                private perunsettings: PerunSettings,
                private groupservice: GroupService,
                private userservice: UserService,
                private voservice:VoService) ***REMOVED***
        this.getUserProjects(groupservice, userservice);

    ***REMOVED***

    public updateUserProjects() ***REMOVED***
        this.projects = [];


    ***REMOVED***


    setUserFacilityPassword(facility: string, details: [string, string][]) ***REMOVED***
        this.userservice.setUserFacilityPassword(facility).subscribe(result => ***REMOVED***
            result = result.json()
            for (let key of details) ***REMOVED***
                if (key[0] == 'Support') ***REMOVED***
                    this.passwordModalEmail = key[1];
                ***REMOVED***
            ***REMOVED***

            this.passwordModalFacility = facility;
            if (result['Error']) ***REMOVED***
                this.passwordModalTitle = 'Set or update password'
                this.passwordModalType = 'warning'
            ***REMOVED***
            else ***REMOVED***
                this.passwordModalTitle = 'Success'
                this.passwordModalType = 'success'
                this.passwordModalPassword = result.toString()
            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***

    getUserProjects(groupservice: GroupService,
                    userservice: UserService) ***REMOVED***
        let user_id: number;
        let member_id: number;
        let user_projects: ***REMOVED******REMOVED***;
        let user_data: ***REMOVED******REMOVED***;
        let admin_groups: ***REMOVED******REMOVED***;
        let admin_vos: ***REMOVED******REMOVED***;

        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) ***REMOVED***
                //TODO catch errors
                let userid = userdata.json()["id"];
                user_id = userid;
                user_data = userdata.json();
                return userservice.getMemberByUser(userid).toPromise();
            ***REMOVED***)
            .then(function (memberdata) ***REMOVED***
                let memberid = memberdata.json()["id"];
                member_id = memberid;
                return groupservice.getMemberGroups(memberid).toPromise();
            ***REMOVED***).then(function (groupsdata) ***REMOVED***
            user_projects = groupsdata.json();
        ***REMOVED***).then(function () ***REMOVED***
            return userservice.getGroupsWhereUserIsAdmin(user_id).toPromise();
        ***REMOVED***).then(function (admingroups) ***REMOVED***
            admin_groups = admingroups.json();
        ***REMOVED***).then(function () ***REMOVED***

            return userservice.getVosWhereUserIsAdmin(user_id).toPromise();
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

                this.groupservice.getShortame(group['id']).subscribe(name => ***REMOVED***
                    this.groupservice.getFacilityByGroup(group["id"]).subscribe(result => ***REMOVED***
                        let shortname = name['shortname']
                        if (!shortname) ***REMOVED***
                            shortname = group['name']
                        ***REMOVED***

                        let newProject = new Project(
                            group["id"],
                            shortname,
                            group["description"],
                            dateCreated.getDate() + "." + (dateCreated.getMonth() + 1) + "." + dateCreated.getFullYear(),
                            dateDayDifference,
                            is_pi,
                            is_admin,
                            [result['Facility'], result['FacilityId']])
                        let details = result['Details'];
                        let details_array = [];
                        for (let detail in details) ***REMOVED***
                            let detail_tuple = [detail, details[detail]];
                            details_array.push(detail_tuple);
                        ***REMOVED***
                        newProject.ComputecenterDetails = details_array;
                        if (is_pi) ***REMOVED***
                            this.groupservice.getLifetime(group['id']).subscribe(result => ***REMOVED***
                                let lifetime = result['lifetime']

                                newProject.Lifetime = lifetime;
                                if (newProject.Lifetime != -1) ***REMOVED***
                                    newProject.LifetimeDays = Math.ceil(Math.abs(moment(dateCreated).add(newProject.Lifetime, 'months').toDate().getTime() - dateCreated.getTime())) / (1000 * 3600 * 24)
                                    let  expirationDate=moment(dateCreated).add(newProject.Lifetime, 'months').toDate();
                                    newProject.DateEnd=expirationDate.getDate() + "." +(expirationDate.getMonth() + 1) + "." + expirationDate.getFullYear();
                                ***REMOVED***
                                else ***REMOVED***
                                    newProject.LifetimeDays = -1;
                                ***REMOVED***
                                this.projects.push(newProject);
                            ***REMOVED***)
                        ***REMOVED***
                        else ***REMOVED***
                            this.projects.push(newProject);
                        ***REMOVED***
                    ***REMOVED***)
                ***REMOVED***)


            ***REMOVED***

        ***REMOVED***);
        // .then( function()***REMOVED*** groupsmanager.getGroupsWhereUserIsAdmin(this.userid); ***REMOVED***);
    ***REMOVED***


    lifeTimeReached(lifetime: number, running: number): string ***REMOVED***
        if (!lifetime) ***REMOVED***
            return "red";
        ***REMOVED***
        else if (lifetime == -1) ***REMOVED***
            return "blue";
        ***REMOVED***
        return (lifetime - running) < 0 ? "red" : "black";
    ***REMOVED***


    public resetAddUserModal() ***REMOVED***
        this.addUserModalProjectID = null;
        this.addUserModalProjectName = null;
        this.UserModalFacility = null;
    ***REMOVED***

    filterMembers(firstName: string, lastName: string, groupid: number) ***REMOVED***
        this.voservice.getMembersOfdeNBIVo(firstName, lastName, groupid.toString()).subscribe(result => ***REMOVED***
            this.filteredMembers = result;
        ***REMOVED***)
    ***REMOVED***


    getMembesOfTheProject(projectid: number, projectname: string) ***REMOVED***
        this.groupservice.getGroupRichMembers(projectid).toPromise()
            .then(function (members_raw) ***REMOVED***
                return members_raw;
            ***REMOVED***).then(members => ***REMOVED***
            this.usersModalProjectID = projectid;
            this.usersModalProjectName = projectname;
            this.usersModalProjectMembers = new Array();
            this.groupservice.getGroupAdminIds(projectid.toString()).subscribe(result => ***REMOVED***
                let admindIds = result['adminIds']
                for (let member of members) ***REMOVED***
                    let member_id = member["id"];
                    let user_id = member["userId"];
                    let fullName = member["user"]["firstName"] + " " + member["user"]["lastName"];
                    let projectMember = new ProjectMember(user_id, fullName, member_id);
                    if (admindIds.indexOf(user_id) != -1) ***REMOVED***
                        projectMember.IsPi = true;
                    ***REMOVED***
                    else ***REMOVED***
                        projectMember.IsPi = false;
                    ***REMOVED***


                    this.usersModalProjectMembers.push(projectMember);

                ***REMOVED***
            ***REMOVED***)


        ***REMOVED***);
    ***REMOVED***

    isPi(member: ProjectMember): string ***REMOVED***

        if (member.IsPi) ***REMOVED***
            return 'blue'
        ***REMOVED***
        else ***REMOVED***
            return 'black'
        ***REMOVED***

    ***REMOVED***


    public showMembersOfTheProject(projectid: number, projectname: string, facility: [string, number]) ***REMOVED***
        this.getMembesOfTheProject(projectid, projectname);
        if (facility[0] === 'None') ***REMOVED***
            this.UserModalFacility = null;
        ***REMOVED***
        else ***REMOVED***
            this.UserModalFacility = facility;
        ***REMOVED***
    ***REMOVED***


    public resetPasswordModal() ***REMOVED***
        this.passwordModalTitle = "Changing Password";
        this.passwordModalType = 'info';
        this.passwordModalPassword = '';
        this.passwordModalFacility = '';
        this.passwordModalEmail = '';

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

    public showAddUserToProjectModal(projectid: number, projectname: string, facility: [string, number]) ***REMOVED***
        this.addUserModalProjectID = projectid;
        this.addUserModalProjectName = projectname;
        if (facility[0] === 'None') ***REMOVED***
            this.UserModalFacility = null;
        ***REMOVED***
        else ***REMOVED***
            this.UserModalFacility = facility;

        ***REMOVED***
    ***REMOVED***


    public addMember(groupid: number, memberid: number, firstName: string, lastName: string, facility_id: number) ***REMOVED***
        this.groupservice.addMember(groupid, memberid, facility_id).toPromise()
            .then(result => ***REMOVED***

                if (result.status == 200) ***REMOVED***
                    this.updateNotificaitonModal("Success", "Member " + firstName + " " + lastName + " added.", true, "success");

                ***REMOVED*** else ***REMOVED***
                    console.log(result.json())

                    this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
                ***REMOVED***
            ***REMOVED***).catch(error => ***REMOVED***
            if (error.json()['name'] == 'AlreadyMemberException') ***REMOVED***
                this.updateNotificaitonModal("Info", firstName + " " + lastName + " is already a member of the project.", true, "info");
            ***REMOVED***

            else ***REMOVED***
                this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***


    public addAdmin(groupid: number, memberid: number, userid: number, firstName: string, lastName: string, facility_id: number) ***REMOVED***
        this.groupservice.addMember(groupid, memberid, facility_id).toPromise().then(result => ***REMOVED***
            this.groupservice.addAdmin(groupid, userid, facility_id).toPromise()
                .then(result => ***REMOVED***

                    if (result.status == 200) ***REMOVED***
                        this.updateNotificaitonModal("Success", "Admin " + firstName + " " + lastName + " added.", true, "success");

                    ***REMOVED*** else ***REMOVED***
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    ***REMOVED***
                ***REMOVED***).catch(error => ***REMOVED***
                if (error.json()['name'] == 'AlreadyAdminException') ***REMOVED***
                    this.updateNotificaitonModal("Info", firstName + " " + lastName + " is already a admin of the project.", true, "info");
                ***REMOVED***
                else ***REMOVED***
                    this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                ***REMOVED***
            ***REMOVED***)
        ***REMOVED***).catch(error => ***REMOVED***
            this.groupservice.addAdmin(groupid, userid, facility_id).toPromise()
                .then(result => ***REMOVED***

                    if (result.status == 200) ***REMOVED***
                        this.updateNotificaitonModal("Success", "Admin " + firstName + " " + lastName + " added.", true, "success");

                    ***REMOVED*** else ***REMOVED***
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    ***REMOVED***
                ***REMOVED***).catch(error => ***REMOVED***
                if (error.json()['name'] == 'AlreadyAdminException') ***REMOVED***
                    this.updateNotificaitonModal("Info", firstName + " " + lastName + " is already a admin of the project.", true, "info");
                ***REMOVED***
                else ***REMOVED***
                    this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                ***REMOVED***
            ***REMOVED***)


        ***REMOVED***)
    ***REMOVED***


    public promoteAdmin(groupid: number, userid: number, username: string, facility_id: number) ***REMOVED***
        this.groupservice.addAdmin(groupid, userid, facility_id).toPromise()
            .then(result => ***REMOVED***

                if (result.status == 200) ***REMOVED***
                    this.updateNotificaitonModal("Success", username + " promoted to Admin", true, "success");

                ***REMOVED*** else ***REMOVED***
                    this.updateNotificaitonModal("Failed", username + " could not be promoted to Admin!", true, "danger");
                ***REMOVED***
            ***REMOVED***).catch(error => ***REMOVED***
            this.updateNotificaitonModal("Failed", username + " could not be promoted to Admin!", true, "danger");
        ***REMOVED***);
    ***REMOVED***


    public removeAdmin(groupid: number, userid: number, name: string, facility_id: number) ***REMOVED***
        this.groupservice.removeAdmin(groupid, userid, facility_id).toPromise()
            .then(result => ***REMOVED***

                if (result.status == 200) ***REMOVED***
                    this.updateNotificaitonModal("Success", name + " was removed as Admin", true, "success");

                ***REMOVED*** else ***REMOVED***
                    this.updateNotificaitonModal("Failed", name + " could not be removed as Admin!", true, "danger");
                ***REMOVED***
            ***REMOVED***).catch(error => ***REMOVED***
            this.updateNotificaitonModal("Failed", name + " could not be removed as Admin!", true, "danger");
        ***REMOVED***);
    ***REMOVED***

    public removeMember(groupid: number, memberid: number, userid: number, name: string, facility_id: number) ***REMOVED***
        this.groupservice.removeMember(groupid, memberid, userid, facility_id).toPromise()
            .then(result => ***REMOVED***

                if (result.status == 200) ***REMOVED***
                    this.updateNotificaitonModal("Success", "Member " + name + " removed from the group", true, "success");

                ***REMOVED*** else ***REMOVED***
                    this.updateNotificaitonModal("Failed", "Member" + name + " could not be removed !", true, "danger");
                ***REMOVED***
            ***REMOVED***).catch(error => ***REMOVED***
            this.updateNotificaitonModal("Failed", "Member" + name + " could not be removed !", true, "danger");
        ***REMOVED***);
    ***REMOVED***

    public resetFacilityDetailsModal() ***REMOVED***
        this.UserModalFacility = null;
        this.UserModalFacilityDetails = null;
    ***REMOVED***

    public comingSoon() ***REMOVED***
        alert("This function will be implemented soon.")
    ***REMOVED***
***REMOVED***
