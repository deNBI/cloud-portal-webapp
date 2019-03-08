import ***REMOVED***Component, Input***REMOVED*** from '@angular/core';
import ***REMOVED***PerunSettings***REMOVED*** from '../perun-connector/connector-settings.service';
import ***REMOVED***Project***REMOVED*** from '../projectmanagement/project.model';
import ***REMOVED***ProjectMember***REMOVED*** from '../projectmanagement/project_member.model'
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';

import * as moment from 'moment';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***FilterBaseClass***REMOVED*** from '../shared_modules/baseClass/filter-base-class';

@Component(***REMOVED***
    templateUrl: 'facilityprojectsoverview.component.html',
    providers: [FacilityService, UserService, GroupService, PerunSettings, ApiSettings]
***REMOVED***)
export class FacilityProjectsOverviewComponent extends FilterBaseClass ***REMOVED***

    debug_module = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;

    member_id: number;
    isLoaded = false;
    projects: Project[] = new Array();
    details_loaded = false;
    /**
     * Approved group status.
     * @type ***REMOVED***number***REMOVED***
     */
    STATUS_APPROVED = 2;

    private EXPIRED = 0;
    private EXPIRES_SOON = 1;
    private VALID_LIFETIME = 2;


    // modal variables for User list
    public usersModal;
    public usersModalProjectMembers: ProjectMember[] = new Array;
    public usersModalProjectID: number;
    public usersModalProjectName: string;
    public selectedProject: Project;


    public emailSubject: string;
    public emailText: string;
    public emailStatus = 0;
    public emailReply = '';

    public managerFacilities: [string, number][];
    public selectedFacility: [string, number];
    projects_filtered: Project[] = new Array();


    constructor(private groupservice: GroupService,
                private  facilityservice: FacilityService) ***REMOVED***
        super()

        this.facilityservice.getManagerFacilities().subscribe(result => ***REMOVED***
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])

        ***REMOVED***)
    ***REMOVED***

    applyFilter() ***REMOVED***


        this.projects_filtered = this.projects.filter(vm => this.checkFilter(vm));

    ***REMOVED***

    checkFilter(project: Project) ***REMOVED***
        if (this.isFilterLongProjectName(project.RealName) && this.isFilterProjectStatus(project.Status, project.LifetimeReached)
            && this.isFilterProjectName(project.Name) && this.isFilterProjectId(project.Id)) ***REMOVED***
            return true
        ***REMOVED*** else ***REMOVED***
            return false
        ***REMOVED***


    ***REMOVED***


    onChangeSelectedFacility(value) ***REMOVED***
        this.getFacilityProjects(this.selectedFacility['FacilityId'])
    ***REMOVED***

    getProjectLifetime(project) ***REMOVED***
        this.details_loaded = false;
        if (!project.Lifetime) ***REMOVED***
            this.groupservice.getLifetime(project.Id).subscribe(res => ***REMOVED***
                const lifetime = res['lifetime'];
                let dateCreated = project.DateCreated;

                let expirationDate = undefined;
                dateCreated = moment(dateCreated, 'DD.MM.YYYY').toDate();
                if (lifetime !== -1) ***REMOVED***
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
                    const lifetimeDays = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate()).diff(moment(dateCreated), 'days'));

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

    getFacilityProjects(facility) ***REMOVED***
        this.projects = [];


        this.facilityservice.getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility, this.STATUS_APPROVED).subscribe(result => ***REMOVED***
            const facility_projects = result;
            const is_pi = false;
            const is_admin = false;
            for (const group of facility_projects) ***REMOVED***
                const dateCreated = moment(group['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
                const dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                const groupid = group['id'];
                const tmp_facility = group['compute_center'];
                let shortname = group['shortname'];
                let compute_center = null;
                const lifetime = group['lifetime'];
                let expirationDate = undefined;


                if (!shortname) ***REMOVED***
                    shortname = group['name']
                ***REMOVED***
                if (tmp_facility) ***REMOVED***
                    compute_center = new ComputecenterComponent(tmp_facility['compute_center_facility_id'],
                        tmp_facility['compute_center_name'],
                        tmp_facility['compute_center_login'], tmp_facility['compute_center_support_mail']);
                ***REMOVED***

                const newProject = new Project(
                    Number(groupid),
                    shortname,
                    group['description'],
                    dateCreated.date() + '.' + (dateCreated.month() + 1) + '.' + dateCreated.year(),
                    dateDayDifference,
                    is_pi,
                    is_admin,
                    compute_center);
                newProject.Status = group['status'];

                if (lifetime !== -1) ***REMOVED***
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
                    const lifetimeDays = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate()).diff(moment(dateCreated), 'days'));

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

    sendMailToFacility(facility: string, subject: string, message: string, reply?: string) ***REMOVED***
        this.facilityservice.sendMailToFacility(facility, encodeURIComponent(subject), encodeURIComponent(message),
            encodeURIComponent(reply)).subscribe(result => ***REMOVED***

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

    getMembesOfTheProject(projectid: number, projectname: string) ***REMOVED***
        this.facilityservice.getFacilityGroupRichMembers(projectid, this.selectedFacility['FacilityId']).subscribe(members => ***REMOVED***
                this.usersModalProjectID = projectid;
                this.usersModalProjectName = projectname;
                this.usersModalProjectMembers = new Array();
                for (const member of members) ***REMOVED***
                    const member_id = member['id'];
                    const user_id = member['userId'];
                    const fullName = member['firstName'] + ' ' + member['lastName'];
                    const newMember = new ProjectMember(user_id, fullName, member_id);
                    newMember.ElixirId = member['elixirId'];
                    newMember.Email = member['email'];
                    this.usersModalProjectMembers.push(newMember);
                ***REMOVED***

            ***REMOVED***
        )
    ***REMOVED***

    public showMembersOfTheProject(projectid: number, projectname: string, facility: [string, number]) ***REMOVED***
        this.getMembesOfTheProject(projectid, projectname);

    ***REMOVED***

    public resetEmailModal() ***REMOVED***

        this.emailSubject = null;
        this.emailText = null;
        this.emailReply = null
        this.emailStatus = 0;

    ***REMOVED***


    public comingSoon() ***REMOVED***
        alert('This function will be implemented soon.')
    ***REMOVED***
***REMOVED***
