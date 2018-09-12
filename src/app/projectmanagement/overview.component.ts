import ***REMOVED***Component, Input, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***Http***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***Project***REMOVED*** from './project.model';
import ***REMOVED***ModalDirective***REMOVED*** from "ngx-bootstrap";
import ***REMOVED***ProjectMember***REMOVED*** from './project_member.model'
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import * as moment from 'moment';
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";
import ***REMOVED***catchError***REMOVED*** from 'rxjs/operators';
import ***REMOVED***ProjectMemberApplication***REMOVED*** from "./project_member_application";
import ***REMOVED***ComputecenterComponent***REMOVED*** from "./computecenter.component";


@Component(***REMOVED***
    templateUrl: 'overview.component.html',
    providers: [VoService, UserService, GroupService, PerunSettings, ApiSettings]
***REMOVED***)
export class OverviewComponent ***REMOVED***

    debug_module = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;
    @Input() invitation_group_pre: string = environment.invitation_group_pre
    is_admin = false;
    userprojects: ***REMOVED******REMOVED***;
    member_id: number;
    admingroups: ***REMOVED******REMOVED***;
    filteredMembers = null;
    application_action = '';
    application_member_name = '';
    application_action_done = false;
    application_action_success: boolean;
    projects: Project[] = new Array();
    loaded = true;


    // modal variables for User list
    public usersModal;
    public usersModalProjectMembers: ProjectMember[] = new Array;
    public usersModalProjectID: number;
    public usersModalProjectName: string;
    public selectedProject: Project;

    public isLoaded: boolean = false;

    //modal variables for Add User Modal
    public addUserModal;
    public addUserModalProjectID: number;
    public addUserModalProjectName: string;
    public addUserModalRealName: string;
    public UserModalFacilityDetails: [string, string][];
    public UserModalFacility: [string, number];


    //notification Modal variables
    public notificationModal;
    public notificationModalTitle: string = "Notification";
    public notificationModalMessage: string = "Please wait...";
    public notificationModalType: string = "info";
    public notificationModalInfoMessage: string = '';
    public notificationModalIsClosable: boolean = false;

    public passwordModalTitle: string = "Changing Password";
    public passwordModalType: string = 'info';
    public passwordModalPassword: string = '';
    public passwordModalFacility: string = '';
    public passwordModalEmail: string = '';

    constructor(private perunsettings: PerunSettings,
                private groupservice: GroupService,
                private userservice: UserService,
                private voservice: VoService) ***REMOVED***
        this.getUserProjects();

    ***REMOVED***

    public updateUserProjects() ***REMOVED***
        this.projects = [];


    ***REMOVED***


    setUserFacilityPassword(facility: string, details: [string, string][]) ***REMOVED***
        this.userservice.setUserFacilityPassword(facility).subscribe(result => ***REMOVED***
            result = result;
            for (let key of details) ***REMOVED***
                if (key[0] == 'Support') ***REMOVED***
                    this.passwordModalEmail = key[1];
                ***REMOVED***
            ***REMOVED***

            this.passwordModalFacility = facility;
            if (result['Error']) ***REMOVED***
                this.passwordModalTitle = 'Set or update password';
                this.passwordModalType = 'warning'
            ***REMOVED***
            else ***REMOVED***
                this.passwordModalTitle = 'Success';
                this.passwordModalType = 'success';
                this.passwordModalPassword = result.toString()
            ***REMOVED***
        ***REMOVED***)
    ***REMOVED***

    getUserProjects() ***REMOVED***

        this.groupservice.getGroupDetails().subscribe(result => ***REMOVED***
            this.userprojects = result;
            for (let key in this.userprojects) ***REMOVED***
                let group = this.userprojects[key];
                let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                let is_pi = group['is_pi'];
                let groupid = key;
                let facility = group['facility'];
                let shortname = group['shortname'];
                let lifetime = group['lifetime'];
                let lifetimeDays = -1;
                let realname = group['name'];

                let expirationDate = undefined;
                if (lifetime != -1) ***REMOVED***
                    lifetimeDays = Math.ceil(Math.ceil(Math.abs(moment(dateCreated).add(lifetime, 'months').toDate().getTime() - moment(dateCreated).valueOf())) / (1000 * 3600 * 24));
                    expirationDate = moment(dateCreated).add(lifetime, 'months').toDate();
                ***REMOVED***
                //check if user is a PI (group manager)

                if (!shortname) ***REMOVED***
                    shortname = group['name']
                ***REMOVED***

                let compute_center=new ComputecenterComponent(facility['FacilityId'],facility['Facility'],facility['Login'],facility['Support']);


                let newProject = new Project(
                    Number(groupid),
                    shortname,
                    group["description"],
                    dateCreated.date() + "." + (dateCreated.month() + 1) + "." + dateCreated.year(),
                    dateDayDifference,
                    is_pi,
                    this.is_admin,
                    compute_center);
                newProject.OpenStackProject=group['openstack_project'];
                newProject.Lifetime = lifetime;
                newProject.LifetimeDays = lifetimeDays;
                newProject.RealName = realname;
                if (expirationDate) ***REMOVED***
                    newProject.DateEnd = moment(expirationDate).date() + "." + (moment(expirationDate).month() + 1) + "." + moment(expirationDate).year();
                ***REMOVED***

                let newProjectApplications = [];
                if (group['applications']) ***REMOVED***
                    for (let application of group['applications']) ***REMOVED***
                        let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS")
                        let membername = application['user']['firstName'] + ' ' + application['user']['lastName']
                        let newMemberApplication = new ProjectMemberApplication(
                            application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(),
                        );
                        newProjectApplications.push(newMemberApplication)
                    ***REMOVED***
                    newProject.ProjectMemberApplications = newProjectApplications;
                ***REMOVED***

                this.projects.push(newProject);
            ***REMOVED***
            this.isLoaded = true;

        ***REMOVED***)

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


    resetAddUserModal() ***REMOVED***
        this.addUserModalProjectID = null;
        this.addUserModalProjectName = null;
        this.UserModalFacility = null;
    ***REMOVED***

    filterMembers(firstName: string, lastName: string, groupid: number) ***REMOVED***
        this.userservice.getFilteredMembersOfdeNBIVo(firstName, lastName, groupid.toString()).subscribe(result => ***REMOVED***
            this.filteredMembers = result;
        ***REMOVED***)
    ***REMOVED***


    getMembesOfTheProject(projectid: number, projectname: string) ***REMOVED***
        this.groupservice.getGroupMembers(projectid.toString()).subscribe(members => ***REMOVED***

            this.usersModalProjectID = projectid;
            this.usersModalProjectName = projectname;
            this.usersModalProjectMembers = new Array();
            this.groupservice.getGroupAdminIds(projectid.toString()).subscribe(result => ***REMOVED***
                let admindIds = result['adminIds'];
                for (let member of members) ***REMOVED***
                    let member_id = member["id"];
                    let user_id = member["userId"];
                    let fullName = member["firstName"] + " " + member["lastName"];
                    let projectMember = new ProjectMember(user_id, fullName, member_id);
                    projectMember.ElixirId = member['elixirId'];
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

    loadProjectApplications(project: number) ***REMOVED***
        this.groupservice.getGroupApplications(project).subscribe(result => ***REMOVED***
            let newProjectApplications = [];
            for (let application of result) ***REMOVED***
                let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS")
                let membername = application['user']['firstName'] + ' ' + application['user']['lastName']
                let newMemberApplication = new ProjectMemberApplication(
                    application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(),
                )
                newProjectApplications.push(newMemberApplication)
            ***REMOVED***
            this.selectedProject.ProjectMemberApplications = newProjectApplications;
        ***REMOVED***)
    ***REMOVED***

    approveMemberApplication(project: number, application: number, membername: string) ***REMOVED***
        this.loaded = false;
        this.application_action_done = false;
        this.groupservice.approveGroupApplication(project, application).subscribe(result => ***REMOVED***
            let application = result;
            this.groupservice.getGroupApplications(project).subscribe(result => ***REMOVED***
                let newProjectApplications = [];
                for (let application of result) ***REMOVED***
                    let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS")
                    let membername = application['user']['firstName'] + ' ' + application['user']['lastName']
                    let newMemberApplication = new ProjectMemberApplication(
                        application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(),
                    )
                    newProjectApplications.push(newMemberApplication)
                ***REMOVED***
                this.selectedProject.ProjectMemberApplications = newProjectApplications;
                if (application['state'] == 'APPROVED') ***REMOVED***
                    this.application_action_success = true;
                ***REMOVED***
                else ***REMOVED***
                    this.application_action_success = false;
                ***REMOVED***
                this.application_action = 'approved';
                this.application_member_name = membername;
                this.loaded = true;
                this.application_action_done = true

            ***REMOVED***)
        ***REMOVED***);
    ***REMOVED***

    rejectMemberApplication(project: number, application: number, membername: string) ***REMOVED***
        this.loaded = false;
        this.application_action_done = false;

        this.groupservice.rejectGroupApplication(project, application).subscribe(result => ***REMOVED***
            let application = result;

            this.groupservice.getGroupApplications(project).subscribe(result => ***REMOVED***
                let newProjectApplications = [];
                for (let application of result) ***REMOVED***
                    let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                    let membername = application['user']['firstName'] + ' ' + application['user']['lastName'];
                    let newMemberApplication = new ProjectMemberApplication(
                        application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(),
                    )
                    newProjectApplications.push(newMemberApplication)
                ***REMOVED***
                this.selectedProject.ProjectMemberApplications = newProjectApplications;
                if (application['state'] == 'REJECTED') ***REMOVED***
                    this.application_action_success = true;
                ***REMOVED***
                else ***REMOVED***
                    this.application_action_success = false;
                ***REMOVED***
                this.application_action = 'rejected';
                this.application_member_name = membername;
                this.loaded = true;
                this.application_action_done = true;


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

    public showAddUserToProjectModal(projectid: number, projectname: string, realname: string, facility: [string, number]) ***REMOVED***
        this.addUserModalProjectID = projectid;
        this.addUserModalProjectName = projectname;
        this.addUserModalRealName = realname;
        if (facility[0] === 'None') ***REMOVED***
            this.UserModalFacility = null;
        ***REMOVED***
        else ***REMOVED***
            this.UserModalFacility = facility;

        ***REMOVED***
    ***REMOVED***


    public addMember(groupid: number, memberid: number, firstName: string, lastName: string, facility_id?: number) ***REMOVED***
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(
            result => ***REMOVED***
                if (result.status == 200) ***REMOVED***
                    this.updateNotificaitonModal("Success", "Member " + firstName + " " + lastName + " added.", true, "success");

                ***REMOVED*** else ***REMOVED***


                    this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
                ***REMOVED***
            ***REMOVED***,
            error => ***REMOVED***

                if (error['name'] == 'AlreadyMemberException') ***REMOVED***
                    this.updateNotificaitonModal("Info", firstName + " " + lastName + " is already a member of the project.", true, "info");
                ***REMOVED***

                else ***REMOVED***
                    this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
                ***REMOVED***
            ***REMOVED***);

    ***REMOVED***


    public addAdmin(groupid: number, memberid: number, userid: number, firstName: string, lastName: string, facility_id?: number) ***REMOVED***
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(result => ***REMOVED***
            this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                result => ***REMOVED***

                    if (result.status == 200) ***REMOVED***
                        this.updateNotificaitonModal("Success", "Admin " + firstName + " " + lastName + " added.", true, "success");

                    ***REMOVED*** else ***REMOVED***
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    ***REMOVED***
                ***REMOVED***, error => ***REMOVED***
                    if (error['name'] == 'AlreadyAdminException') ***REMOVED***
                        this.updateNotificaitonModal("Info", firstName + " " + lastName + " is already a admin of the project.", true, "info");
                    ***REMOVED***
                    else ***REMOVED***
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    ***REMOVED***
                ***REMOVED***)
        ***REMOVED***, error => ***REMOVED***
            this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                result => ***REMOVED***

                    if (result.status == 200) ***REMOVED***
                        this.updateNotificaitonModal("Success", "Admin " + firstName + " " + lastName + " added.", true, "success");

                    ***REMOVED*** else ***REMOVED***
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    ***REMOVED***
                ***REMOVED***, error => ***REMOVED***
                    if (error['name'] == 'AlreadyAdminException') ***REMOVED***
                        this.updateNotificaitonModal("Info", firstName + " " + lastName + " is already a admin of the project.", true, "info");
                    ***REMOVED***
                    else ***REMOVED***
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    ***REMOVED***
                ***REMOVED***)
        ***REMOVED***)
    ***REMOVED***


    public promoteAdmin(groupid: number, userid: number, username: string, facility_id?: number) ***REMOVED***
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


    public removeAdmin(groupid: number, userid: number, name: string, facility_id?: number) ***REMOVED***
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

    public removeMember(groupid: number, memberid: number, userid: number, name: string, facility_id?: number) ***REMOVED***
        this.groupservice.removeMember(groupid, memberid, userid, facility_id).subscribe(result => ***REMOVED***

                if (result.status == 200) ***REMOVED***
                    this.updateNotificaitonModal("Success", "Member " + name + " removed from the group", true, "success");

                ***REMOVED*** else ***REMOVED***
                    this.updateNotificaitonModal("Failed", "Member" + name + " could not be removed !", true, "danger");
                ***REMOVED***
            ***REMOVED***,
            error => ***REMOVED***
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
