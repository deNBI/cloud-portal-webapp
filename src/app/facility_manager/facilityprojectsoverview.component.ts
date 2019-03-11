import ***REMOVED***Component, Input***REMOVED*** from '@angular/core';
import ***REMOVED***Project***REMOVED*** from '../projectmanagement/project.model';
import ***REMOVED***ProjectMember***REMOVED*** from '../projectmanagement/project_member.model'
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';

import * as moment from 'moment';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***FilterBaseClass***REMOVED*** from '../shared/shared_modules/baseClass/filter-base-class';

/**
 * Facility Project overview component.
 */
@Component(***REMOVED***
    templateUrl: 'facilityprojectsoverview.component.html',
    providers: [FacilityService, UserService, GroupService, ApiSettings]
***REMOVED***)
export class FacilityProjectsOverviewComponent extends FilterBaseClass ***REMOVED***

    debug_module: boolean = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;

    member_id: number;
    isLoaded: boolean = false;
    projects: Project[] = [];
    details_loaded: boolean = false;
    /**
     * Approved group status.
     * @type ***REMOVED***number***REMOVED***
     */
    STATUS_APPROVED: number = 2;

    // modal variables for User list
    public usersModalProjectMembers: ProjectMember[] = [];
    public usersModalProjectID: number;
    public usersModalProjectName: string;
    public selectedProject: Project;

    public emailSubject: string;
    public emailText: string;
    public emailStatus: number = 0;
    public emailReply: string = '';

    public managerFacilities: [string, number][];
    public selectedFacility: [string, number];
    projects_filtered: Project[] = [];

    constructor(private groupservice: GroupService,
                private facilityservice: FacilityService) ***REMOVED***
        super();

        this.facilityservice.getManagerFacilities().subscribe(result => ***REMOVED***
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])

        ***REMOVED***)
    ***REMOVED***

    applyFilter(): void ***REMOVED***

        this.projects_filtered = this.projects.filter(vm => this.checkFilter(vm));

    ***REMOVED***

    checkFilter(project: Project): boolean ***REMOVED***
        return this.isFilterLongProjectName(project.RealName) && this.isFilterProjectStatus(project.Status, project.LifetimeReached)
            && this.isFilterProjectName(project.Name) && this.isFilterProjectId(project.Id)
    ***REMOVED***

    onChangeSelectedFacility(): void ***REMOVED***
        this.getFacilityProjects(this.selectedFacility['FacilityId'])
    ***REMOVED***

    getProjectLifetime(project: Project): void ***REMOVED***
        this.details_loaded = false;
        if (!project.Lifetime) ***REMOVED***
            this.groupservice.getLifetime(project.Id).subscribe(res => ***REMOVED***
                const lifetime: number = res['lifetime'];
                const dateCreated: Date = moment(project.DateCreated, 'DD.MM.YYYY').toDate();

                if (lifetime !== -1) ***REMOVED***
                    const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
                    const lifetimeDays: number = Math.abs(
                        moment(moment(expirationDate, 'DD.MM.YYYY').toDate()).diff(moment(dateCreated), 'days'));

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

    getFacilityProjects(facility: string): void ***REMOVED***
        this.projects = [];

        this.facilityservice.getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility, this.STATUS_APPROVED).subscribe(result => ***REMOVED***
            const facility_projects = result;
            const is_pi: boolean = false;
            const is_admin: boolean = false;
            for (const group of facility_projects) ***REMOVED***
                const dateCreated: moment.Moment = moment(group['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
                const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
                const groupid: string = group['id'];
                const tmp_facility = group['compute_center'];
                let shortname: string = group['shortname'];
                let compute_center: ComputecenterComponent = null;
                const lifetime: number = group['lifetime'];

                if (!shortname) ***REMOVED***
                    shortname = group['name']
                ***REMOVED***
                if (tmp_facility) ***REMOVED***
                    compute_center = new ComputecenterComponent(
                        tmp_facility['compute_center_facility_id'],
                        tmp_facility['compute_center_name'],
                        tmp_facility['compute_center_login'],
                        tmp_facility['compute_center_support_mail']);
                ***REMOVED***

                const newProject: Project = new Project(
                    Number(groupid),
                    shortname,
                    group['description'],
                    `$***REMOVED***dateCreated.date()***REMOVED***.$***REMOVED***(dateCreated.month() + 1)***REMOVED***.$***REMOVED***dateCreated.year()***REMOVED***`,
                    dateDayDifference,
                    is_pi,
                    is_admin,
                    compute_center);
                newProject.Status = group['status'];

                if (lifetime !== -1) ***REMOVED***
                    const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
                    const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY')
                        .toDate()).diff(moment(dateCreated), 'days'));

                    newProject.LifetimeDays = lifetimeDays;
                    newProject.DateEnd = expirationDate;
                    newProject.LifetimeReached = this.lifeTimeReached(lifetimeDays, dateDayDifference)

                ***REMOVED***
                newProject.RealName = group['name'];
                newProject.Lifetime = lifetime;

                this.projects.push(newProject);
            ***REMOVED***
            this.applyFilter();
            this.isLoaded = true;

        ***REMOVED***)

    ***REMOVED***

    sendMailToFacility(facility: string, subject: string, message: string, reply?: string): void ***REMOVED***
        this.facilityservice.sendMailToFacility(
            facility, encodeURIComponent(subject), encodeURIComponent(message),
            encodeURIComponent(reply)).subscribe(
            result => ***REMOVED***

                if (result.status === 201) ***REMOVED***
                    this.emailStatus = 1;
                ***REMOVED*** else ***REMOVED***
                    this.emailStatus = 2;
                ***REMOVED***
            ***REMOVED***,
            error => ***REMOVED***
                console.log(error);
                this.emailStatus = 2;
            ***REMOVED***)

    ***REMOVED***

    getMembesOfTheProject(projectid: number, projectname: string): void ***REMOVED***
        this.facilityservice.getFacilityGroupRichMembers(projectid, this.selectedFacility['FacilityId']).subscribe(members => ***REMOVED***
                this.usersModalProjectID = projectid;
                this.usersModalProjectName = projectname;
                this.usersModalProjectMembers = [];
                for (const member of members) ***REMOVED***
                    const member_id: string = member['id'];
                    const user_id: string = member['userId'];
                    const fullName: string = `$***REMOVED***member['firstName']***REMOVED*** $***REMOVED***member['lastName']***REMOVED***`;
                    const newMember: ProjectMember = new ProjectMember(user_id, fullName, member_id);
                    newMember.ElixirId = member['elixirId'];
                    newMember.Email = member['email'];
                    this.usersModalProjectMembers.push(newMember);
                ***REMOVED***

            ***REMOVED***
        )
    ***REMOVED***

    public showMembersOfTheProject(project_id: number, projectname: string): void ***REMOVED***
        this.getMembesOfTheProject(project_id, projectname);

    ***REMOVED***

    public resetEmailModal(): void ***REMOVED***

        this.emailSubject = null;
        this.emailText = null;
        this.emailReply = null;
        this.emailStatus = 0;

    ***REMOVED***

    public comingSoon(): void ***REMOVED***
        alert('This function will be implemented soon.')
    ***REMOVED***
***REMOVED***
