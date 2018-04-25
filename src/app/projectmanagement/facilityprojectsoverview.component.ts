import {Component, Input, ViewChild} from '@angular/core';
import {AuthzResolver} from '../perun-connector/authz-resolver.service'
import {GroupsManager} from '../perun-connector/groups-manager.service'
import {MembersManager} from '../perun-connector/members-manager.service'
import {UsersManager} from '../perun-connector/users-manager.service'
import {Http} from '@angular/http';
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Project} from './project.model';
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {ProjectMember} from './project_member.model'
import {ResourcesManager} from "../perun-connector/resources_manager";
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment'
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";
import {UserService} from "../api-connector/user.service";
import {FacilityService} from "../api-connector/facility.service";
import {FormsModule} from '@angular/forms';

@Component({
    templateUrl: 'facilityprojectsoverview.component.html',
    providers: [FacilityService,UserService, GroupService, ResourcesManager, AuthzResolver, GroupsManager, MembersManager, UsersManager, PerunSettings, ApiSettings]
})
export class  FacilityProjectsOverviewComponent {

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
    public emailStatus: number = 0;

    public managerFacilities: [string,number][];
    public selectedFacility: [string,number]





    constructor(
                private groupservice: GroupService,
                private  facilityservice :FacilityService) {

        this.facilityservice.getManagerFacilities().subscribe(result => {
                this.managerFacilities=result
                this.selectedFacility=this.managerFacilities[0]
                this.getFacilityProjects(this.managerFacilities[0]['FacilityId'])

        })
    }


    onChangeSelectedFacility(value){
        this.getFacilityProjects(this.selectedFacility['FacilityId'])
    }
    getFacilityProjects(facility) {

        this.facilityservice.getFacilityAllowedGroups(facility).subscribe(result => {
            for (let group of result) {
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
            }



        })


    }


    sendMailToFacility(facility: number,subject:string,message:string){
        this.facilityservice.sendMailToFacility(facility, encodeURIComponent(subject), encodeURIComponent(message)).subscribe(result =>{
            if (result == 1){
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

    public showMembersOfTheProject(projectid: number, projectname: string, facility: [string,number]) {
        this.getMembesOfTheProject(projectid, projectname);

    }

    public resetEmailModal() {

      this.emailSubject = '';
      this.emailText = '';
      this.emailStatus = 0;
    }


    public comingSoon() {
        alert("This function will be implemented soon.")
    }
}
