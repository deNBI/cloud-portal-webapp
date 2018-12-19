import ***REMOVED***Component, Input, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";
import ***REMOVED***Project***REMOVED*** from "../projectmanagement/project.model";
import ***REMOVED***ProjectMember***REMOVED*** from "../projectmanagement/project_member.model";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import * as moment from 'moment';
import ***REMOVED***ComputecenterComponent***REMOVED*** from "../projectmanagement/computecenter.component";
import ***REMOVED***Application***REMOVED*** from "../applications/application.model";
import ***REMOVED***AbstractBaseClasse***REMOVED*** from "../shared_modules/baseClass/abstract-base-class";
import ***REMOVED***FilterBaseClass***REMOVED*** from "../shared_modules/baseClass/filter-base-class";

@Component(***REMOVED***
    selector: 'voOverview',
    templateUrl: 'voOverview.component.html',
    providers: [VoService, GroupService]


***REMOVED***)

export class VoOverviewComponent extends FilterBaseClass ***REMOVED***

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


    constructor(private voserice: VoService, private groupservice: GroupService) ***REMOVED***
        super();
        this.getVoProjects();
        this.voserice.getNewsletterSubscriptionCounter().subscribe(result => ***REMOVED***
            this.newsletterSubscriptionCounter = result['subscribed'];
        ***REMOVED***);


    ***REMOVED***

    applyFilter() ***REMOVED***


        this.projects_filtered = this.projects.filter(vm => this.checkFilter(vm));

    ***REMOVED***

    checkFilter(project: Project) ***REMOVED***
        if (this.isFilterProjectStatus(project.Status, project.LifetimeReached) && this.isFilterProjectName(project.Name) && this.isFilterProjectId(project.Id)) ***REMOVED***
            return true
        ***REMOVED***
        else ***REMOVED***
            return false
        ***REMOVED***


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


    getVoProjects() ***REMOVED***
        this.voserice.getAllGroupsWithDetails().subscribe(result => ***REMOVED***
            let vo_projects = result;
            for (let group of vo_projects) ***REMOVED***
                let dateCreated = moment(group['createdAt'], "YYYY-MM-DD HH:mm:ss.SSS");
                let dateDayDifference = Math.ceil(moment().diff(dateCreated, 'days', true));
                let is_pi = group['is_pi'];
                let lifetime = group['lifetime'];

                let groupid = group['id'];
                let facility = group['compute_center'];
                let shortname = group['shortname'];
                if (!shortname) ***REMOVED***
                    shortname = group['name']
                ***REMOVED***
                let compute_center = null;

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
                    true,
                    compute_center);
                newProject.Lifetime = lifetime;
                newProject.Status = group['status'];
                let expirationDate = undefined;
                if (lifetime != -1) ***REMOVED***
                    expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format("DD.MM.YYYY");
                    let lifetimeDays = Math.abs(moment(moment(expirationDate, "DD.MM.YYYY").toDate()).diff(moment(dateCreated), 'days'));

                    newProject.LifetimeDays = lifetimeDays;
                    newProject.DateEnd = expirationDate;
                    newProject.LifetimeReached = this.lifeTimeReached(lifetimeDays, dateDayDifference)

                ***REMOVED***

                this.projects.push(newProject);
            ***REMOVED***
            this.applyFilter();

            this.isLoaded = true;


        ***REMOVED***)
    ***REMOVED***

    getProjectStatus(project) ***REMOVED***
        this.voserice.getProjectStatus(project.Id).subscribe(res => ***REMOVED***
            project.Status = res['status']
        ***REMOVED***)
    ***REMOVED***

    setProjectStatus(project, status: number) ***REMOVED***
        this.voserice.setProjectStatus(project.Id, status).subscribe(res => ***REMOVED***
            this.getProjectStatus(project)

        ***REMOVED***)
    ***REMOVED***


    removeResourceFromGroup(groupid: number) ***REMOVED***
        this.voserice.removeResourceFromGroup(groupid.toString()).subscribe(res => ***REMOVED***
        ***REMOVED***)
    ***REMOVED***


    getMembesOfTheProject(projectid: number, projectname: string) ***REMOVED***
        this.voserice.getVoGroupRichMembers(projectid).subscribe(members => ***REMOVED***
                this.usersModalProjectID = projectid;
                this.usersModalProjectName = projectname;
                this.usersModalProjectMembers = new Array();
                for (let member of members) ***REMOVED***
                    let member_id = member["id"];
                    let user_id = member["userId"];
                    let fullName = member["firstName"] + " " + member["lastName"];
                    let newMember = new ProjectMember(user_id, fullName, member_id);
                    newMember.ElixirId = member['elixirId'];
                    newMember.Email = member['email'];
                    this.usersModalProjectMembers.push(newMember);
                ***REMOVED***

            ***REMOVED***
        )
    ***REMOVED***

    public showMembersOfTheProject(projectid: number, projectname: string, facility: [string, number]) ***REMOVED***
        this.getMembesOfTheProject(projectid, projectname);

    ***REMOVED***


***REMOVED***
