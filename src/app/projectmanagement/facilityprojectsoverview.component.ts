import ***REMOVED***Component, Input, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***AuthzResolver***REMOVED*** from '../perun-connector/authz-resolver.service'
import ***REMOVED***GroupsManager***REMOVED*** from '../perun-connector/groups-manager.service'
import ***REMOVED***MembersManager***REMOVED*** from '../perun-connector/members-manager.service'
import ***REMOVED***UsersManager***REMOVED*** from '../perun-connector/users-manager.service'
import ***REMOVED***Http***REMOVED*** from '@angular/http';
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***Project***REMOVED*** from './project.model';
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';
import ***REMOVED***ProjectMember***REMOVED*** from './project_member.model'
import ***REMOVED***ResourcesManager***REMOVED*** from "../perun-connector/resources_manager";
import 'rxjs/add/operator/toPromise';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***FacilityService***REMOVED*** from "../api-connector/facility.service";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';

@Component(***REMOVED***
    templateUrl: 'facilityprojectsoverview.component.html',
    providers: [FacilityService,UserService, GroupService, ResourcesManager, AuthzResolver, GroupsManager, MembersManager, UsersManager, PerunSettings, ApiSettings]
***REMOVED***)
export class  FacilityProjectsOverviewComponent ***REMOVED***

    debug_module = false;

    @Input() voRegistrationLink: string = environment.voRegistrationLink;

    member_id: number;
    projects: Project[] = new Array();


    // modal variables for User list
    public usersModal;
    public usersModalProjectMembers: ProjectMember[] = new Array;
    public usersModalProjectID: number;
    public usersModalProjectName: string;

    public emailSubject: string = '';
    public emailText: string = '';

    public managerFacilities: [string,number][];
    public selectedFacility: [string,number]





    constructor(
                private groupservice: GroupService,
                private  facilityservice :FacilityService) ***REMOVED***

        this.facilityservice.getManagerFacilities().subscribe(result => ***REMOVED***
                this.managerFacilities=result
                this.selectedFacility=this.managerFacilities[0]
                this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])

        ***REMOVED***)
    ***REMOVED***


    onChangeSelectedFacility(value)***REMOVED***
        this.getFacilityProjects(this.selectedFacility['FacilityId'])
    ***REMOVED***
    getFacilityProjects(facility) ***REMOVED***

        this.facilityservice.getFacilityAllowedGroups(facility).subscribe(result => ***REMOVED***
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
                 this.projects.push(newProject);
            ***REMOVED***



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
                let fullName = member["user"]["firstName"] + " " + member["user"]["lastName"];
                this.usersModalProjectMembers.push(new ProjectMember(user_id, fullName, member_id));
            ***REMOVED***

        ***REMOVED***
            )
    ***REMOVED***

    public showMembersOfTheProject(projectid: number, projectname: string, facility: [string,number]) ***REMOVED***
        this.getMembesOfTheProject(projectid, projectname);

    ***REMOVED***


    public comingSoon() ***REMOVED***
        alert("This function will be implemented soon.")
    ***REMOVED***
***REMOVED***
