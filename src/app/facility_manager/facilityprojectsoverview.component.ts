import ***REMOVED***Component, Input, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***Http***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***Project***REMOVED*** from '../projectmanagement/project.model';
import ***REMOVED***ModalDirective***REMOVED*** from "ngx-bootstrap";
import ***REMOVED***ProjectMember***REMOVED*** from '../projectmanagement/project_member.model'
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***FacilityService***REMOVED*** from "../api-connector/facility.service";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***map***REMOVED*** from 'rxjs/operators';

import * as moment from 'moment';
import ***REMOVED***ComputecenterComponent***REMOVED*** from "../projectmanagement/computecenter.component";

@Component(***REMOVED***
    templateUrl: 'facilityprojectsoverview.component.html',
    providers: [FacilityService, UserService, GroupService, PerunSettings, ApiSettings]
***REMOVED***)
export class FacilityProjectsOverviewComponent ***REMOVED***

    debug_module = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;

    member_id: number;
    isLoaded: boolean = false;
    projects: Project[] = new Array();
    details_loaded = false;
    /**
     * Approved group status.
     * @type ***REMOVED***number***REMOVED***
     */
    STATUS_APPROVED = 2;


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
    public selectedFacility: [string, number]


    constructor(private groupservice: GroupService,
                private  facilityservice: FacilityService) ***REMOVED***

        this.facilityservice.getManagerFacilities().subscribe(result => ***REMOVED***
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0]
            this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])

        ***REMOVED***)
    ***REMOVED***


    onChangeSelectedFacility(value) ***REMOVED***
        this.getFacilityProjects(this.selectedFacility['FacilityId'])
    ***REMOVED***

    getProjectLifetime(project) ***REMOVED***
        this.details_loaded = false;
        if (!project.Lifetime) ***REMOVED***
            this.groupservice.getLifetime(project.Id).subscribe(res => ***REMOVED***
                let lifetime = res['lifetime'];
                let dateCreated = project.DateCreated;

                let expirationDate = undefined;
                dateCreated = moment(dateCreated, "DD.MM.YYYY").toDate();
                if (lifetime != -1) ***REMOVED***
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format("DD.MM.YYYY");
                    let lifetimeDays = Math.abs(moment(moment(expirationDate, "DD.MM.YYYY").toDate()).diff(moment(dateCreated), 'days'));

                    project.LifetimeDays = lifetimeDays;
                    project.DateEnd = expirationDate;
                ***REMOVED***
                project.Lifetime = lifetime;
                this.details_loaded = true;

            ***REMOVED***)
        ***REMOVED***
        else ***REMOVED***
            this.details_loaded = true;
        ***REMOVED***
    ***REMOVED***

    getFacilityProjects(facility) ***REMOVED***
        this.projects = [];


        this.facilityservice.getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility,this.STATUS_APPROVED).subscribe(result => ***REMOVED***
            let facility_projects = result;
            let is_pi = false;
            let is_admin = false;
            for (let group of facility_projects) ***REMOVED***
                let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                let groupid = group['id'];
                let facility = group['compute_center'];
                let shortname = group['shortname'];
                let compute_center = null;
                let lifetime = group['lifetime'];
                let expirationDate = undefined;


                if (!shortname) ***REMOVED***
                    shortname = group['name']
                ***REMOVED***
                if (facility) ***REMOVED***
                    compute_center = new ComputecenterComponent(facility['compute_center_facility_id'], facility['compute_center_name'], facility['compute_center_login'], facility['compute_center_support_mail']);
                ***REMOVED***

                let newProject = new Project(
                    Number(groupid),
                    shortname,
                    group["description"],
                    dateCreated.date() + "." + (dateCreated.month() + 1) + "." + dateCreated.year(),
                    dateDayDifference,
                    is_pi,
                    is_admin,
                    compute_center);
                if (lifetime != -1) ***REMOVED***
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format("DD.MM.YYYY");
                    let lifetimeDays = Math.abs(moment(moment(expirationDate, "DD.MM.YYYY").toDate()).diff(moment(dateCreated), 'days'));

                    newProject.LifetimeDays = lifetimeDays;
                    newProject.DateEnd = expirationDate;

                ***REMOVED***
                newProject.RealName=group['name'];
                newProject.Lifetime = lifetime;

                this.projects.push(newProject);
            ***REMOVED***
            this.isLoaded = true;


        ***REMOVED***)


    ***REMOVED***

    lifeTimeReached(lifetime: number, running: number): string ***REMOVED***

        if (lifetime == -1) ***REMOVED***
            return "blue";
        ***REMOVED***
        return (lifetime - running) < 0 ? "red" : "black";
    ***REMOVED***

    sendMailToFacility(facility: number, subject: string, message: string, reply?: string) ***REMOVED***
        this.facilityservice.sendMailToFacility(facility, encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => ***REMOVED***

                if (result.status == 201) ***REMOVED***
                    this.emailStatus = 1;
                ***REMOVED***
                else ***REMOVED***
                    this.emailStatus = 2;
                ***REMOVED***
            ***REMOVED***,
            error => ***REMOVED***
                console.log(error);
                this.emailStatus = 2;
            ***REMOVED***)

    ***REMOVED***

    getMembesOfTheProject(projectid: number, projectname: string) ***REMOVED***
        this.groupservice.getGroupMembers(projectid.toString()).subscribe(members => ***REMOVED***
                this.usersModalProjectID = projectid;
                this.usersModalProjectName = projectname;
                this.usersModalProjectMembers = new Array();
                for (let member of members) ***REMOVED***
                    let member_id = member["id"];
                    let user_id = member["userId"];
                    let fullName = member["firstName"] + " " + member["lastName"];
                    let newMember = new ProjectMember(user_id, fullName, member_id);
                    newMember.ElixirId = member['elixirId'];
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
        alert("This function will be implemented soon.")
    ***REMOVED***
***REMOVED***
