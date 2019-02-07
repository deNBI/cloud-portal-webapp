import {Component, Input, OnInit} from '@angular/core';
import {VoService} from "../api-connector/vo.service";
import {Project} from "../projectmanagement/project.model";
import {ProjectMember} from "../projectmanagement/project_member.model";
import {GroupService} from "../api-connector/group.service";
import * as moment from 'moment';
import {ComputecenterComponent} from "../projectmanagement/computecenter.component";
import {Application} from "../applications/application.model";
import {AbstractBaseClasse} from "../shared_modules/baseClass/abstract-base-class";
import {FilterBaseClass} from "../shared_modules/baseClass/filter-base-class";

@Component({
    selector: 'voOverview',
    templateUrl: 'voOverview.component.html',
    providers: [VoService, GroupService]


})

export class VoOverviewComponent extends FilterBaseClass {

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
    details_loaded = false;

    member_id: number;
    projects: Project[] = new Array();
    projects_filtered: Project[] = new Array();


    // modal variables for User list
    public usersModal;
    public usersModalProjectMembers: ProjectMember[] = new Array;
    public usersModalProjectID: number;
    public usersModalProjectName: string;


    public managerFacilities: [string, number][];
    public selectedFacility: [string, number];


    constructor(private voserice: VoService, private groupservice: GroupService) {
        super();
        this.getVoProjects();
        this.voserice.getNewsletterSubscriptionCounter().subscribe(result => {
            this.newsletterSubscriptionCounter = result['subscribed'];
        });


    }

    applyFilter() {


        this.projects_filtered = this.projects.filter(vm => this.checkFilter(vm));

    }

    checkFilter(project: Project) {
        if (this.isFilterProjectStatus(project.Status, project.LifetimeReached) && this.isFilterProjectName(project.Name) && this.isFilterProjectId(project.Id)) {
            return true
        }
        else {
            return false
        }


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


    getVoProjects() {
        this.voserice.getAllGroupsWithDetails().subscribe(result => {
            let vo_projects = result;
            for (let group of vo_projects) {
                let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                let is_pi = group['is_pi'];
                let lifetime = group['lifetime'];

                let groupid = group['id'];
                let facility = group['compute_center'];
                let shortname = group['shortname'];
                if (!shortname) {
                    shortname = group['name']
                }
                let compute_center = null;

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
                    true,
                    compute_center);
                newProject.Lifetime = lifetime;
                newProject.Status = group['status'];
                let expirationDate = undefined;
                if (lifetime != -1) {
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format("DD.MM.YYYY");
                    let lifetimeDays = Math.abs(moment(moment(expirationDate, "DD.MM.YYYY").toDate()).diff(moment(dateCreated), 'days'));

                    newProject.LifetimeDays = lifetimeDays;
                    newProject.DateEnd = expirationDate;
                    newProject.LifetimeReached = this.lifeTimeReached(lifetimeDays, dateDayDifference)

                }

                this.projects.push(newProject);
            }
            this.applyFilter();

            this.isLoaded = true;


        })
    }

    getProjectStatus(project) {
        this.voserice.getProjectStatus(project.Id).subscribe(res => {
            project.Status = res['status']
        })
    }

    setProjectStatus(project, status: number) {
        this.voserice.setProjectStatus(project.Id, status).subscribe(res => {
            this.getProjectStatus(project)

        })
    }


    removeResourceFromGroup(groupid: number) {
        this.voserice.removeResourceFromGroup(groupid.toString()).subscribe(res => {
        })
    }


    getMembesOfTheProject(projectid: number, projectname: string) {
        this.voserice.getVoGroupRichMembers(projectid).subscribe(members => {
                this.usersModalProjectID = projectid;
                this.usersModalProjectName = projectname;
                this.usersModalProjectMembers = new Array();
                for (let member of members) {
                    let member_id = member["id"];
                    let user_id = member["userId"];
                    let fullName = member["firstName"] + " " + member["lastName"];
                    let newMember = new ProjectMember(user_id, fullName, member_id);
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


}
