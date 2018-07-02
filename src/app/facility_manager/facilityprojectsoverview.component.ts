import {Component, Input, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Project} from '../projectmanagement/project.model';
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {ProjectMember} from '../projectmanagement/project_member.model'
import 'rxjs/add/operator/toPromise';
import {environment} from '../../environments/environment'
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";
import {UserService} from "../api-connector/user.service";
import {FacilityService} from "../api-connector/facility.service";
import {FormsModule} from '@angular/forms';
import  * as moment from 'moment';

@Component({
    templateUrl: 'facilityprojectsoverview.component.html',
    providers: [FacilityService,UserService, GroupService,  PerunSettings, ApiSettings]
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

    public emailSubject: string ;
    public emailText: string;
    public emailStatus: number = 0;
    public emailReply:string='';

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

    lifeTimeReached(lifetime:number,running:number):string{

        if (lifetime == -1){
            return "blue";
        }
       return (lifetime - running) < 0 ? "red" :"black";
    }
    sendMailToFacility(facility: number,subject:string,message:string,reply?:string){
        this.facilityservice.sendMailToFacility(facility, encodeURIComponent(subject), encodeURIComponent(message),encodeURIComponent(reply)).subscribe(result =>{
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

      this.emailSubject=null ;
      this.emailText=null ;
      this.emailReply=null
      this.emailStatus = 0;

    }




    public comingSoon() {
        alert("This function will be implemented soon.")
    }
}
