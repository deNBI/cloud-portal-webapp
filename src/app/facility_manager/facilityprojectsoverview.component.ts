import {Component, Input} from '@angular/core';
import {Project} from '../projectmanagement/project.model';
import {ProjectMember} from '../projectmanagement/project_member.model'
import {environment} from '../../environments/environment'
import {ApiSettings} from '../api-connector/api-settings.service';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import {FacilityService} from '../api-connector/facility.service';

import * as moment from 'moment';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {FilterBaseClass} from '../shared_modules/baseClass/filter-base-class';

/**
 * Facility Project overview component.
 */
@Component({
    templateUrl: 'facilityprojectsoverview.component.html',
    providers: [FacilityService, UserService, GroupService, ApiSettings]
})
export class FacilityProjectsOverviewComponent extends FilterBaseClass {

    debug_module: boolean = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;

    member_id: number;
    isLoaded: boolean = false;
    projects: Project[] = new Array();
    details_loaded: boolean = false;
    /**
     * Approved group status.
     * @type {number}
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
                private facilityservice: FacilityService) {
        super();

        this.facilityservice.getManagerFacilities().subscribe(result => {
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])

        })
    }

    applyFilter(): void {

        this.projects_filtered = this.projects.filter(vm => this.checkFilter(vm));

    }

    checkFilter(project: Project): boolean {
        return this.isFilterLongProjectName(project.RealName) && this.isFilterProjectStatus(project.Status, project.LifetimeReached)
            && this.isFilterProjectName(project.Name) && this.isFilterProjectId(project.Id)
    }

    onChangeSelectedFacility(): void {
        this.getFacilityProjects(this.selectedFacility['FacilityId'])
    }

    getProjectLifetime(project) {
        this.details_loaded = false;
        if (!project.Lifetime) {
            this.groupservice.getLifetime(project.Id).subscribe(res => {
                const lifetime = res['lifetime'];
                let dateCreated = project.DateCreated;

                let expirationDate;
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

    getFacilityProjects(facility) {
        this.projects = [];

        this.facilityservice.getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility, this.STATUS_APPROVED).subscribe(result => {
            const facility_projects = result;
            const is_pi = false;
            const is_admin = false;
            for (const group of facility_projects) {
                const dateCreated = moment(group['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
                const dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                const groupid = group['id'];
                const tmp_facility = group['compute_center'];
                let shortname = group['shortname'];
                let compute_center = null;
                const lifetime = group['lifetime'];
                let expirationDate;

                if (!shortname) {
                    shortname = group['name']
                }
                if (tmp_facility) {
                    compute_center = new ComputecenterComponent(tmp_facility['compute_center_facility_id'],
                        tmp_facility['compute_center_name'],
                        tmp_facility['compute_center_login'], tmp_facility['compute_center_support_mail']);
                }

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

                if (lifetime !== -1) {
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
                    const lifetimeDays = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate()).diff(moment(dateCreated), 'days'));

                    newProject.LifetimeDays = lifetimeDays;
                    newProject.DateEnd = expirationDate;
                    newProject.LifetimeReached = this.lifeTimeReached(lifetimeDays, dateDayDifference)

                }
                newProject.RealName = group['name'];
                newProject.Lifetime = lifetime;

                this.projects.push(newProject);
            }
            this.applyFilter();
            this.isLoaded = true;

        })

    }

    sendMailToFacility(facility: string, subject: string, message: string, reply?: string) {
        this.facilityservice.sendMailToFacility(facility, encodeURIComponent(subject), encodeURIComponent(message),
            encodeURIComponent(reply)).subscribe(result => {

                if (result.status === 201) {
                    this.emailStatus = 1;
                } else {
                    this.emailStatus = 2;
                }
            },
            error => {
                console.log(error);
                this.emailStatus = 2;
            })

    }

    getMembesOfTheProject(projectid: number, projectname: string) {
        this.facilityservice.getFacilityGroupRichMembers(projectid, this.selectedFacility['FacilityId']).subscribe(members => {
                this.usersModalProjectID = projectid;
                this.usersModalProjectName = projectname;
                this.usersModalProjectMembers = new Array();
                for (const member of members) {
                    const member_id = member['id'];
                    const user_id = member['userId'];
                    const fullName = member['firstName'] + ' ' + member['lastName'];
                    const newMember = new ProjectMember(user_id, fullName, member_id);
                    newMember.ElixirId = member['elixirId'];
                    newMember.Email = member['email'];
                    this.usersModalProjectMembers.push(newMember);
                }

            }
        )
    }

    public showMembersOfTheProject(projectid: number, projectname: string, facility: [string, number]) {
        this.getMembesOfTheProject(projectid, projectname);

    }

    public resetEmailModal() {

        this.emailSubject = null;
        this.emailText = null;
        this.emailReply = null
        this.emailStatus = 0;

    }

    public comingSoon() {
        alert('This function will be implemented soon.')
    }
}
