import {Component, Input, ViewChild} from '@angular/core';
import {GroupsManager} from '../perun-connector/groups-manager.service'
import {MembersManager} from '../perun-connector/members-manager.service'
import {Http} from '@angular/http';
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Project} from './project.model';
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {ProjectMember} from './project_member.model'
import 'rxjs/add/operator/toPromise';
import {isNumber} from "util";
import {environment} from '../../environments/environment'
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";
import {UserService} from "../api-connector/user.service";
import  * as moment from 'moment';
import {VoService} from "../api-connector/vo.service";


@Component({
    templateUrl: 'overview.component.html',
    providers: [VoService,UserService, GroupService, GroupsManager, MembersManager, PerunSettings, ApiSettings]
})
export class OverviewComponent {

    debug_module = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;

    userprojects: {};
    userid: number;
    member_id: number;
    user_data: {};
    admingroups: {};
    adminvos: {};
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
                private groupsmanager: GroupsManager,
                private membersmanager: MembersManager,
                private groupservice: GroupService,
                private userservice: UserService,
                private voservice:VoService) {
        this.getUserProjects(groupsmanager, userservice);

    }

    public updateUserProjects() {
        this.projects = [];


    }


    setUserFacilityPassword(facility: string, details: [string, string][]) {
        this.userservice.setUserFacilityPassword(facility).subscribe(result => {
            result = result.json()
            for (let key of details) {
                if (key[0] == 'Support') {
                    this.passwordModalEmail = key[1];
                }
            }

            this.passwordModalFacility = facility;
            if (result['Error']) {
                this.passwordModalTitle = 'Set or update password'
                this.passwordModalType = 'warning'
            }
            else {
                this.passwordModalTitle = 'Success'
                this.passwordModalType = 'success'
                this.passwordModalPassword = result.toString()
            }
        })
    }

    getUserProjects(groupsmanager: GroupsManager,
                    userservice: UserService) {
        let user_id: number;
        let member_id: number;
        let user_projects: {};
        let user_data: {};
        let admin_groups: {};
        let admin_vos: {};

        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) {
                //TODO catch errors
                let userid = userdata.json()["id"];
                user_id = userid;
                user_data = userdata.json();
                return userservice.getMemberByUser(userid).toPromise();
            })
            .then(function (memberdata) {
                let memberid = memberdata.json()["id"];
                member_id = memberid;
                return groupsmanager.getMemberGroups(memberid).toPromise();
            }).then(function (groupsdata) {
            user_projects = groupsdata.json();
        }).then(function () {
            return userservice.getGroupsWhereUserIsAdmin(user_id).toPromise();
        }).then(function (admingroups) {
            admin_groups = admingroups.json();
        }).then(function () {

            return userservice.getVosWhereUserIsAdmin(user_id).toPromise();
        }).then(function (adminvos) {
            admin_vos = adminvos.json();
        }).then(result => {

            //hold data in the class just in case
            this.userprojects = user_projects;
            this.userid = user_id;
            this.user_data = user_data;
            this.member_id = member_id;
            this.admingroups = admin_groups;
            this.adminvos = admin_vos;

            let is_admin = false;
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in this.adminvos) {
                if (this.adminvos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
                    is_admin = true;
                    break;
                }
            }


            for (let key in this.userprojects) {
                let group = this.userprojects[key];
                let dateCreated = new Date(group["createdAt"]);
                let dateDayDifference = Math.ceil((Math.abs(Date.now() - dateCreated.getTime())) / (1000 * 3600 * 24));
                let is_pi = false;

                //check if user is a PI (group manager)
                if (!is_admin) {
                    for (let gkey in this.admingroups) {
                        if (group["id"] == this.admingroups[gkey]["id"]) {
                            is_pi = true;
                            break;
                        }
                    }
                } else {
                    is_pi = true;
                }

                this.groupservice.getShortame(group['id']).subscribe(name => {
                    this.groupservice.getFacilityByGroup(group["id"]).subscribe(result => {
                        let shortname= name['shortname']
                        if(!shortname){
                            shortname=group['name']
                        }

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
                        for (let detail in details) {
                            let detail_tuple = [detail, details[detail]];
                            details_array.push(detail_tuple);
                        }
                        newProject.ComputecenterDetails = details_array;
                        if (is_pi) {
                            this.groupservice.getLifetime(group['id']).subscribe(result => {
                                let lifetime = result['lifetime']

                                newProject.Lifetime = lifetime;
                                if (newProject.Lifetime != -1) {
                                    newProject.LifetimeDays = Math.ceil(Math.abs(moment(dateCreated).add(newProject.Lifetime, 'months').toDate().getTime() - dateCreated.getTime())) / (1000 * 3600 * 24)

                                }
                                else {
                                    newProject.LifetimeDays = -1;
                                }
                                this.projects.push(newProject);
                            })
                        }
                        else {
                            this.projects.push(newProject);
                        }
                    })
                })


            }

        });
        // .then( function(){ groupsmanager.getGroupsWhereUserIsAdmin(this.userid); });
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


    public resetAddUserModal() {
        this.addUserModalProjectID = null;
        this.addUserModalProjectName = null;
        this.UserModalFacility = null;
    }

    filterMembers(firstName: string, lastName: string, groupid: number) {
        this.voservice.getMembersOfdeNBIVo(firstName, lastName, groupid.toString()).subscribe(result => {
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
                let admindIds = result['adminIds']
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

     isPi(member:ProjectMember):string{

       if (member.IsPi){
           return 'blue'
       }
       else{return 'black'}

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

        }
    }


    public addMember(groupid: number, memberid: number, firstName: string, lastName: string, facility_id: number) {
        this.groupservice.addMember(groupid, memberid, facility_id).toPromise()
            .then(result => {

                if (result.status == 200) {
                    this.updateNotificaitonModal("Success", "Member " + firstName + " " + lastName + " added.", true, "success");

                } else {
                    this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
                }
            }).catch(error => {
            this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
        });
    }


    public addAdmin(groupid: number, userid: number, firstName: string, lastName: string, facility_id: number) {
        this.groupservice.addAdmin(groupid, userid, facility_id).toPromise()
            .then(result => {

                if (result.status == 200) {
                    this.updateNotificaitonModal("Success", "Admin " + firstName + " " + lastName + " added.", true, "success");

                } else {
                    this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
                }
            }).catch(error => {
            this.updateNotificaitonModal("Failed", "Admin could not be added!", true, "danger");
        });
    }


    public promoteAdmin(groupid: number, userid: number, username: string, facility_id: number) {
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




       public removeAdmin(groupid: number,userid:number, name: string, facility_id: number) {
        this.groupservice.removeAdmin(groupid, userid, facility_id).toPromise()
            .then(result => {

                if (result.status == 200) {
                    this.updateNotificaitonModal("Success",   name + " was removed as Admin", true, "success");

                } else {
                    this.updateNotificaitonModal("Failed",   name + " could not be removed as Admin!", true, "danger");
                }
            }).catch(error => {
            this.updateNotificaitonModal("Failed", name + " could not be removed as Admin!", true, "danger");
        });
    }

    public removeMember(groupid: number, memberid: number,userid:number, name: string, facility_id: number) {
        this.groupservice.removeMember(groupid, memberid,userid, facility_id).toPromise()
            .then(result => {

                if (result.status == 200) {
                    this.updateNotificaitonModal("Success", "Member " + name + " removed from the group", true, "success");

                } else {
                    this.updateNotificaitonModal("Failed", "Member" + name + " could not be removed !", true, "danger");
                }
            }).catch(error => {
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
