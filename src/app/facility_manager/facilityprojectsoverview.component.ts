import {Component, Input, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Project} from '../projectmanagement/project.model';
import {ModalDirective} from "ngx-bootstrap";
import {ProjectMember} from '../projectmanagement/project_member.model'
import {environment} from '../../environments/environment'
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";
import {UserService} from "../api-connector/user.service";
import {FacilityService} from "../api-connector/facility.service";
import {FormsModule} from '@angular/forms';
import {map} from 'rxjs/operators';

import * as moment from 'moment';
import {ComputecenterComponent} from "../projectmanagement/computecenter.component";
import {AbstractBaseClasse} from "../shared_modules/baseClass/abstract-base-class";
import {FilterBaseClass} from "../shared_modules/baseClass/filter-base-class";

@Component({
    templateUrl: 'facilityprojectsoverview.component.html',
    providers: [FacilityService, UserService, GroupService, PerunSettings, ApiSettings]
})
export class FacilityProjectsOverviewComponent extends  FilterBaseClass{

    debug_module = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;

    member_id: number;
    isLoaded: boolean = false;
    projects: Project[] = new Array();
    details_loaded = false;
    /**
     * Approved group status.
     * @type {number}
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
    public emailStatus: number = 0;
    public emailReply: string = '';

    public managerFacilities: [string, number][];
    public selectedFacility: [string, number];
    projects_filtered: Project[] = new Array();




    constructor(private groupservice: GroupService,
                private  facilityservice: FacilityService) {
        super()

        this.facilityservice.getManagerFacilities().subscribe(result => {
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])

        })
    }

    applyFilter() {


        this.projects_filtered = this.projects.filter(vm => this.checkFilter(vm));

    }

    checkFilter(project: Project) {
        if (this.isFilterLongProjectName(project.RealName) && this.isFilterProjectStatus(project.Status, project.LifetimeReached) && this.isFilterProjectName(project.Name) && this.isFilterProjectId(project.Id)) {
            return true
        }
        else {
            return false
        }


    }

    /**
     * Change the filter of a status.
     * @param {string} status
     */
    changeFilterStatus(status_number: number) {
        let status: string;
        switch (status_number) {
            case 2:
                status = 'ACTIVE';
                break;
            case 4:
                status = 'SUSPENDED';
                break;
            case 6:
                status = 'EXPIRED';
                break;
            case 8:
                status = 'EXPIRES SOON';

        }
        this.filterstatus_list[status] = !this.filterstatus_list[status];


    }


    onChangeSelectedFacility(value) {
        this.getFacilityProjects(this.selectedFacility['FacilityId'])
    }

    getProjectLifetime(project) {
        this.details_loaded = false;
        if (!project.Lifetime) {
            this.groupservice.getLifetime(project.Id).subscribe(res => {
                let lifetime = res['lifetime'];
                let dateCreated = project.DateCreated;

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

    getFacilityProjects(facility) {
        this.projects = [];


        this.facilityservice.getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility, this.STATUS_APPROVED).subscribe(result => {
            let facility_projects = result;
            let is_pi = false;
            let is_admin = false;
            for (let group of facility_projects) {
                let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                let groupid = group['id'];
                let facility = group['compute_center'];
                let shortname = group['shortname'];
                let compute_center = null;
                let lifetime = group['lifetime'];
                let expirationDate = undefined;


                if (!shortname) {
                    shortname = group['name']
                }
                if (facility) {
                    compute_center = new ComputecenterComponent(facility['compute_center_facility_id'], facility['compute_center_name'], facility['compute_center_login'], facility['compute_center_support_mail']);
                }

                let newProject = new Project(
                    Number(groupid),
                    shortname,
                    group["description"],
                    dateCreated.date() + "." + (dateCreated.month() + 1) + "." + dateCreated.year(),
                    dateDayDifference,
                    is_pi,
                    is_admin,
                    compute_center);
                newProject.Status = group['status'];

                if (lifetime != -1) {
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format("DD.MM.YYYY");
                    let lifetimeDays = Math.abs(moment(moment(expirationDate, "DD.MM.YYYY").toDate()).diff(moment(dateCreated), 'days'));

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

    lifeTimeReached(lifetimeDays: number, running: number): number {
        if ((lifetimeDays - running) < 0) {
            // expired
            return this.EXPIRED
        }
        else if ((lifetimeDays - running) < 21) {
            //expires soon
            return this.EXPIRES_SOON
        }
        else {
            //still valid
            return this.VALID_LIFETIME
        }


    }

    sendMailToFacility(facility: number, subject: string, message: string, reply?: string) {
        this.facilityservice.sendMailToFacility(facility, encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => {

                if (result.status == 201) {
                    this.emailStatus = 1;
                }
                else {
                    this.emailStatus = 2;
                }
            },
            error => {
                console.log(error);
                this.emailStatus = 2;
            })

    }

    getMembesOfTheProject(projectid: number, projectname: string) {
        this.groupservice.getGroupMembers(projectid.toString()).subscribe(members => {
                this.usersModalProjectID = projectid;
                this.usersModalProjectName = projectname;
                this.usersModalProjectMembers = new Array();
                for (let member of members) {
                    let member_id = member["id"];
                    let user_id = member["userId"];
                    let fullName = member["firstName"] + " " + member["lastName"];
                    let newMember = new ProjectMember(user_id, fullName, member_id);
                    newMember.ElixirId = member['elixirId'];
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
        alert("This function will be implemented soon.")
    }
}
