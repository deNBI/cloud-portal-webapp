import {Component, Input} from '@angular/core';
import {PerunSettings} from '../perun-connector/connector-settings.service';
import {Project} from './project.model';
import {ProjectMember} from './project_member.model'
import {environment} from '../../environments/environment'
import {ApiSettings} from '../api-connector/api-settings.service';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import * as moment from 'moment';
import {VoService} from '../api-connector/vo.service';
import {ProjectMemberApplication} from './project_member_application';
import {ComputecenterComponent} from './computecenter.component';
import {AbstractBaseClasse} from '../shared_modules/baseClass/abstract-base-class';


@Component({
    templateUrl: 'overview.component.html',
    providers: [VoService, UserService, GroupService, PerunSettings, ApiSettings]
})
export class OverviewComponent extends AbstractBaseClasse {

    debug_module = false;
    @Input() invitation_group_post: string = environment.invitation_group_post;
    @Input() voRegistrationLink: string = environment.voRegistrationLink;
    @Input() invitation_group_pre: string = environment.invitation_group_pre;
    @Input() wiki_group_invitation: string = environment.wiki_group_invitations;
    is_admin = false;
    userprojects: {}[];
    member_id: number;
    admingroups: {};
    filteredMembers = null;
    application_action = '';
    application_member_name = '';
    application_action_done = false;
    application_action_success: boolean;
    application_action_error_message: boolean;
    projects: Project[] = new Array();
    loaded = true;
    details_loaded = false;


    // modal variables for User list
    public usersModal;
    public usersModalProjectMembers: ProjectMember[] = new Array;
    public usersModalProjectID: number;
    public usersModalProjectName: string;
    public selectedProject: Project;

    public isLoaded = false;

    // modal variables for Add User Modal
    public addUserModal;
    public addUserModalProjectID: number;
    public addUserModalProjectName: string;
    public addUserModalRealName: string;
    public addUserModalInvitationLink: string;

    public UserModalFacilityDetails: [string, string][];
    public UserModalFacility: [string, number];


    public passwordModalTitle = 'Changing Password';
    public passwordModalType = 'info';
    public passwordModalPassword = '';
    public passwordModalFacility = '';
    public passwordModalEmail = '';

    constructor(private perunsettings: PerunSettings,
                private groupservice: GroupService,
                private userservice: UserService,
                private voservice: VoService) {
        super();
        this.getUserProjects();

    }

    public updateUserProjects() {
        this.projects = [];


    }

    setAddUserInvitationLink(): void {
        const uri = this.invitation_group_pre + this.addUserModalRealName + this.invitation_group_post + this.addUserModalRealName;
        this.addUserModalInvitationLink = uri

    }


    setUserFacilityPassword(facility: string, details: [string, string][]) {
        this.userservice.setUserFacilityPassword(facility).subscribe(result => {
            result = result;
            for (const key of details) {
                if (key[0] === 'Support') {
                    this.passwordModalEmail = key[1];
                }
            }

            this.passwordModalFacility = facility;
            if (result['Error']) {
                this.passwordModalTitle = 'Set or update password';
                this.passwordModalType = 'warning'
            } else {
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
                const lifetime = res['lifetime'];
                let dateCreated = project.DateCreated;

                let expirationDate = undefined;
                dateCreated = moment(dateCreated, 'DD.MM.YYYY').toDate();
                if (lifetime !== -1) {
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
                    const lifetimeDays = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate()).diff(moment(dateCreated), 'days'));

                    project.LifetimeDays = lifetimeDays;
                    project.DateEnd = expirationDate;
                }
                project.Lifetime = lifetime;
                this.details_loaded = true;

            })
        } else {
            this.details_loaded = true;
        }


    }

    getUserProjects() {

        this.groupservice.getGroupDetails().subscribe(result => {
            this.userprojects = result;
            for (const group of this.userprojects) {
                const dateCreated = moment(group['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
                const dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                const is_pi = group['is_pi'];
                const groupid = group['id'];
                const facility = group['compute_center'];
                const shortname = group['shortname'];

                const realname = group['name'];
                let compute_center = null;

                if (facility) {
                    compute_center = new ComputecenterComponent(facility['compute_center_facility_id'], facility['compute_center_name'],
                        facility['compute_center_login'], facility['compute_center_support_mail']);
                }


                const newProject = new Project(
                    Number(groupid),
                    shortname,
                    group['description'],
                    moment(dateCreated).format('DD.MM.YYYY'),
                    dateDayDifference,
                    is_pi,
                    this.is_admin,
                    compute_center);
                newProject.OpenStackProject = group['openstack_project'];
                newProject.RealName = realname;
                this.projects.push(newProject);
            }
            this.isLoaded = true;
        })

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
                const admindIds = result['adminIds'];
                for (const member of members) {
                    const member_id = member['id'];
                    const user_id = member['userId'];
                    const fullName = member['firstName'] + ' ' + member['lastName'];
                    const projectMember = new ProjectMember(user_id, fullName, member_id);
                    projectMember.ElixirId = member['elixirId'];
                    if (admindIds.indexOf(user_id) !== -1) {
                        projectMember.IsPi = true;
                    } else {
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
            this.selectedProject.ProjectMemberApplications = [];


            const newProjectApplications = [];
            if (applications.length === 0) {
                this.loaded = true;

            }
            for (const application of applications) {
                const dateApplicationCreated = moment(application['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
                const membername = application['displayName'];


                const newMemberApplication = new ProjectMemberApplication(
                    application['id'], membername, dateApplicationCreated.date() + '.' + (dateApplicationCreated.month() + 1)
                    + '.' + dateApplicationCreated.year()
                );
                newProjectApplications.push(newMemberApplication);

                this.selectedProject.ProjectMemberApplications = newProjectApplications;
                this.loaded = true;


            }


        })


    }


    approveMemberApplication(project: number, application: number, membername: string) {
        this.loaded = false;
        this.application_action_done = false;
        this.groupservice.approveGroupApplication(project, application).subscribe(result => {
            const tmp_application = result;
            this.selectedProject.ProjectMemberApplications = [];

            if (tmp_application['state'] === 'APPROVED') {
                this.application_action_success = true;
            } else if (tmp_application['message']) {
                this.application_action_success = false;

                this.application_action_error_message = tmp_application['message'];


            } else {
                this.application_action_success = false;
            }

            this.application_action = 'approved';
            this.application_member_name = membername;
            this.application_action_done = true;
            this.loadProjectApplications(project);


        });
    }

    rejectMemberApplication(project: number, application: number, membername: string) {
        this.loaded = false;
        this.application_action_done = false;

        this.groupservice.rejectGroupApplication(project, application).subscribe(result => {
                const tmp_application = result;
                this.selectedProject.ProjectMemberApplications = [];


                if (tmp_application['state'] === 'REJECTED') {
                    this.application_action_success = true;


                } else if (tmp_application['message']) {
                    this.application_action_success = false;

                    this.application_action_error_message = tmp_application['message'];
                } else {
                    this.application_action_success = false;
                }
                this.application_action = 'rejected';
                this.application_member_name = membername;
                this.application_action_done = true;
                this.loadProjectApplications(project);


            }
        );
    }

    isPi(member: ProjectMember): string {

        if (member.IsPi) {
            return 'blue'
        } else {
            return 'black'
        }

    }


    public showMembersOfTheProject(projectid: number, projectname: string, facility?: [string, number]) {
        this.getMembesOfTheProject(projectid, projectname);

        if (facility) {
            this.UserModalFacility = facility;

        } else {
            this.UserModalFacility = null;

        }


    }


    public resetPasswordModal() {
        this.passwordModalTitle = 'Changing Password';
        this.passwordModalType = 'info';
        this.passwordModalPassword = '';
        this.passwordModalFacility = '';
        this.passwordModalEmail = '';

    }


    public showAddUserToProjectModal(projectid: number, projectname: string, realname: string, facility?: [string, number]) {
        this.addUserModalProjectID = projectid;
        this.addUserModalProjectName = projectname;
        this.addUserModalRealName = realname;
        this.UserModalFacility = facility;

        if (facility) {
            this.UserModalFacility = facility;

        } else {
            this.UserModalFacility = null;

        }
    }


    public addMember(groupid: number, memberid: number, firstName: string, lastName: string) {
        let facility_id = null
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(
            result => {
                if (result.status === 200) {
                    this.updateNotificationModal('Success', 'Member ' + firstName + ' ' + lastName + ' added.', true, 'success');

                } else {


                    this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
                }
            },
            error => {

                if (error['name'] === 'AlreadyMemberException') {
                    this.updateNotificationModal('Info', firstName + ' ' + lastName + ' is already a member of the project.', true, 'info');
                } else {
                    this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
                }
            });

    }


    public addAdmin(groupid: number, memberid: number, userid: number, firstName: string, lastName: string) {
        let facility_id = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(res => {
            this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                result => {

                    if (result.status === 200) {
                        this.updateNotificationModal('Success', 'Admin ' + firstName + ' ' + lastName + ' added.', true, 'success');

                    } else {
                        this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                    }
                }, error => {
                    if (error['name'] === 'AlreadyAdminException') {
                        this.updateNotificationModal('Info', firstName + ' ' + lastName + ' is already a admin of the project.',
                            true, 'info');
                    } else {
                        this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                    }
                })
        }, err => {
            this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                result => {

                    if (result.status === 200) {
                        this.updateNotificationModal('Success', 'Admin ' + firstName + ' ' + lastName + ' added.', true, 'success');

                    } else {
                        this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                    }
                }, error => {
                    if (error['name'] === 'AlreadyAdminException') {
                        this.updateNotificationModal('Info', firstName + ' ' + lastName + ' is already a admin of the project.',
                            true, 'info');
                    } else {
                        this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                    }
                })
        })
    }


    public promoteAdmin(groupid: number, userid: number, username: string) {
        let facility_id = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.addAdmin(groupid, userid, facility_id).toPromise()
            .then(result => {

                if (result.status === 200) {
                    this.updateNotificationModal('Success', username + ' promoted to Admin', true, 'success');

                } else {
                    this.updateNotificationModal('Failed', username + ' could not be promoted to Admin!', true, 'danger');
                }
            }).catch(error => {
            this.updateNotificationModal('Failed', username + ' could not be promoted to Admin!', true, 'danger');
        });
    }


    public removeAdmin(groupid: number, userid: number, name: string) {
        let facility_id = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.removeAdmin(groupid, userid, facility_id).toPromise()
            .then(result => {

                if (result.status === 200) {
                    this.updateNotificationModal('Success', name + ' was removed as Admin', true, 'success');

                } else {
                    this.updateNotificationModal('Failed', name + ' could not be removed as Admin!', true, 'danger');
                }
            }).catch(error => {
            this.updateNotificationModal('Failed', name + ' could not be removed as Admin!', true, 'danger');
        });
    }

    public removeMember(groupid: number, memberid: number, name: string) {
        let facility_id = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.removeMember(groupid, memberid, facility_id).subscribe(result => {

                if (result.status === 200) {
                    this.updateNotificationModal('Success', 'Member ' + name + ' removed from the group', true, 'success');

                } else {
                    this.updateNotificationModal('Failed', 'Member' + name + ' could not be removed !', true, 'danger');
                }
            },
            error => {
                this.updateNotificationModal('Failed', 'Member' + name + ' could not be removed !', true, 'danger');
            });
    }

    public resetFacilityDetailsModal() {
        this.UserModalFacility = null;
        this.UserModalFacilityDetails = null;
    }

    public comingSoon() {
        alert('This function will be implemented soon.')
    }
}
