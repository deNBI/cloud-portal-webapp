import ***REMOVED***Component, Input, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";
import ***REMOVED***Project***REMOVED*** from "../projectmanagement/project.model";
import ***REMOVED***ProjectMember***REMOVED*** from "../projectmanagement/project_member.model";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";


@Component(***REMOVED***
  selector: 'voOverview',
  templateUrl: 'voOverview.component.html',
    providers:[VoService,GroupService]


***REMOVED***)

export class VoOverviewComponent ***REMOVED***

    public emailSubject: string = '';
    public emailText: string = '';
    public emailStatus: number = 0;
    public newsletterSubscriptionCounter:number;

    member_id: number;
    projects: Project[] = new Array();


    // modal variables for User list
    public usersModal;
    public usersModalProjectMembers: ProjectMember[] = new Array;
    public usersModalProjectID: number;
    public usersModalProjectName: string;


    public managerFacilities: [string,number][];
    public selectedFacility: [string,number]








    constructor(private voserice:VoService,private groupservice:GroupService) ***REMOVED***
    this.getVoProjects();
       this.voserice.getNewsletterSubscriptionCounter().subscribe(result => ***REMOVED***
            this.newsletterSubscriptionCounter=result['subscribed'];***REMOVED***);


    ***REMOVED***

     sendMailToVo(subject:string,message:string)***REMOVED***
        this.voserice.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message)).subscribe(result =>***REMOVED***
            if (result == 1)***REMOVED***
                this.emailStatus = 1;
            ***REMOVED***
            else ***REMOVED***
                this.emailStatus = 2;
            ***REMOVED***
            ***REMOVED***)

    ***REMOVED***


     public resetEmailModal() ***REMOVED***

      this.emailSubject = '';
      this.emailText = '';
      this.emailStatus = 0;

    ***REMOVED***


    getVoProjects() ***REMOVED***

        this.voserice.getAllVoGroups().subscribe(result => ***REMOVED***
            for (let group of result) ***REMOVED***
                let dateCreated = new Date(group["createdAt"]);
                let dateDayDifference = Math.ceil((Math.abs(Date.now() - dateCreated.getTime())) / (1000 * 3600 * 24));
                let is_pi = false;
                let is_admin = false;
                let newProject = new Project(
                    group["id"],
                    group["name"],
                    group["description"],
                    dateCreated.getDate() + "." + (dateCreated.getMonth() + 1) + "." + dateCreated.getFullYear(),
                    dateDayDifference,
                    is_pi,
                    is_admin,
                    [result['Facility'], result['FacilityId']]
                    )
                newProject.Lifetime=group['lifetime']
                 this.projects.push(newProject);
            ***REMOVED***



        ***REMOVED***)


    ***REMOVED***

    lifeTimeReached(lifetime:number,running:number):string***REMOVED***
        console.log(lifetime)
        if (lifetime == -1)***REMOVED***
            return "blue";
        ***REMOVED***
       return (lifetime * 30 - running) < 0 ? "red" :"black";
    ***REMOVED***

    getMembesOfTheProject(projectid: number, projectname: string) ***REMOVED***
        this.groupservice.getGroupMembers(projectid.toString()).subscribe(members => ***REMOVED***
            this.usersModalProjectID = projectid;
            this.usersModalProjectName = projectname;
            this.usersModalProjectMembers = new Array();
            for (let member of members) ***REMOVED***
                let member_id = member["id"];
                let user_id = member["userId"];
                let fullName = member["user"]["firstName"] + " " + member["user"]["lastName"];
                this.usersModalProjectMembers.push(new ProjectMember(user_id, fullName, member_id));
            ***REMOVED***

        ***REMOVED***
            )
    ***REMOVED***

    public showMembersOfTheProject(projectid: number, projectname: string, facility: [string,number]) ***REMOVED***
        this.getMembesOfTheProject(projectid, projectname);

    ***REMOVED***





***REMOVED***
