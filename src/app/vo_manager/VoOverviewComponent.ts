import {Component, Input, OnInit} from '@angular/core';
import {VoService} from "../api-connector/vo.service";
import {Project} from "../projectmanagement/project.model";
import {ProjectMember} from "../projectmanagement/project_member.model";
import {GroupService} from "../api-connector/group.service";
import * as moment from 'moment';

@Component({
    selector: 'voOverview',
    templateUrl: 'voOverview.component.html',
    providers: [VoService, GroupService]


})

export class VoOverviewComponent {

    public emailSubject: string;
    public emailReply: string = '';
    public emailText: string;
    public emailStatus: number = 0;
    public emailHeader: string;
    public emailVerify: string;
    public emailType: number;
    public newsletterSubscriptionCounter: number;
    isLoaded = false;

    member_id: number;
    projects: Project[] = new Array();


    // modal variables for User list
    public usersModal;
    public usersModalProjectMembers: ProjectMember[] = new Array;
    public usersModalProjectID: number;
    public usersModalProjectName: string;


    public managerFacilities: [string, number][];
    public selectedFacility: [string, number]


    constructor(private voserice: VoService, private groupservice: GroupService) {
        this.getVoProjects();
        this.voserice.getNewsletterSubscriptionCounter().subscribe(result => {
            this.newsletterSubscriptionCounter = result['subscribed'];
        });


    }


    sendEmail(subject: string, message: string, reply?: string) {
        switch (this.emailType) {
            case 0: {
                this.sendMailToVo(subject, message, reply);
                break;
            }
            case 1: {
                this.sendNewsletterToVo(subject, message, reply);
                break;
            }
        }
    }

    sendNewsletterToVo(subject: string, message: string, reply?: string) {
        this.voserice.sendNewsletterToVo(encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => {
            if (result == 1) {
                this.emailStatus = 1;
            }
            else {
                this.emailStatus = 2;
            }
        })

    }


    sendMailToVo(subject: string, message: string, reply?: string) {
        this.voserice.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => {
            if (result == 1) {
                this.emailStatus = 1;
            }
            else {
                this.emailStatus = 2;
            }
        })

    }

    setEmailType(type: number) {
        this.emailType = type;
        switch (this.emailType) {
            case 0: {
                this.emailHeader = 'Send email to all members of\n' +
                    '                    the vo';
                this.emailVerify = 'Are you sure you want to send this email to all members of the vo?';
                break;
            }
            case 1: {
                this.emailHeader = 'Send newsletter to vo';
                this.emailVerify = 'Are you sure you want to send this newsletter?'
                break;
            }

        }

    }

    public resetEmailModal() {


        this.emailHeader = null;
        this.emailSubject = null;
        this.emailText = null;
        this.emailType = null;
        this.emailVerify = null;
        this.emailReply = '';
        this.emailStatus = 0;

    }


    getVoProjects() {
        let projects_ready = {};
        this.voserice.getAllVoGroups().subscribe(result => {
            let number_voprojects = result.length;
            for (let group of result) {
                projects_ready[group['id']] = false;

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
                            newProject.LifetimeDays = Math.ceil(Math.ceil(Math.abs(moment(dateCreated).add(newProject.Lifetime, 'months').toDate().getTime() - moment(dateCreated).valueOf())) / (1000 * 3600 * 24));
                            let expirationDate = moment(dateCreated).add(newProject.Lifetime, 'months').toDate();
                            newProject.DateEnd = moment(expirationDate).date() + "." + (moment(expirationDate).month() + 1) + "." + moment(expirationDate).year();
                        }

                        else {
                            newProject.LifetimeDays = -1;
                        }


                        this.projects.push(newProject);
                        projects_ready[group['id']] = true;

                        let all_ready = true;
                        if (Object.keys(projects_ready).length == number_voprojects) {

                            for (let key in projects_ready) {
                                if (projects_ready[key] == false) {
                                    all_ready = false

                                }
                            }
                            if (all_ready == true) {

                                this.isLoaded = true
                            }
                        }
                    }
                )
            }


        })


    }

    lifeTimeReached(lifetimeDays: number, running: number): string {

        if (lifetimeDays == -1) {
            return "blue";
        }
        return (lifetimeDays - running) < 0 ? "red" : "black";
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


}
