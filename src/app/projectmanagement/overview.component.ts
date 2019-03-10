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


/**
 * Projectoverview component.
 */
@Component({
    templateUrl: 'overview.component.html',
    providers: [VoService, UserService, GroupService, PerunSettings, ApiSettings]
})
export class OverviewComponent extends AbstractBaseClasse {

    debug_module: boolean = false;
    @Input() invitation_group_post: string = environment.invitation_group_post;
    @Input() voRegistrationLink: string = environment.voRegistrationLink;
    @Input() invitation_group_pre: string = environment.invitation_group_pre;
    @Input() wiki_group_invitation: string = environment.wiki_group_invitations;
    is_admin: boolean = false;
    userprojects: {}[];
    member_id: number;
    admingroups: {};
    filteredMembers = null;
    application_action: string = '';
    application_member_name: string = '';
    application_action_done: boolean = false;
    application_action_success: boolean;
    application_action_error_message: boolean;
    projects: Project[] = new Array();
    loaded: boolean = true;
    details_loaded: boolean = false;

    // modal variables for User list
    public usersModalProjectMembers: ProjectMember[] = [];
    public usersModalProjectID: number;
    public usersModalProjectName: string;
    public selectedProject: Project;

    public isLoaded: boolean = false;

    // modal variables for Add User Modal
    public addUserModalProjectID: number;
    public addUserModalProjectName: string;
    public addUserModalRealName: string;
    public addUserModalInvitationLink: string;

    public UserModalFacilityDetails: [string, string][];
    public UserModalFacility: [string, number];

    public passwordModalTitle: string = 'Changing Password';
    public passwordModalType: string = 'info';
    public passwordModalPassword: string = '';
    public passwordModalFacility: string = '';
    public passwordModalEmail: string = '';

    constructor(private groupservice: GroupService,
                private userservice: UserService,) {
        super();
        this.getUserProjects();

    }

    setAddUserInvitationLink(): void {
        const uri: string = this.invitation_group_pre + this.addUserModalRealName + this.invitation_group_post + this.addUserModalRealName;
        this.addUserModalInvitationLink = uri

    }

    setUserFacilityPassword(facility: string, details: [string, string][]): void {
        this.userservice.setUserFacilityPassword(facility).subscribe(result => {
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

    getProjectLifetime(project: Project): void {
        this.details_loaded = false;
        if (!project.Lifetime) {
            this.groupservice.getLifetime(project.Id).subscribe(res => {
                const lifetime: number | string = res['lifetime'];
                const dateCreated: Date = moment(project.DateCreated, 'DD.MM.YYYY').toDate();
                if (lifetime !== -1) {
                    const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
                    const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
                        .diff(moment(dateCreated), 'days'));

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

    getUserProjects(): void {

        this.groupservice.getGroupDetails().subscribe(result => {
            this.userprojects = result;
            for (const group of this.userprojects) {
                const dateCreated = moment(group['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
                const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
                const is_pi: boolean = group['is_pi'];
                const groupid: string = group['id'];
                const facility = group['compute_center'];
                const shortname: string = group['shortname'];

                const realname: string = group['name'];
                let compute_center: ComputecenterComponent = null;

                if (facility) {
                    compute_center = new ComputecenterComponent(
                        facility['compute_center_facility_id'], facility['compute_center_name'],
                        facility['compute_center_login'], facility['compute_center_support_mail']);
                }

                const newProject: Project = new Project(
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

    resetAddUserModal(): void {
        this.addUserModalProjectID = null;
        this.addUserModalProjectName = null;
        this.UserModalFacility = null;
    }

    filterMembers(searchString: string, groupid: number): void {
        this.userservice.getFilteredMembersOfdeNBIVo(searchString, groupid.toString()).subscribe(result => {
            this.filteredMembers = result;
        })
    }

    getMembesOfTheProject(projectid: number, projectname: string): void {
        this.groupservice.getGroupMembers(projectid.toString()).subscribe(members => {

            this.usersModalProjectID = projectid;
            this.usersModalProjectName = projectname;
            this.usersModalProjectMembers = new Array();
            this.groupservice.getGroupAdminIds(projectid.toString()).subscribe(result => {
                const admindIds = result['adminIds'];
                for (const member of members) {
                    const member_id: string = member['id'];
                    const user_id: string = member['userId'];
                    const fullName: string = `${member['firstName']} ${member['lastName']}`;
                    const projectMember: ProjectMember = new ProjectMember(user_id, fullName, member_id);
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

    loadProjectApplications(project: number): void {
        this.loaded = false;
        this.groupservice.getGroupApplications(project).subscribe(applications => {
            this.selectedProject.ProjectMemberApplications = [];

            const newProjectApplications: ProjectMemberApplication[] = [];
            if (applications.length === 0) {
                this.loaded = true;

            }
            for (const application of applications) {
                const dateApplicationCreated: moment.Moment = moment(application['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
                const membername: string = application['displayName'];

                const newMemberApplication: ProjectMemberApplication = new ProjectMemberApplication(
                    application['id'], membername, `${dateApplicationCreated.date()}.${(dateApplicationCreated.month() + 1)}`
                    + '.' + dateApplicationCreated.year()
                );
                newProjectApplications.push(newMemberApplication);

                this.selectedProject.ProjectMemberApplications = newProjectApplications;
                this.loaded = true;

            }

        })

    }

    approveMemberApplication(project: number, application: number, membername: string): void {
        this.loaded = false;
        this.application_action_done = false;
        this.groupservice.approveGroupApplication(project, application).subscribe(tmp_application => {
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

    rejectMemberApplication(project: number, application: number, membername: string): void {
        this.loaded = false;
        this.application_action_done = false;

        this.groupservice.rejectGroupApplication(project, application).subscribe(tmp_application => {
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

    public showMembersOfTheProject(projectid: number, projectname: string, facility?: [string, number]): void {
        this.getMembesOfTheProject(projectid, projectname);

        if (facility) {
            this.UserModalFacility = facility;

        } else {
            this.UserModalFacility = null;

        }

    }

    public resetPasswordModal(): void {
        this.passwordModalTitle = 'Changing Password';
        this.passwordModalType = 'info';
        this.passwordModalPassword = '';
        this.passwordModalFacility = '';
        this.passwordModalEmail = '';

    }

    public showAddUserToProjectModal(projectid: number, projectname: string, realname: string, facility?: [string, number]): void {
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

    public addMember(groupid: number, memberid: number, firstName: string, lastName: string): void {
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(
            result => {
                if (result.status === 200) {
                    this.updateNotificationModal('Success', `Member ' + ${firstName} ${lastName} added.`, true, 'success');

                } else {

                    this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
                }
            },
            error => {

                if (error['name'] === 'AlreadyMemberException') {
                    this.updateNotificationModal('Info', `${firstName} ${lastName} is already a member of the project.`, true, 'info');
                } else {
                    this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
                }
            });

    }

    public addAdmin(groupid: number, memberid: number, userid: number, firstName: string, lastName: string): void {
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(
            () => {
                this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                    result => {

                        if (result.status === 200) {
                            this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');

                        } else {
                            this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                        }
                    }, error => {
                        if (error['name'] === 'AlreadyAdminException') {
                            this.updateNotificationModal(
                                'Info', `${firstName} ${lastName} is already a admin of the project.`,
                                true, 'info');
                        } else {
                            this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                        }
                    })
            },
            () => {
                this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                    result => {

                        if (result.status === 200) {
                            this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');

                        } else {
                            this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                        }
                    }, error => {
                        if (error['name'] === 'AlreadyAdminException') {
                            this.updateNotificationModal(
                                'Info', `${firstName} ${lastName} is already a admin of the project.`,
                                true, 'info');
                        } else {
                            this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                        }
                    })
            })
    }

    public promoteAdmin(groupid: number, userid: number, username: string): void {
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.addAdmin(groupid, userid, facility_id).toPromise()
            .then(result => {

                if (result.status === 200) {
                    this.updateNotificationModal('Success', `${username} promoted to Admin`, true, 'success');

                } else {
                    this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
                }
            }).catch(() => {
            this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
        });
    }

    public removeAdmin(groupid: number, userid: number, name: string): void {
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.removeAdmin(groupid, userid, facility_id).toPromise()
            .then(result => {

                if (result.status === 200) {
                    this.updateNotificationModal('Success', `${name} was removed as Admin`, true, 'success');

                } else {
                    this.updateNotificationModal('Failed', `${name} could not be removed as Admin!`, true, 'danger');
                }
            }).catch(() => {
            this.updateNotificationModal('Failed', `${name} could not be removed as Admin!`, true, 'danger'
            );
        });
    }

    public removeMember(groupid: number, memberid: number, name: string): void {
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) {
            facility_id = this.UserModalFacility[1]
        }
        this.groupservice.removeMember(groupid, memberid, facility_id).subscribe(
            result => {

                if (result.status === 200) {
                    this.updateNotificationModal('Success', `Member ${name}  removed from the group`, true, 'success');

                } else {
                    this.updateNotificationModal('Failed', `Member ${name}  could not be removed !`, true, 'danger');
                }
            },
            () => {
                this.updateNotificationModal('Failed', `Member ${name}  could not be removed !`, true, 'danger');
            });
    }

    public resetFacilityDetailsModal(): void {
        this.UserModalFacility = null;
        this.UserModalFacilityDetails = null;
    }

    public comingSoon(): void {
        alert('This function will be implemented soon.')
    }
}
