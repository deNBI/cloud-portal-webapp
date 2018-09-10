import {Component, Input, OnInit} from '@angular/core';
import {VoService} from "../api-connector/vo.service";
import {Project} from "../projectmanagement/project.model";
import {ProjectMember} from "../projectmanagement/project_member.model";
import {GroupService} from "../api-connector/group.service";
import * as moment from 'moment';
import {ComputecenterComponent} from "../projectmanagement/computecenter.component";

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
    public selectedProject: Project;

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
        this.voserice.getAllGroupsWithDetails().subscribe(result => {
            let vo_projects = result;
            for (let key in vo_projects) {
                let group = vo_projects[key];
                let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                let is_pi = group['is_pi'];
                let groupid = key;
                let facility = group['facility'];
                let shortname = group['shortname'];
                let details = facility['Details'];
                let details_array = [];
                let lifetime = group['lifetime'];
                let lifetimeDays = -1;
                let expirationDate = undefined;
                if (lifetime != -1) {
                    lifetimeDays = Math.ceil(Math.ceil(Math.abs(moment(dateCreated).add(lifetime, 'months').toDate().getTime() - moment(dateCreated).valueOf())) / (1000 * 3600 * 24));
                    expirationDate = moment(dateCreated).add(lifetime, 'months').toDate();
                }
                for (let detail in details) {
                    let detail_tuple = [detail, details[detail]];
                    details_array.push(detail_tuple);
                }
                //check if user is a PI (group manager)

                if (!shortname) {
                    shortname = group['name']
                }
                let compute_center = new ComputecenterComponent(facility['FacilityId'], facility['Facility'], facility['Login'], facility['Support']);


                let newProject = new Project(
                    Number(groupid),
                    shortname,
                    group["description"],
                    dateCreated.date() + "." + (dateCreated.month() + 1) + "." + dateCreated.year(),
                    dateDayDifference,
                    is_pi,
                    true,
                    compute_center);
                newProject.Lifetime = lifetime;
                newProject.LifetimeDays = lifetimeDays;
                if (expirationDate) {
                    newProject.DateEnd = moment(expirationDate).date() + "." + (moment(expirationDate).month() + 1) + "." + moment(expirationDate).year();
                }
                this.projects.push(newProject);
            }
            this.isLoaded = true;


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


}
