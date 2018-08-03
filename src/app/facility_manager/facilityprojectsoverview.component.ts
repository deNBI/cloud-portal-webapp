import {Component, Input, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Project} from '../projectmanagement/project.model';
import {ModalDirective} from "ngx-bootstrap";
import {ProjectMember} from '../projectmanagement/project_member.model'
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment'
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";
import {UserService} from "../api-connector/user.service";
import {FacilityService} from "../api-connector/facility.service";
import {FormsModule} from '@angular/forms';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

@Component({
    templateUrl: 'facilityprojectsoverview.component.html',
    providers: [FacilityService, UserService, GroupService, PerunSettings, ApiSettings]
})
export class FacilityProjectsOverviewComponent {

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

    public emailSubject: string;
    public emailText: string;
    public emailStatus: number = 0;
    public emailReply: string = '';

    public managerFacilities: [string, number][];
    public selectedFacility: [string, number]


    constructor(private groupservice: GroupService,
                private  facilityservice: FacilityService) {

        this.facilityservice.getManagerFacilities().subscribe(result => {
            this.managerFacilities = result
            this.selectedFacility = this.managerFacilities[0]
            this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])

        })
    }


    onChangeSelectedFacility(value) {
        this.getFacilityProjects(this.selectedFacility['FacilityId'])
    }

    getFacilityProjects(facility) {
        let projects_ready = {};

        this.facilityservice.getFacilityAllowedGroups(facility).subscribe(result => {
            let number_facilityprojects = result.length;
            for (let group of result) {
                projects_ready[group['id']] = false
                this.groupservice.getShortame(group['id']).subscribe(name => {

                    let shortname = name['shortname']
                    if (!shortname) {
                        shortname = group['name']
                    }
                    let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                    let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                    let is_pi = false;
                    let is_admin = false;
                    let newProject = new Project(
                        group["id"],
                        shortname,
                        group["description"],
                        dateCreated.date() + "." + (dateCreated.month() + 1) + "." + dateCreated.year(),
                        dateDayDifference,
                        is_pi,
                        is_admin,
                        [result['Facility'], result['FacilityId']]
                    );
                    newProject.Lifetime = group['lifetime']
                    if (newProject.Lifetime != -1) {
                        newProject.LifetimeDays = Math.ceil(Math.ceil(Math.abs(moment(dateCreated).add(newProject.Lifetime, 'months').toDate().getTime() - moment(dateCreated).valueOf())) / (1000 * 3600 * 24))
                        let expirationDate = moment(dateCreated).add(newProject.Lifetime, 'months').toDate();
                        newProject.DateEnd = moment(expirationDate).date() + "." + (moment(expirationDate).month() + 1) + "." + moment(expirationDate).year();
                    }
                    else {
                        newProject.LifetimeDays = -1;
                    }
                    this.projects.push(newProject);
                    projects_ready[group['id']] = true;

                    let all_ready = true;
                    if (Object.keys(projects_ready).length == number_facilityprojects) {

                        for (let key in projects_ready) {
                            if (projects_ready[key] == false) {
                                all_ready = false

                            }
                        }
                        if (all_ready == true) {

                            this.isLoaded = true
                        }
                    }
                })
            }


        })


    }

    lifeTimeReached(lifetime: number, running: number): string {

        if (lifetime == -1) {
            return "blue";
        }
        return (lifetime - running) < 0 ? "red" : "black";
    }

    sendMailToFacility(facility: number, subject: string, message: string, reply?: string) {
        this.facilityservice.sendMailToFacility(facility, encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => {
            if (result == 1) {
                this.emailStatus = 1;
            }
            else {
                this.emailStatus = 2;
            }
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
                    let fullName = member["user"]["firstName"] + " " + member["user"]["lastName"];
                    this.usersModalProjectMembers.push(new ProjectMember(user_id, fullName, member_id));
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
