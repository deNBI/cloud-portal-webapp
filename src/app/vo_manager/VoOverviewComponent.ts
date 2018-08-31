import ***REMOVED***Component, Input, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";
import ***REMOVED***Project***REMOVED*** from "../projectmanagement/project.model";
import ***REMOVED***ProjectMember***REMOVED*** from "../projectmanagement/project_member.model";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import * as moment from 'moment';

@Component(***REMOVED***
    selector: 'voOverview',
    templateUrl: 'voOverview.component.html',
    providers: [VoService, GroupService]


***REMOVED***)

export class VoOverviewComponent ***REMOVED***

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


    constructor(private voserice: VoService, private groupservice: GroupService) ***REMOVED***
        this.getVoProjects();
        this.voserice.getNewsletterSubscriptionCounter().subscribe(result => ***REMOVED***
            this.newsletterSubscriptionCounter = result['subscribed'];
        ***REMOVED***);


    ***REMOVED***


    sendEmail(subject: string, message: string, reply?: string) ***REMOVED***
        switch (this.emailType) ***REMOVED***
            case 0: ***REMOVED***
                this.sendMailToVo(subject, message, reply);
                break;
            ***REMOVED***
            case 1: ***REMOVED***
                this.sendNewsletterToVo(subject, message, reply);
                break;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

    sendNewsletterToVo(subject: string, message: string, reply?: string) ***REMOVED***
        this.voserice.sendNewsletterToVo(encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => ***REMOVED***
            if (result == 1) ***REMOVED***
                this.emailStatus = 1;
            ***REMOVED***
            else ***REMOVED***
                this.emailStatus = 2;
            ***REMOVED***
        ***REMOVED***)

    ***REMOVED***


    sendMailToVo(subject: string, message: string, reply?: string) ***REMOVED***
        this.voserice.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => ***REMOVED***
            if (result == 1) ***REMOVED***
                this.emailStatus = 1;
            ***REMOVED***
            else ***REMOVED***
                this.emailStatus = 2;
            ***REMOVED***
        ***REMOVED***)

    ***REMOVED***

    setEmailType(type: number) ***REMOVED***
        this.emailType = type;
        switch (this.emailType) ***REMOVED***
            case 0: ***REMOVED***
                this.emailHeader = 'Send email to all members of\n' +
                    '                    the vo';
                this.emailVerify = 'Are you sure you want to send this email to all members of the vo?';
                break;
            ***REMOVED***
            case 1: ***REMOVED***
                this.emailHeader = 'Send newsletter to vo';
                this.emailVerify = 'Are you sure you want to send this newsletter?'
                break;
            ***REMOVED***

        ***REMOVED***

    ***REMOVED***

    public resetEmailModal() ***REMOVED***


        this.emailHeader = null;
        this.emailSubject = null;
        this.emailText = null;
        this.emailType = null;
        this.emailVerify = null;
        this.emailReply = '';
        this.emailStatus = 0;

    ***REMOVED***


    getVoProjects() ***REMOVED***
        this.voserice.getAllGroupsWithDetails().subscribe(result => ***REMOVED***
            let vo_projects = result;
            for (let key in vo_projects) ***REMOVED***
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
                if (lifetime != -1) ***REMOVED***
                    lifetimeDays = Math.ceil(Math.ceil(Math.abs(moment(dateCreated).add(lifetime, 'months').toDate().getTime() - moment(dateCreated).valueOf())) / (1000 * 3600 * 24));
                    expirationDate = moment(dateCreated).add(lifetime, 'months').toDate();
                ***REMOVED***
                for (let detail in details) ***REMOVED***
                    let detail_tuple = [detail, details[detail]];
                    details_array.push(detail_tuple);
                ***REMOVED***
                //check if user is a PI (group manager)

                if (!shortname) ***REMOVED***
                    shortname = group['name']
                ***REMOVED***

                let newProject = new Project(
                    Number(groupid),
                    shortname,
                    group["description"],
                    dateCreated.date() + "." + (dateCreated.month() + 1) + "." + dateCreated.year(),
                    dateDayDifference,
                    is_pi,
                    true,
                    [facility['Facility'], facility['FacilityId']]);
                newProject.ComputecenterDetails = details_array;
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


    lifeTimeReached(lifetimeDays: number, running: number): string ***REMOVED***

        if (lifetimeDays == -1) ***REMOVED***
            return "blue";
        ***REMOVED***
        return (lifetimeDays - running) < 0 ? "red" : "black";
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


***REMOVED***
