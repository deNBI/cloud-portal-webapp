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
import {ComputecenterComponent} from "./computecenter.component";


@Component({
    templateUrl: 'overview.component.html',
    providers: [VoService, UserService, GroupService, PerunSettings, ApiSettings]
})
export class OverviewComponent {

    debug_module = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;
    @Input() invitation_group_pre: string = environment.invitation_group_pre
    is_admin = false;
    userprojects: {}[];
    member_id: number;
    admingroups: {};
    filteredMembers = null;
    application_action = '';
    application_member_name = '';
    application_action_done = false;
    application_action_success: boolean;
    projects: Project[] = new Array();
    loaded = true;
    details_loaded = false;


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

    getProjectLifetime(project) {
        this.details_loaded = false;
        if (!project.Lifetime) {
            this.groupservice.getLifetime(project.Id).subscribe(res => {
                let lifetime = res['lifetime'];
                console.log(lifetime)
                let dateCreated = project.DateCreated;
                console.log(dateCreated)

                let expirationDate = undefined;
                dateCreated = moment(dateCreated, "DD.MM.YYYY").toDate();
                if (lifetime != -1) {
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format("DD.MM.YYYY");
                    let lifetimeDays = Math.abs(moment(moment(expirationDate, "DD.MM.YYYY").toDate()).diff(moment(dateCreated), 'days'));

                    project.LifetimeDays = lifetimeDays;
                    project.DateEnd = expirationDate;
                }
                project.Lifetime = lifetime;
                this.details_loaded = true;

            })
        }
        else {
            this.details_loaded = true;
        }


    }

    getUserProjects() {

        this.groupservice.getGroupDetails().subscribe(result => {
            this.userprojects = result;
            for (let group of this.userprojects) {
                let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                let is_pi = group['is_pi'];
                let groupid = group['id'];
                let facility = group['compute_center'];
                let shortname = group['shortname'];

                let realname = group['name'];
                let compute_center = null;

                if (facility) {
                    compute_center = new ComputecenterComponent(facility['compute_center_facility_id'], facility['compute_center_name'], facility['compute_center_login'], facility['compute_center_support_mail']);
                }


                let newProject = new Project(
                    Number(groupid),
                    shortname,
                    group["description"],
                    moment(dateCreated).format("DD.MM.YYYY"),
                    dateDayDifference,
                    is_pi,
                    this.is_admin,
                    compute_center);
                newProject.OpenStackProject = group['openstack_project'];
                newProject.RealName=realname;
                this.projects.push(newProject);
            }
            this.isLoaded = true;
            for (let group of this.projects) {
                if (group.Name.length > 15 || group.Name.indexOf('_') > -1) {
                    this.groupservice.getShortame(group.Id.toString()).subscribe(result => {
                        if (result['shortname']) {
                            group.Name = result['shortname']
                        }

                    })
                }

            }

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

    filterMembers(searchString: string, groupid: number) {
        this.userservice.getFilteredMembersOfdeNBIVo(searchString, groupid.toString()).subscribe(result => {
            this.filteredMembers = result;
        })
    }


    getMembesOfTheProject(projectid: number, projectname: string) {
        this.groupservice.getGroupMembers(projectid.toString()).subscribe(members => {

            this.usersModalProjectID = projectid;
            this.usersModalProjectName = projectname;
            this.usersModalProjectMembers = new Array();
            this.groupservice.getGroupAdminIds(projectid.toString()).subscribe(result => {
                let admindIds = result['adminIds'];
                for (let member of members) {
                    let member_id = member["id"];
                    let user_id = member["userId"];
                    let fullName = member["firstName"] + " " + member["lastName"];
                    let projectMember = new ProjectMember(user_id, fullName, member_id);
                    projectMember.ElixirId = member['elixirId'];
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

    loadProjectApplications(project: number) {
        this.loaded = false;

        this.groupservice.getGroupApplications(project).subscribe(applications => {

            let newProjectApplications = [];
            if (applications.length == 0) {
                this.loaded = true;

            }
            for (let application of applications) {
                let dateApplicationCreated = moment(application['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let membername = application['user']['firstName'] + ' ' + application['user']['lastName'];
                let userid = application['user']['id'];
                this.userservice.isMember(userid).subscribe(isMember => {

                        let isMemberBool = isMember['isMember'];
                        let newMemberApplication = new ProjectMemberApplication(
                            application['id'], membername, dateApplicationCreated.date() + "." + (dateApplicationCreated.month() + 1) + "." + dateApplicationCreated.year(), userid, isMemberBool
                        )
                        newProjectApplications.push(newMemberApplication)

                        this.selectedProject.ProjectMemberApplications = newProjectApplications;
                        this.loaded = true;

                    }
                )
            }


        })


    }


    approveMemberApplication(project: number, application: number, membername: string) {
        this.loaded = false;
        this.application_action_done = false;
        this.groupservice.approveGroupApplication(project, application).subscribe(result => {
            let application = result;
            this.selectedProject.ProjectMemberApplications = [];

            if (application['state'] == 'APPROVED') {
                this.application_action_success = true;
            }
            else {
                this.application_action_success = false;
            }
            this.application_action = 'approved';
            this.application_member_name = membername;
            this.application_action_done = true
            this.loadProjectApplications(project);


        });
    }

    rejectMemberApplication(project: number, application: number, membername: string) {
        this.loaded = false;
        this.application_action_done = false;

        this.groupservice.rejectGroupApplication(project, application).subscribe(result => {
            let application = result;
            this.selectedProject.ProjectMemberApplications = [];


            if (application['state'] == 'REJECTED') {
                this.application_action_success = true;

            }
            else {
                this.application_action_success = false;
            }
            this.application_action = 'rejected';
            this.application_member_name = membername;
            this.application_action_done = true;
            this.loadProjectApplications(project);


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


    public showMembersOfTheProject(projectid: number, projectname: string, facility?: [string, number]) {
        this.getMembesOfTheProject(projectid, projectname);

        if (facility) {
            this.UserModalFacility = facility;

        }
        else {
            this.UserModalFacility = null;

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

    public showAddUserToProjectModal(projectid: number, projectname: string, realname: string, facility?: [string, number]) {
        this.addUserModalProjectID = projectid;
        this.addUserModalProjectName = projectname;
        this.addUserModalRealName = realname;
        this.UserModalFacility = facility;

        if (facility) {
            this.UserModalFacility = facility;

        }
        else {
            this.UserModalFacility = null;

        }
    }


    public addMember(groupid: number, memberid: number, firstName: string, lastName: string) {
         let facility_id=null
        if (this.UserModalFacility && this.UserModalFacility[1]){
             facility_id=this.UserModalFacility[1]
        }
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


    public addAdmin(groupid: number, memberid: number, userid: number, firstName: string, lastName: string) {
        let facility_id = null;
        if (this.UserModalFacility && this.UserModalFacility[1]){
            facility_id = this.UserModalFacility[1]
        }
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


    public promoteAdmin(groupid: number, userid: number, username: string) {
        let facility_id = null;
        if (this.UserModalFacility && this.UserModalFacility[1]){
            facility_id = this.UserModalFacility[1]
        }
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


    public removeAdmin(groupid: number, userid: number, name: string) {
        let facility_id = null;
        if (this.UserModalFacility && this.UserModalFacility[1]){
            facility_id = this.UserModalFacility[1]
        }
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

    public removeMember(groupid: number, memberid: number, name: string) {
        let facility_id = null
        if (this.UserModalFacility && this.UserModalFacility[1]){
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.removeMember(groupid, memberid, facility_id).subscribe(result => {

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
