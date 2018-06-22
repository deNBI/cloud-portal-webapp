import {Component, ViewChild} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {ApplicationsService} from '../api-connector/applications.service'
import {SpecialHardwareService} from '../api-connector/special-hardware.service'
import {ApplicationStatusService} from '../api-connector/application-status.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {UsersManager} from '../perun-connector/users-manager.service'
import {MembersManager} from '../perun-connector/members-manager.service'
import {GroupsManager} from '../perun-connector/groups-manager.service'
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Application} from "./application.model";
import {ApplicationStatus} from "./application_status.model";
import {SpecialHardware} from "./special_hardware.model";
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {GroupService} from "../api-connector/group.service";
import  * as moment from 'moment';
import {UserService} from "../api-connector/user.service";


@Component({
    templateUrl: 'applications.component.html',
    providers: [UserService,GroupService, UsersManager, MembersManager, GroupsManager, PerunSettings, ApplicationsService, ApplicationStatusService, SpecialHardwareService, ApiSettings]
})
export class ApplicationsComponent {

    user_applications: Application[] = [];
    is_vo_admin = false;
    all_applications: Application[] = [];
    application_status: ApplicationStatus[] = [];
    special_hardware: SpecialHardware[] = [];
    computeCenters: [string,number][];
    public deleteId: number;

    //notification Modal variables
    public notificationModal;
    public notificationModalTitle: string = "Notification";
    public notificationModalMessage: string = "Please wait...";
    public notificationModalType: string = "info";
    public notificationModalIsClosable: boolean = false;
    private APPROVED_STATUS=2;


    collapse_status: { [id: string]: boolean } = {};

    constructor(private applicataionsservice: ApplicationsService,
                private applicationstatusservice: ApplicationStatusService,
                private specialhardwareservice: SpecialHardwareService,
                private perunsettings: PerunSettings,
                private groupsmanager: GroupsManager,
                private usersmanager: UsersManager,
                private membersmanager: MembersManager,
                private userservice:UserService,
                private groupservice: GroupService) {

        this.getUserApplications();
        this.getAllApplications(usersmanager);
        this.getApplicationStatus();
        this.getSpecialHardware();
        this.getComputeCenters();


    }

    getComputeCenters() {
        this.groupservice.getComputeCenters().subscribe(result => {
            this.computeCenters = result;
        })
    }

    getUserApplications() {
        this.applicataionsservice
            .getUserApplications().toPromise()
            .then(result => {
                let res = result.json();
                for (let key in res) {
                    let aj = res[key];
                    let a = new Application();
                    a.Id = aj["project_application_id"];
                    a.Name = aj["project_application_name"];
                    a.Shortname=aj["project_application_shortname"];
                    a.Lifetime = aj["project_application_lifetime"];
                    a.DateSubmitted = aj["project_application_date_submitted"];
                    a.Status = aj["project_application_status"]["application_status_name"];
                    a.Description = aj["project_application_description"];
                    a.VMsRequested = aj["project_application_vms_requested"];
                    a.RamPerVM = aj["project_application_ram_per_vm"];
                    a.CoresPerVM = aj["project_application_cores_per_vm"];
                    a.DiskSpace = aj["project_application_disk_space"];
                    a.ObjectStorage = aj["project_application_object_storage"];
                    a.SpecialHardware = aj["project_application_special_hardware"];
                    a.OpenStackProject = aj["project_application_openstack_project"];
                    a.Comment= aj["project_application_comment"];

                    this.user_applications.push(a)
                }
            });
    }

    getApplicationStatus() {
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then(result => {
                let res = result.json();
                for (let key in res) {
                    let asj = res[key];
                    let aj = new ApplicationStatus(asj["application_status_id"], asj["application_status_name"]);
                    this.application_status.push(aj)
                }
            });
    }

    getSpecialHardware() {
        this.specialhardwareservice.getAllSpecialHardware().toPromise()
            .then(result => {
                let res = result.json();
                for (let key in res) {
                    let shj = res[key];
                    let sh = new SpecialHardware(shj["special_hardware_id"], shj["special_hardware_key"], shj["special_hardware_name"]);
                    this.special_hardware.push(sh)
                }
            });
    }

    getAllApplications(usersmanager: UsersManager) {
        //todo check if user is VO Admin
        let user_id: number;
        let admin_vos: {};

        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) {
                //TODO catch errors
                user_id = userdata.json()["id"];
                return this.userservice.getVosWhereUserIsAdmin(user_id).toPromise();
            }).then(function (adminvos) {
            admin_vos = adminvos.json();
        }).then(result => {
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in admin_vos) {
                if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
                    this.is_vo_admin = true;
                    this.applicataionsservice
                        .getAllApplications().toPromise()
                        .then(result => {
                            let res = result.json();
                            for (let key in res) {
                                let aj = res[key];
                                let a = new Application();
                                a.Id = aj["project_application_id"];

                                a.Name = aj["project_application_name"];
                                a.Shortname=aj["project_application_shortname"];
                                a.Description = aj["project_application_description"];
                                a.Lifetime = aj["project_application_lifetime"];

                                a.VMsRequested = aj["project_application_vms_requested"];
                                a.RamPerVM = aj["project_application_ram_per_vm"];
                                a.CoresPerVM = aj["project_application_cores_per_vm"];
                                a.DiskSpace = aj["project_application_disk_space"];
                                a.ObjectStorage = aj["project_application_object_storage"];
                                a.SpecialHardware = aj["project_application_special_hardware"];

                                a.Institute = aj["project_application_institute"];
                                a.Workgroup = aj["project_application_workgroup"];

                                a.DateSubmitted = aj["project_application_date_submitted"];
                                a.DateStatusChanged = aj["project_application_date_status_changed"];
                                a.User = aj["project_application_user"]["username"];
                                a.UserEmail = aj["project_application_user"]["email"];
                                a.Status = aj["project_application_status"];
                                if (a.Status==this.APPROVED_STATUS){
                                    a.DaysRunning=Math.ceil((Math.abs(Date.now() - new Date(a.DateStatusChanged).getTime())) / (1000 * 3600 * 24));


                                }
                                a.Comment= aj["project_application_comment"];
                                a.OpenStackProject = aj["project_application_openstack_project"];
                                if (a.Status !== 1) {
                                    if (a.Shortname){
                                    this.groupservice.getFacilityByGroup(a.Shortname).subscribe(result => {

                                        let details = result['Details'];
                                        let details_array = [];
                                        for (let detail in details) {
                                            let detail_tuple = [detail, details[detail]];
                                            details_array.push(detail_tuple);
                                        }

                                        a.ComputecenterDetails = details_array;
                                        a.ComputeCenter = [result['Facility'],result['FacilityID']];

                                        this.all_applications.push(a)

                                    })}
                                    else {
                                         this.groupservice.getFacilityByGroup(a.Name).subscribe(result => {

                                        let details = result['Details'];
                                        let details_array = [];
                                        for (let detail in details) {
                                            let detail_tuple = [detail, details[detail]];
                                            details_array.push(detail_tuple);
                                        }

                                        a.ComputecenterDetails = details_array;
                                        a.ComputeCenter = [result['Facility'],result['FacilityID']];

                                        this.all_applications.push(a)

                                    })

                                    }
                                }
                                else {
                                    a.ComputeCenter = ['None',-1]

                                    this.all_applications.push(a)

                                }
                            }
                        });
                    break;
                }
            }
        });
    }

    public getCollapseStatus(id: string) {
        if (id in this.collapse_status) {
            return this.collapse_status[id];
        } else {
            this.collapse_status[id] = true;
            return true;
        }
    }

    public switchCollapseStatus(id: string) {
        this.collapse_status[id] = !this.getCollapseStatus(id);
    }


    public getStatusById(id: number): string {
        let s = "Unknown";
        for (let status of this.application_status) {
            if (status.Id == id) {
                return status.Name;
            }
        }
        return s;
    }

    public lifeTimeReached(lifetime:number,running:number,status_changed_string:string):string{
       let status_changed=new Date(status_changed_string);
      let LifetimeDays = Math.ceil(Math.abs(moment(status_changed).add(lifetime, 'months').toDate().getTime() - status_changed.getTime())) / (1000 * 3600 * 24)

       return (LifetimeDays  - running) < 0 ? "red" :"black";
    }

    public getIdByStatus(name: string): number {
        let s = -1;
        for (let status of this.application_status) {
            if (status.Name == name) {
                return status.Id;
            }
        }
        return s;
    }

    public resetNotificationModal(){
        this.notificationModalTitle= "Notification";
        this.notificationModalMessage="Please wait...";
        this.notificationModalType = "info";
        this.notificationModalIsClosable = false;
    }
    public updateNotificaitonModal(title: string, message: string, closable: true, type: string) {
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    }


    public createGroup(name, description, manager_elixir_id, application_id, compute_center, openstack_project,numberofVms,diskspace,lifetime,longname) {

        //get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: number;
        let manager_member_user_id: number;
        let new_group_id: number;
        let re = /[-:. ,]/gi
        let  shortNameDate=name + (new Date(Date.now()).toLocaleString().replace(re,''))
        this.membersmanager.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).toPromise()
            .then(member_raw => {
                    let member = member_raw.json();
                    manager_member_id = member["id"];
                    manager_member_user_id = member["userId"];
                    // create new group

                    return this.groupsmanager.createGroup(shortNameDate, description).toPromise();
                }
            ).then(group_raw => {
            let group = group_raw.json();
            new_group_id = group["id"];

            //add the application user to the group
            return this.groupsmanager.addMember(new_group_id, manager_member_id).toPromise();

        }).then(null_result => {
            return this.groupsmanager.addAdmin(new_group_id, manager_member_user_id).toPromise();
        }).then(null_result => {
            return this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("approved"), compute_center).toPromise();
        }).then(null_result => {
            //setting approved status for Perun Group
            this.groupsmanager.setPerunGroupStatus(new_group_id, 2).toPromise();
            this.groupsmanager.setdeNBIDirectAcces(new_group_id, openstack_project).toPromise();
            if (compute_center != 'undefined'){
            this.groupservice.assignGroupToResource(new_group_id.toString(), compute_center).subscribe();}
            this.groupservice.setShortname(new_group_id.toString(),name).subscribe();
            this.groupservice.setName(new_group_id.toString(),longname).subscribe();
            this.groupservice.setNumberOfVms(new_group_id.toString(),numberofVms.toString()).subscribe();
            this.groupservice.setDescription(new_group_id.toString(),description).subscribe();
            this.groupservice.setLifetime(new_group_id.toString(),lifetime.toString()).subscribe();
            this.groupservice.setPerunId(new_group_id.toString(),application_id).subscribe();
            this.groupsmanager.setGroupDiskSpace(new_group_id,diskspace,numberofVms).subscribe();
            //update modal
            this.updateNotificaitonModal("Success", "The new project was created", true, "success");
            //update applications
            this.all_applications = [];
            this.user_applications = [];
            this.getUserApplications();
            this.getAllApplications(this.usersmanager);
        }).catch(error => {
            this.updateNotificaitonModal("Failed", "Project could not be created!", true, "danger");
        });

    }

    public declineApplication(application_id) {
        this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("declined"), '').toPromise()
            .then(result => {
                this.all_applications = [];
                this.user_applications = [];
                this.getUserApplications();
                this.getAllApplications(this.usersmanager);
                this.updateNotificaitonModal("Success", "The Application was declined", true, "success");
            })
            .catch(error => {
                this.updateNotificaitonModal("Failed", "Application could be declined!", true, "danger");
            });
    }

    public deleteApplication(application_id){
      this.applicataionsservice.deleteApplication(application_id).toPromise()
          .then(result => {
                    this.updateNotificaitonModal('Success', 'The application has been successfully removed', true, 'success');
                }).then(  result => {
                  this.user_applications=[];
                  this.all_applications=[];
                  this.getUserApplications();
                  this.getAllApplications(this.usersmanager);
      })
        .catch(error => {
                this.updateNotificaitonModal("Failed", "Application could not be removed!", true, "danger");
            });
    }

    public activeApplicationsAvailable(): boolean {
      for (let application of this.all_applications) {
        if (application.Status == 1) {
          return true;
        }
      }
    }


      public setDeleteId(applicationId) {
        this.deleteId = applicationId;
    }





    public comingSoon() {
        alert("This functinality will be implemented soon!")
    }


}
