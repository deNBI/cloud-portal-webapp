import ***REMOVED***Component, Input***REMOVED*** from '@angular/core';
import ***REMOVED***Project***REMOVED*** from './project.model';
import ***REMOVED***ProjectMember***REMOVED*** from './project_member.model'
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import * as moment from 'moment';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***ProjectMemberApplication***REMOVED*** from './project_member_application';
import ***REMOVED***ComputecenterComponent***REMOVED*** from './computecenter.component';
import ***REMOVED***AbstractBaseClasse***REMOVED*** from '../shared/shared_modules/baseClass/abstract-base-class';
import ***REMOVED***IResponseTemplate***REMOVED*** from "../api-connector/response-template";

/**
 * Projectoverview component.
 */
@Component(***REMOVED***
    templateUrl: 'overview.component.html',
    providers: [VoService, UserService, GroupService, ApiSettings]
***REMOVED***)
export class OverviewComponent extends AbstractBaseClasse ***REMOVED***

    debug_module: boolean = false;
    @Input() invitation_group_post: string = environment.invitation_group_post;
    @Input() voRegistrationLink: string = environment.voRegistrationLink;
    @Input() invitation_group_pre: string = environment.invitation_group_pre;
    @Input() wiki_group_invitation: string = environment.wiki_group_invitations;
    is_admin: boolean = false;
    userprojects: ***REMOVED******REMOVED***[];
    member_id: number;
    admingroups: ***REMOVED******REMOVED***;
    filteredMembers = null;
    application_action: string = '';
    application_member_name: string = '';
    application_action_done: boolean = false;
    application_action_success: boolean;
    application_action_error_message: boolean;
    projects: Project[] = [];
    loaded: boolean = true;
    details_loaded: boolean = false;

    // modal variables for User list
    public usersModalProjectMembers: ProjectMember[] = [];
    public usersModalProjectID: number | string;
    public usersModalProjectName: string;
    public selectedProject: Project;

    public isLoaded: boolean = false;

    // modal variables for Add User Modal
    public addUserModalProjectID: number;
    public addUserModalProjectName: string;
    public addUserModalRealName: string;
    public addUserModalInvitationLink: string = '';

    public showLink: boolean = true;

    public UserModalFacilityDetails: [string, string][];
    public UserModalFacility: [string, number];

    public passwordModalTitle: string = 'Changing Password';
    public passwordModalType: string = 'info';
    public passwordModalPassword: string = '';
    public passwordModalFacility: string = '';
    public passwordModalEmail: string = '';

    constructor(private groupservice: GroupService,
                private userservice: UserService) ***REMOVED***
        super();
        this.getUserProjects();

    ***REMOVED***

    setAddUserInvitationLink(): void ***REMOVED***
        const uri: string = this.invitation_group_pre + this.addUserModalRealName + this.invitation_group_post + this.addUserModalRealName;
        this.addUserModalInvitationLink = uri

    ***REMOVED***

    getProjectLifetime(project: Project): void ***REMOVED***
        this.details_loaded = false;
        if (!project.Lifetime) ***REMOVED***
            this.groupservice.getLifetime(project.Id).subscribe((time: IResponseTemplate) => ***REMOVED***
                const lifetime: number | string = <number>time.value;
                const dateCreated: Date = moment(project.DateCreated, 'DD.MM.YYYY').toDate();
                if (lifetime !== -1) ***REMOVED***
                    const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
                    const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
                        .diff(moment(dateCreated), 'days'));

                    project.LifetimeDays = lifetimeDays;
                    project.DateEnd = expirationDate;
                ***REMOVED***
                project.Lifetime = lifetime;
                this.details_loaded = true;

            ***REMOVED***)
        ***REMOVED*** else ***REMOVED***
            this.details_loaded = true;
        ***REMOVED***

    ***REMOVED***

    copyLink(text: string) ***REMOVED***
        const event = e => ***REMOVED***
            e.clipboardData.setData('text/plain', text);
            e.preventDefault();
            // ...('copy', e), as event is outside scope
            document.removeEventListener('copy', e);
        ***REMOVED***
        document.addEventListener('copy', event);
        document.execCommand('copy');
    ***REMOVED***

    getUserProjects(): void ***REMOVED***

        this.groupservice.getGroupDetails().subscribe(result => ***REMOVED***
            this.userprojects = result;
            for (const group of this.userprojects) ***REMOVED***
                const dateCreated: moment.Moment = moment.unix(group['createdAt']);
                const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
                const is_pi: boolean = group['is_pi'];
                const groupid: string = group['id'];
                const facility = group['compute_center'];
                const shortname: string = group['shortname'];

                const realname: string = group['name'];
                let compute_center: ComputecenterComponent = null;

                if (facility) ***REMOVED***
                    compute_center = new ComputecenterComponent(
                        facility['compute_center_facility_id'], facility['compute_center_name'],
                        facility['compute_center_login'], facility['compute_center_support_mail']);
                ***REMOVED***

                const newProject: Project = new Project(
                    groupid,
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
            ***REMOVED***
            this.isLoaded = true;
        ***REMOVED***)

    ***REMOVED***

    resetAddUserModal(): void ***REMOVED***
        this.addUserModalProjectID = null;
        this.addUserModalProjectName = null;
        this.UserModalFacility = null;
    ***REMOVED***

    filterMembers(searchString: string): void ***REMOVED***
        this.userservice.getFilteredMembersOfdeNBIVo(searchString).subscribe(result => ***REMOVED***
            this.filteredMembers = result;
        ***REMOVED***)
    ***REMOVED***

    getMembersOfTheProject(projectid: number | string, projectname: string): void ***REMOVED***
        this.groupservice.getGroupMembers(projectid.toString()).subscribe(members => ***REMOVED***

            this.usersModalProjectID = projectid;
            this.usersModalProjectName = projectname;
            this.usersModalProjectMembers = new Array();
            this.groupservice.getGroupAdminIds(projectid.toString()).subscribe(result => ***REMOVED***
                const admindIds = result['adminIds'];
                for (const member of members) ***REMOVED***
                    const member_id: string = member['id'];
                    const user_id: string = member['userId'];
                    const fullName: string = `$***REMOVED***member['firstName']***REMOVED*** $***REMOVED***member['lastName']***REMOVED***`;
                    const projectMember: ProjectMember = new ProjectMember(user_id, fullName, member_id);
                    projectMember.ElixirId = member['elixirId'];
                    if (admindIds.indexOf(user_id) !== -1) ***REMOVED***
                        projectMember.IsPi = true;
                    ***REMOVED*** else ***REMOVED***
                        projectMember.IsPi = false;
                    ***REMOVED***

                    this.usersModalProjectMembers.push(projectMember);

                ***REMOVED***
            ***REMOVED***)

        ***REMOVED***);
    ***REMOVED***

    loadProjectApplications(project: number): void ***REMOVED***
        this.loaded = false;
        this.groupservice.getGroupApplications(project).subscribe(applications => ***REMOVED***
            this.selectedProject.ProjectMemberApplications = [];

            const newProjectApplications: ProjectMemberApplication[] = [];
            if (applications.length === 0) ***REMOVED***
                this.loaded = true;

            ***REMOVED***
            for (const application of applications) ***REMOVED***
                const dateApplicationCreated: moment.Moment = moment(application['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
                const membername: string = application['displayName'];

                const newMemberApplication: ProjectMemberApplication = new ProjectMemberApplication(
                    application['id'], membername, `$***REMOVED***dateApplicationCreated.date()***REMOVED***.$***REMOVED***(dateApplicationCreated.month() + 1)***REMOVED***`
                    + '.' + dateApplicationCreated.year()
                );
                newProjectApplications.push(newMemberApplication);

                this.selectedProject.ProjectMemberApplications = newProjectApplications;
                this.loaded = true;

            ***REMOVED***

        ***REMOVED***)

    ***REMOVED***

    approveMemberApplication(project: number, application: number, membername: string): void ***REMOVED***
        this.loaded = false;
        this.application_action_done = false;
        this.groupservice.approveGroupApplication(project, application).subscribe(tmp_application => ***REMOVED***
            this.selectedProject.ProjectMemberApplications = [];

            if (tmp_application['state'] === 'APPROVED') ***REMOVED***
                this.application_action_success = true;
            ***REMOVED*** else if (tmp_application['message']) ***REMOVED***
                this.application_action_success = false;

                this.application_action_error_message = tmp_application['message'];

            ***REMOVED*** else ***REMOVED***
                this.application_action_success = false;
            ***REMOVED***

            this.application_action = 'approved';
            this.application_member_name = membername;
            this.application_action_done = true;
            this.loadProjectApplications(project);

        ***REMOVED***);
    ***REMOVED***

    rejectMemberApplication(project: number, application: number, membername: string): void ***REMOVED***
        this.loaded = false;
        this.application_action_done = false;

        this.groupservice.rejectGroupApplication(project, application).subscribe(tmp_application => ***REMOVED***
                this.selectedProject.ProjectMemberApplications = [];

                if (tmp_application['state'] === 'REJECTED') ***REMOVED***
                    this.application_action_success = true;

                ***REMOVED*** else if (tmp_application['message']) ***REMOVED***
                    this.application_action_success = false;

                    this.application_action_error_message = tmp_application['message'];
                ***REMOVED*** else ***REMOVED***
                    this.application_action_success = false;
                ***REMOVED***
                this.application_action = 'rejected';
                this.application_member_name = membername;
                this.application_action_done = true;
                this.loadProjectApplications(project);

            ***REMOVED***
        );
    ***REMOVED***

    isPi(member: ProjectMember): string ***REMOVED***

        if (member.IsPi) ***REMOVED***
            return 'blue'
        ***REMOVED*** else ***REMOVED***
            return 'black'
        ***REMOVED***

    ***REMOVED***

    public showMembersOfTheProject(projectid: number | string, projectname: string, facility?: [string, number]): void ***REMOVED***
        this.getMembersOfTheProject(projectid, projectname);

        if (facility) ***REMOVED***
            this.UserModalFacility = facility;

        ***REMOVED*** else ***REMOVED***
            this.UserModalFacility = null;

        ***REMOVED***

    ***REMOVED***

    public resetPasswordModal(): void ***REMOVED***
        this.passwordModalTitle = 'Changing Password';
        this.passwordModalType = 'info';
        this.passwordModalPassword = '';
        this.passwordModalFacility = '';
        this.passwordModalEmail = '';

    ***REMOVED***

    public showAddUserToProjectModal(projectid: number, projectname: string, realname: string, facility?: [string, number]): void ***REMOVED***
        this.addUserModalProjectID = projectid;
        this.addUserModalProjectName = projectname;
        this.addUserModalRealName = realname;
        this.UserModalFacility = facility;

        if (facility) ***REMOVED***
            this.UserModalFacility = facility;

        ***REMOVED*** else ***REMOVED***
            this.UserModalFacility = null;

        ***REMOVED***
    ***REMOVED***

    public addMember(groupid: number, memberid: number, firstName: string, lastName: string): void ***REMOVED***
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) ***REMOVED***
            facility_id = this.UserModalFacility[1]
        ***REMOVED***
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(
            result => ***REMOVED***
                if (result.status === 200) ***REMOVED***
                    this.updateNotificationModal('Success', `Member $***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** added.`, true, 'success');

                ***REMOVED*** else ***REMOVED***

                    this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
                ***REMOVED***
            ***REMOVED***,
            error => ***REMOVED***

                if (error['name'] === 'AlreadyMemberException') ***REMOVED***
                    this.updateNotificationModal('Info', `$***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** is already a member of the project.`, true, 'info');
                ***REMOVED*** else ***REMOVED***
                    this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
                ***REMOVED***
            ***REMOVED***);

    ***REMOVED***

    public addAdmin(groupid: number, memberid: number, userid: number, firstName: string, lastName: string): void ***REMOVED***
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) ***REMOVED***
            facility_id = this.UserModalFacility[1]
        ***REMOVED***
        this.groupservice.addMember(groupid, memberid, facility_id).subscribe(
            () => ***REMOVED***
                this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                    result => ***REMOVED***

                        if (result.status === 200) ***REMOVED***
                            this.updateNotificationModal('Success', `Admin $***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** added.`, true, 'success');

                        ***REMOVED*** else ***REMOVED***
                            this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                        ***REMOVED***
                    ***REMOVED***, error => ***REMOVED***
                        if (error['name'] === 'AlreadyAdminException') ***REMOVED***
                            this.updateNotificationModal(
                                'Info', `$***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** is already a admin of the project.`,
                                true, 'info');
                        ***REMOVED*** else ***REMOVED***
                            this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                        ***REMOVED***
                    ***REMOVED***)
            ***REMOVED***,
            () => ***REMOVED***
                this.groupservice.addAdmin(groupid, userid, facility_id).subscribe(
                    result => ***REMOVED***

                        if (result.status === 200) ***REMOVED***
                            this.updateNotificationModal('Success', `Admin $***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** added.`, true, 'success');

                        ***REMOVED*** else ***REMOVED***
                            this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                        ***REMOVED***
                    ***REMOVED***, error => ***REMOVED***
                        if (error['name'] === 'AlreadyAdminException') ***REMOVED***
                            this.updateNotificationModal(
                                'Info', `$***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** is already a admin of the project.`,
                                true, 'info');
                        ***REMOVED*** else ***REMOVED***
                            this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
                        ***REMOVED***
                    ***REMOVED***)
            ***REMOVED***)
    ***REMOVED***

    public promoteAdmin(groupid: number, userid: number, username: string): void ***REMOVED***
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) ***REMOVED***
            facility_id = this.UserModalFacility[1]
        ***REMOVED***
        this.groupservice.addAdmin(groupid, userid, facility_id).toPromise()
            .then(result => ***REMOVED***

                if (result.status === 200) ***REMOVED***
                    this.updateNotificationModal('Success', `$***REMOVED***username***REMOVED*** promoted to Admin`, true, 'success');

                ***REMOVED*** else ***REMOVED***
                    this.updateNotificationModal('Failed', `$***REMOVED***username***REMOVED*** could not be promoted to Admin!`, true, 'danger');
                ***REMOVED***
            ***REMOVED***).catch(() => ***REMOVED***
            this.updateNotificationModal('Failed', `$***REMOVED***username***REMOVED*** could not be promoted to Admin!`, true, 'danger');
        ***REMOVED***);
    ***REMOVED***

    public removeAdmin(groupid: number, userid: number, name: string): void ***REMOVED***
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) ***REMOVED***
            facility_id = this.UserModalFacility[1]
        ***REMOVED***
        this.groupservice.removeAdmin(groupid, userid, facility_id).toPromise()
            .then(result => ***REMOVED***

                if (result.status === 200) ***REMOVED***
                    this.updateNotificationModal('Success', `$***REMOVED***name***REMOVED*** was removed as Admin`, true, 'success');

                ***REMOVED*** else ***REMOVED***
                    this.updateNotificationModal('Failed', `$***REMOVED***name***REMOVED*** could not be removed as Admin!`, true, 'danger');
                ***REMOVED***
            ***REMOVED***).catch(() => ***REMOVED***
            this.updateNotificationModal('Failed', `$***REMOVED***name***REMOVED*** could not be removed as Admin!`, true, 'danger'
            );
        ***REMOVED***);
    ***REMOVED***

    public removeMember(groupid: number, memberid: number, name: string): void ***REMOVED***
        let facility_id: string | number = null;
        if (this.UserModalFacility && this.UserModalFacility[1]) ***REMOVED***
            facility_id = this.UserModalFacility[1]
        ***REMOVED***
        this.groupservice.removeMember(groupid, memberid, facility_id).subscribe(
            result => ***REMOVED***

                if (result.status === 200) ***REMOVED***
                    this.updateNotificationModal('Success', `Member $***REMOVED***name***REMOVED***  removed from the group`, true, 'success');

                ***REMOVED*** else ***REMOVED***
                    this.updateNotificationModal('Failed', `Member $***REMOVED***name***REMOVED***  could not be removed !`, true, 'danger');
                ***REMOVED***
            ***REMOVED***,
            () => ***REMOVED***
                this.updateNotificationModal('Failed', `Member $***REMOVED***name***REMOVED***  could not be removed !`, true, 'danger');
            ***REMOVED***);
    ***REMOVED***

    public resetFacilityDetailsModal(): void ***REMOVED***
        this.UserModalFacility = null;
        this.UserModalFacilityDetails = null;
    ***REMOVED***

    public comingSoon(): void ***REMOVED***
        alert('This function will be implemented soon.')
    ***REMOVED***
***REMOVED***
