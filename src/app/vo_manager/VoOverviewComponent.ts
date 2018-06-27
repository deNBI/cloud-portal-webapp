import {Component, Input, OnInit} from '@angular/core';
import {VoService} from "../api-connector/vo.service";
import {Project} from "../projectmanagement/project.model";
import {ProjectMember} from "../projectmanagement/project_member.model";
import {GroupService} from "../api-connector/group.service";
import  * as moment from 'moment';

@Component({
    selector: 'voOverview',
    templateUrl: 'voOverview.component.html',
    providers: [VoService, GroupService]


})

export class VoOverviewComponent {

    public emailSubject: string = '';
    public emailReply:string;
    public emailText: string = '';
    public emailStatus: number = 0;
    public newsletterSubscriptionCounter: number;

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

    sendMailToVo(subject: string, message: string,reply?:string) {
        this.voserice.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message),encodeURIComponent(reply)).subscribe(result => {
            if (result == 1) {
                this.emailStatus = 1;
            }
            else {
                this.emailStatus = 2;
            }
        })

    }


    public resetEmailModal() {

        this.emailSubject = '';
        this.emailText = '';
        this.emailReply=null;
        this.emailStatus = 0;

    }


    getVoProjects() {
        this.voserice.getAllVoGroups().subscribe(result => {
            for (let group of result) {
                this.groupservice.getShortame(group['id']).subscribe(name => {

                    let shortname = name['shortname']
                    if (!shortname) {
                        shortname = group['name']
                    }

                    let dateCreated = new Date(group["createdAt"]);
                    let dateDayDifference = Math.ceil((Math.abs(Date.now() - dateCreated.getTime())) / (1000 * 3600 * 24));
                    let is_pi = false;
                    let is_admin = false;
                    let newProject = new Project(
                        group["id"],
                        shortname,
                        group["description"],
                        dateCreated.getDate() + "." + (dateCreated.getMonth() + 1) + "." + dateCreated.getFullYear(),
                        dateDayDifference,
                        is_pi,
                        is_admin,
                        [result['Facility'], result['FacilityId']]
                    )
                     newProject.Lifetime = group['lifetime']
                    if (newProject.Lifetime != -1){
                    newProject.LifetimeDays=Math.ceil(Math.abs(moment(dateCreated).add(newProject.Lifetime,'months').toDate().getTime()-dateCreated.getTime()))/(1000*3600*24)

                        }
                        else{
                        newProject.LifetimeDays=-1;
                    }
                        this.projects.push(newProject);
                })
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
