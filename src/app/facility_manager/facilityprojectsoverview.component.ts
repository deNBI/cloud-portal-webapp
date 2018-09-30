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
            this.managerFacilities = result
            this.selectedFacility = this.managerFacilities[0]
            this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])

        ***REMOVED***)
    ***REMOVED***


    onChangeSelectedFacility(value) ***REMOVED***
        this.getFacilityProjects(this.selectedFacility['FacilityId'])
    ***REMOVED***

    getFacilityProjects(facility) ***REMOVED***


        this.facilityservice.getFacilityAllowedGroupsWithDetails(facility).subscribe(result => ***REMOVED***
            let facility_projects = result;
            let is_pi = false;
            let is_admin = false;
            for (let group of facility_projects) ***REMOVED***
                let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                let is_pi = group['is_pi'];
                let groupid = group['id'];
                let facility = group['compute_center'];
                let shortname = group['shortname'];
                let details = facility['Details'];
                let details_array = [];
                let lifetime = group['lifetime'];
                let lifetimeDays = -1;
                let expirationDate = undefined;
                if (lifetime != -1) ***REMOVED***
                    lifetimeDays = Math.ceil(Math.ceil(Math.abs(moment(dateCreated).add(lifetime, 'months').toDate().getTime() - moment(dateCreated).valueOf())) / (1000 * 3600 * 24));
                    expirationDate = moment(dateCreated).add(lifetime, 'months').toDate();
                ***REMOVED***
                for (let detail in details) ***REMOVED***
                    let detail_tuple = [detail, details[detail]];
                    details_array.push(detail_tuple);
                ***REMOVED***

                if (!shortname) ***REMOVED***
                    shortname = group['name']
                ***REMOVED***
                let compute_center = new ComputecenterComponent(facility['FacilityId'], facility['Facility'], facility['Login'], facility['Support']);


                let newProject = new Project(
                    Number(groupid),
                    shortname,
                    group["description"],
                    dateCreated.date() + "." + (dateCreated.month() + 1) + "." + dateCreated.year(),
                    dateDayDifference,
                    is_pi,
                    is_admin,
                    compute_center);
                newProject.Lifetime = lifetime;
                newProject.LifetimeDays = lifetimeDays;
                if (expirationDate) ***REMOVED***
                    newProject.DateEnd = moment(expirationDate).date() + "." + (moment(expirationDate).month() + 1) + "." + moment(expirationDate).year();
                ***REMOVED***
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
