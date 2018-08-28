import {Component, Input, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Project} from './project.model';
import {ModalDirective} from "ngx-bootstrap";
import {ProjectMember} from './project_member.model'
import {environment} from '../../environments/environment'
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";
import {UserService} from "../api-connector/user.service";
import * as moment from 'moment';
import {VoService} from "../api-connector/vo.service";
import {catchError} from 'rxjs/operators';
import {ProjectMemberApplication} from "./project_member_application";


@Component({
    templateUrl: 'overview.component.html',
    providers: [VoService, UserService, GroupService, PerunSettings, ApiSettings]
})
export class OverviewComponent {

    debug_module = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;
    @Input() invitation_group_pre: string = environment.invitation_group_pre
    is_admin = false;
    userprojects: {};
    member_id: number;
    admingroups: {};
    filteredMembers = null;
    application_action = '';
    application_member_name = '';
    application_action_success: boolean;
    projects: Project[] = new Array();
    loaded = false;


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
                private voservice: VoService) {
        this.getUserProjects();

    }

    public updateUserProjects() {
        this.projects = [];


    }


    setUserFacilityPassword(facility: string, details: [string, string][]) {
        this.userservice.setUserFacilityPassword(facility).subscribe(result => {
            result = result;
            for (let key of details) {
                if (key[0] == 'Support') {
                    this.passwordModalEmail = key[1];
                }
            }

            this.passwordModalFacility = facility;
            if (result['Error']) {
                this.passwordModalTitle = 'Set or update password';
                this.passwordModalType = 'warning'
            }
            else {
                this.passwordModalTitle = 'Success';
                this.passwordModalType = 'success';
                this.passwordModalPassword = result.toString()
            }
        })
    }

    getUserProjects() {

        this.groupservice.getGroupDetails().subscribe(result => {
            this.userprojects = result;
            for (let key in this.userprojects) {
                let group = this.userprojects[key];
                let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                let is_pi = group['is_pi'];
                let groupid = key;
                let facility = group['facility'];
                let shortname = group['shortname'];
                let details = facility['Details'];
                let details_array = [];
                let lifetime = group['lifetime'];
                let lifetimeDays = -1;
                let expirationDate = undefined;
                if (lifetime != -1) {
                    lifetimeDays = Math.ceil(Math.ceil(Math.abs(moment(dateCreated).add(lifetime, 'months').toDate().getTime() - moment(dateCreated).valueOf())) / (1000 * 3600 * 24));
                    expirationDate = moment(dateCreated).add(lifetime, 'months').toDate();
                }
                for (let detail in details) {
                    let detail_tuple = [detail, details[detail]];
                    details_array.push(detail_tuple);
                }
                //check if user is a PI (group manager)

                if (!shortname) {
                    shortname = group['name']
                }

                let newProject = new Project(
                    Number(groupid),
                    shortname,
                    group["description"],
                    dateCreated.date() + "." + (dateCreated.month() + 1) + "." + dateCreated.year(),
                    dateDayDifference,
                    is_pi,
                    this.is_admin,
                    [facility['Facility'], facility['FacilityId']]);
                newProject.ComputecenterDetails = details_array;
                newProject.Lifetime = lifetime;
                newProject.LifetimeDays = lifetimeDays;
                if (expirationDate) {
                    newProject.DateEnd = moment(expirationDate).date() + "." + (moment(expirationDate).month() + 1) + "." + moment(expirationDate).year();
                }
                let newProjectApplications = [];
                for (let application of group['applications']) {
                    let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS")
                    let membername = application['user']['firstName'] + ' ' + application['user']['lastName']
                    let newMemberApplication = new ProjectMemberApplication(
                        application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(),
                    )
                    newProjectApplications.push(newMemberApplication)
                }
                newProject.ProjectMemberApplications = newProjectApplications;
                this.projects.push(newProject);
            }
            this.isLoaded = true;

        })

    }


    lifeTimeReached(lifetime: number, running: number): string {
        if (!lifetime) {
            return "red";
        }
        else if (lifetime == -1) {
            return "blue";
        }
        return (lifetime - running) < 0 ? "red" : "black";
    }


    resetAddUserModal() {
        this.addUserModalProjectID = null;
        this.addUserModalProjectName = null;
        this.UserModalFacility = null;
    }

    filterMembers(firstName: string, lastName: string, groupid: number) {
        this.userservice.getFilteredMembersOfdeNBIVo(firstName, lastName, groupid.toString()).subscribe(result => {
            this.filteredMembers = result;
        })
    }


    getMembesOfTheProject(projectid: number, projectname: string) {
        this.groupservice.getGroupRichMembers(projectid).toPromise()
            .then(function (members_raw) {
                return members_raw;
            }).then(members => {
            this.usersModalProjectID = projectid;
            this.usersModalProjectName = projectname;
            this.usersModalProjectMembers = new Array();
            this.groupservice.getGroupAdminIds(projectid.toString()).subscribe(result => {
                let admindIds = result['adminIds'];
                for (let member of members) {
                    let member_id = member["id"];
                    let user_id = member["userId"];
                    let fullName = member["user"]["firstName"] + " " + member["user"]["lastName"];
                    let projectMember = new ProjectMember(user_id, fullName, member_id);
                    if (admindIds.indexOf(user_id) != -1) {
                        projectMember.IsPi = true;
                    }
                    else {
                        projectMember.IsPi = false;
                    }


                    this.usersModalProjectMembers.push(projectMember);

                }
            })


        });
    }

    approveMemberApplication(project: number, application: number, membername: string) {
        this.loaded = false;
        this.groupservice.approveGroupApplication(project, application).subscribe(result => {
            let application=result;
            this.groupservice.getGroupApplications(project).subscribe(result => {
                let newProjectApplications = [];
                for (let application of result) {
                    let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS")
                    let membername = application['user']['firstName'] + ' ' + application['user']['lastName']
                    let newMemberApplication = new ProjectMemberApplication(
                        application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(),
                    )
                    newProjectApplications.push(newMemberApplication)
                }
                this.selectedProject.ProjectMemberApplications = newProjectApplications;
                if (application['state'] == 'APPROVED') {
                    this.application_action_success = true;
                }
                else {
                    this.application_action_success = false;
                }
                this.application_action = 'approved';
                this.application_member_name = membername;
                this.loaded = true;

            })
        });
    }

    rejectMemberApplication(project: number, application: number, membername: string) {
        this.loaded = false;

        this.groupservice.rejectGroupApplication(project, application).subscribe(result => {
                        let application=result;

            this.groupservice.getGroupApplications(project).subscribe(result => {
                let newProjectApplications = [];
                for (let application of result) {
                    let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS")
                    let membername = application['user']['firstName'] + ' ' + application['user']['lastName']
                    let newMemberApplication = new ProjectMemberApplication(
                        application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(),
                    )
                    newProjectApplications.push(newMemberApplication)
                }
                this.selectedProject.ProjectMemberApplications = newProjectApplications;
                if (application['state'] == 'REJECTED') {
                    this.application_action_success = true;
                }
                else {
                    this.application_action_success = false;
                }
                this.application_action = 'rejected';
                this.application_member_name = membername;
                        this.loaded=true;


            })
        });
    }

    isPi(member: ProjectMember): string {

        if (member.IsPi) {
            return 'blue'
        }
        else {
            return 'black'
        }

    }


    public showMembersOfTheProject(projectid: number, projectname: string, facility: [string, number]) {
        this.getMembesOfTheProject(projectid, projectname);
        if (facility[0] === 'None') {
            this.UserModalFacility = null;
        }
        else {
            this.UserModalFacility = facility;
        }
    }


    public resetPasswordModal() {
        this.passwordModalTitle = "Changing Password";
        this.passwordModalType = 'info';
        this.passwordModalPassword = '';
        this.passwordModalFacility = '';
        this.passwordModalEmail = '';

    }

    public resetNotificaitonModal() {
        this.notificationModalTitle = "Notification";
        this.notificationModalMessage = "Please wait...";
        this.notificationModalIsClosable = false;
        this.notificationModalType = "info";
    }

    public updateNotificaitonModal(title: string, message: string, closable: true, type: string) {
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    }

    public makeNotificationModalClosable(closable: boolean) {
        this.notificationModalIsClosable = closable;
    }

    public changeNotificationModalTitle(title: string) {
        this.notificationModalTitle = title;
    }

    public changeNotificationModalMessage(message: string) {
        this.notificationModalMessage = message;
    }

    public changeNotificationModalType(type: string) {
        this.notificationModalType = type;
    }

    public showAddUserToProjectModal(projectid: number, projectname: string, facility: [string, number]) {
        this.addUserModalProjectID = projectid;
        this.addUserModalProjectName = projectname;
        if (facility[0] === 'None') {
            this.UserModalFacility = null;
        }
        else {
            this.UserModalFacility = facility;
            console.log(facility)

        }
    }


    public addMember(groupid: number, memberid: number, firstName: string, lastName: string, facility_id?: number) {
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(
            result => {
                if (result.status == 200) {
                    this.updateNotificaitonModal("Success", "Member " + firstName + " " + lastName + " added.", true, "success");

                } else {


                    this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
                }
            },
            error => {

                if (error['name'] == 'AlreadyMemberException') {
                    this.updateNotificaitonModal("Info", firstName + " " + lastName + " is already a member of the project.", true, "info");
                }

                else {
                    this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
                }
            });

    }


    public addAdmin(groupid: number, memberid: number, userid: number, firstName: string, lastName: string, facility_id?: number) {
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(result => {
            this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                result => {

                    if (result.status == 200) {
                        this.updateNotificaitonModal("Success", "Admin " + firstName + " " + lastName + " added.", true, "success");

                    } else {
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    }
                }, error => {
                    if (error['name'] == 'AlreadyAdminException') {
                        this.updateNotificaitonModal("Info", firstName + " " + lastName + " is already a admin of the project.", true, "info");
                    }
                    else {
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    }
                })
        }, error => {
            this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                result => {

                    if (result.status == 200) {
                        this.updateNotificaitonModal("Success", "Admin " + firstName + " " + lastName + " added.", true, "success");

                    } else {
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    }
                }, error => {
                    if (error['name'] == 'AlreadyAdminException') {
                        this.updateNotificaitonModal("Info", firstName + " " + lastName + " is already a admin of the project.", true, "info");
                    }
                    else {
                        this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                    }
                })
        })
    }


    public promoteAdmin(groupid: number, userid: number, username: string, facility_id?: number) {
        this.groupservice.addAdmin(groupid, userid, facility_id).toPromise()
            .then(result => {

                if (result.status == 200) {
                    this.updateNotificaitonModal("Success", username + " promoted to Admin", true, "success");

                } else {
                    this.updateNotificaitonModal("Failed", username + " could not be promoted to Admin!", true, "danger");
                }
            }).catch(error => {
            this.updateNotificaitonModal("Failed", username + " could not be promoted to Admin!", true, "danger");
        });
    }


    public removeAdmin(groupid: number, userid: number, name: string, facility_id?: number) {
        this.groupservice.removeAdmin(groupid, userid, facility_id).toPromise()
            .then(result => {

                if (result.status == 200) {
                    this.updateNotificaitonModal("Success", name + " was removed as Admin", true, "success");

                } else {
                    this.updateNotificaitonModal("Failed", name + " could not be removed as Admin!", true, "danger");
                }
            }).catch(error => {
            this.updateNotificaitonModal("Failed", name + " could not be removed as Admin!", true, "danger");
        });
    }

    public removeMember(groupid: number, memberid: number, userid: number, name: string, facility_id?: number) {
        this.groupservice.removeMember(groupid, memberid, userid, facility_id).subscribe(result => {

                if (result.status == 200) {
                    this.updateNotificaitonModal("Success", "Member " + name + " removed from the group", true, "success");

                } else {
                    this.updateNotificaitonModal("Failed", "Member" + name + " could not be removed !", true, "danger");
                }
            },
            error => {
                this.updateNotificaitonModal("Failed", "Member" + name + " could not be removed !", true, "danger");
            });
    }

    public resetFacilityDetailsModal() {
        this.UserModalFacility = null;
        this.UserModalFacilityDetails = null;
    }

    public comingSoon() {
        alert("This function will be implemented soon.")
    }
}
