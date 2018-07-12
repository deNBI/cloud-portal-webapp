import {Component, ViewChild} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {ApplicationsService} from '../api-connector/applications.service'
import {SpecialHardwareService} from '../api-connector/special-hardware.service'
import {ApplicationStatusService} from '../api-connector/application-status.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Application} from "./application.model";
import {ApplicationStatus} from "./application_status.model";
import {SpecialHardware} from "./special_hardware.model";
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {GroupService} from "../api-connector/group.service";
import * as moment from 'moment';
import {UserService} from "../api-connector/user.service";
import {ApplicationExtension} from "./application_extension.model";
import {NgForm} from '@angular/forms';


@Component({
    templateUrl: 'applications.component.html',
    providers: [UserService, GroupService, PerunSettings, ApplicationsService, ApplicationStatusService, SpecialHardwareService, ApiSettings]
})
export class ApplicationsComponent {

    user_applications: Application[] = [];
    is_vo_admin = false;
    all_applications: Application[] = [];
    application_status: ApplicationStatus[] = [];
    all_applications_renewal: ApplicationExtension[] = [];
    special_hardware: SpecialHardware[] = [];
    computeCenters: [string, number][];
    selectedApplication: Application;
    public deleteId: number;

    //notification Modal variables
    public notificationModal;
    public notificationModalTitle: string = "Notification";
    public notificationModalMessage: string = "Please wait...";
    public notificationModalType: string = "info";
    public notificationModalIsClosable: boolean = false;
    private APPROVED_STATUS = 2;
    private EXTENSION_STATUS = 4;
    private EXTENSTION_STATUS_STRING = 'extension requested'
    public FPGA = 1;
    public GPU = 2;


    collapse_status: { [id: string]: boolean } = {};

    constructor(private applicataionsservice: ApplicationsService,
                private applicationstatusservice: ApplicationStatusService,
                private specialhardwareservice: SpecialHardwareService,
                private perunsettings: PerunSettings,
                private userservice: UserService,
                private groupservice: GroupService) {

        this.getUserApplications();
        this.getAllApplications();
        this.getApplicationStatus();
        this.getSpecialHardware();
        this.getComputeCenters();


    }

    getComputeCenters() {
        this.groupservice.getComputeCenters().subscribe(result => {
            this.computeCenters = result;
        })
    }


    setSelectedApplication(application: any) {
        console.log('hier')
        this.selectedApplication = application;
        console.log(this.selectedApplication)
    }

    onSubmit(f: NgForm) {
        let values = {};
        values['project_application_renewal_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
        for (let v in f.controls) {
            if (f.controls[v].value) {
                values[v] = f.controls[v].value;
            }
        }
        values['project_application_id'] = this.selectedApplication.Id;
        this.requestExtension(values);

    }

    ngFormSetDefault(f: NgForm) {
        f.reset({
            project_application_renewal_vms_requested : this.selectedApplication.VMsRequested,
            project_application_renewal_cores_per_vm : this.selectedApplication.CoresPerVM,
            project_application_renewal_ram_per_vm : this.selectedApplication.RamPerVM,
            project_application_renewal_volume_limit: this.selectedApplication.VolumeLimit,
            project_application_renewal_volume_counter: this.selectedApplication.VolumeCounter,
            project_application_renewal_object_storage: this.selectedApplication.ObjectStorage,
            project_application_renewal_comment: this.selectedApplication.Comment,


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
                    a.Shortname = aj["project_application_shortname"];
                    a.Lifetime = aj["project_application_lifetime"];
                    a.DateSubmitted = aj["project_application_date_submitted"];
                    a.Status = aj["project_application_status"]["application_status_name"];
                    a.Description = aj["project_application_description"];
                    a.VMsRequested = aj["project_application_vms_requested"];
                    a.RamPerVM = aj["project_application_ram_per_vm"];
                    a.CoresPerVM = aj["project_application_cores_per_vm"];
                    a.VolumeLimit = aj["project_application_volume_limit"];
                    a.VolumeCounter = aj["project_application_volume_counter"];
                    a.ObjectStorage = aj["project_application_object_storage"];
                    a.SpecialHardware = aj["project_application_special_hardware"];
                    a.OpenStackProject = aj["project_application_openstack_project"];
                    a.Comment = aj["project_application_comment"];
                    if (a.Status.toString() == this.EXTENSTION_STATUS_STRING) {
                        this.applicataionsservice.getApplicationsRenewalRequest(a.Id).subscribe(result => {
                            res = result.json();
                            let r = new ApplicationExtension();


                            r.Id = res['project_application'];
                            r.Lifetime = res['project_application_renewal_lifetime'];
                            r.VolumeLimit = res['project_application_renewal_volume_limit'];
                            r.VolumeCounter = res['project_application_renewal_volume_counter'];
                            r.VMsRequested = res['project_application_renewal_vms_requested'];
                            r.Comment = res['project_application_renewal_comment'];
                            r.CoresPerVM = res['project_application_renewal_cores_per_vm'];
                            r.ObjectStorage = res['project_application_renewal_object_storage'];
                            r.RamPerVM = res['project_application_renewal_ram_per_vm'];
                            r.Comment = res['project_application_renewal_comment'];
                            let special_hardware = [];
                            if (res['project_application_renewal_special_hardware'] != null) {
                                let special_hardware_string = res['project_application_renewal_special_hardware'].toString();

                                for (let c = 0; c < special_hardware_string.length; c++) {
                                    let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                                    special_hardware.push(sh)

                                }

                                r.SpecialHardware = special_hardware;
                            }
                            a.ApplicationExtension = r;
                            this.user_applications.push(a)
                        })

                    }
                    else {
                        this.user_applications.push(a)
                    }


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

    getAllApplicationsExtensions() {

    }

    getAllApplications() {
        //todo check if user is VO Admin
        let user_id: number;
        let admin_vos: {};
        this.userservice
            .getLoggedUser().toPromise()
            .then(userdata => {
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
                                    a.Shortname = aj["project_application_shortname"];
                                    a.Description = aj["project_application_description"];
                                    a.Lifetime = aj["project_application_lifetime"];

                                    a.VMsRequested = aj["project_application_vms_requested"];
                                    a.RamPerVM = aj["project_application_ram_per_vm"];
                                    a.CoresPerVM = aj["project_application_cores_per_vm"];
                                    a.VolumeLimit = aj["project_application_volume_limit"];
                                    a.VolumeCounter = aj["project_application_volume_counter"];

                                    a.ObjectStorage = aj["project_application_object_storage"];
                                    a.SpecialHardware = aj["project_application_special_hardware"];

                                    a.Institute = aj["project_application_institute"];
                                    a.Workgroup = aj["project_application_workgroup"];

                                    a.DateSubmitted = aj["project_application_date_submitted"];
                                    a.DateStatusChanged = aj["project_application_date_status_changed"];
                                    a.User = aj["project_application_user"]["username"];
                                    a.UserEmail = aj["project_application_user"]["email"];
                                    a.Status = aj["project_application_status"];
                                    if (a.Status == this.APPROVED_STATUS) {
                                        a.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(a.DateStatusChanged).getTime())) / (1000 * 3600 * 24));


                                    }

                                    a.Comment = aj["project_application_comment"];
                                    a.OpenStackProject = aj["project_application_openstack_project"];
                                    if (a.Status !== 1) {
                                        if (aj['project_application_perun_id']) {
                                            this.groupservice.getFacilityByGroup(aj['project_application_perun_id']).subscribe(result => {

                                                let details = result['Details'];
                                                let details_array = [];
                                                for (let detail in details) {
                                                    let detail_tuple = [detail, details[detail]];
                                                    details_array.push(detail_tuple);
                                                }

                                                a.ComputecenterDetails = details_array;
                                                a.ComputeCenter = [result['Facility'], result['FacilityID']];

                                                if (a.Status == this.EXTENSION_STATUS) {
                                                    this.applicataionsservice.getApplicationsRenewalRequest(a.Id).subscribe(result => {
                                                        res = result.json()
                                                        let r = new ApplicationExtension();

                                                        r.Id = res['project_application'];
                                                        r.Lifetime = res['project_application_renewal_lifetime'];
                                                        r.VolumeLimit = res['project_application_renewal_volume_limit'];
                                                        r.VolumeCounter = res['project_application_renewal_volume_counter'];
                                                        r.VMsRequested = res['project_application_renewal_vms_requested'];
                                                        r.Comment = res['project_application_renewal_comment'];
                                                        r.CoresPerVM = res['project_application_renewal_cores_per_vm'];
                                                        r.ObjectStorage = res['project_application_renewal_object_storage'];
                                                        r.RamPerVM = res['project_application_renewal_ram_per_vm'];
                                                        r.Comment = res['project_application_renewal_comment'];
                                                        let special_hardware = [];
                                                        if (res['project_application_renewal_special_hardware'] != null) {
                                                            let special_hardware_string = res['project_application_renewal_special_hardware'].toString();

                                                            for (let c = 0; c < special_hardware_string.length; c++) {
                                                                let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                                                                special_hardware.push(sh)

                                                            }

                                                            r.SpecialHardware = special_hardware;
                                                        }
                                                        a.ApplicationExtension = r
                                                        this.all_applications.push(a)
                                                    })

                                                }
                                                else {
                                                    this.all_applications.push((a))
                                                }

                                            })

                                        }
                                    }
                                    else {
                                        a.ComputeCenter = ['None', -1]

                                        if (a.Status == this.EXTENSION_STATUS) {
                                            this.applicataionsservice.getApplicationsRenewalRequest(a.Id).subscribe(result => {
                                                res = result.json()
                                                let r = new ApplicationExtension();

                                                r.Id = res['project_application'];
                                                r.Lifetime = res['project_application_renewal_lifetime'];
                                                r.VolumeLimit = res['project_application_renewal_volume_limit'];
                                                r.VolumeCounter = res['project_application_renewal_volume_counter'];
                                                r.VMsRequested = res['project_application_renewal_vms_requested'];
                                                r.Comment = res['project_application_renewal_comment'];
                                                r.CoresPerVM = res['project_application_renewal_cores_per_vm'];
                                                r.ObjectStorage = res['project_application_renewal_object_storage'];
                                                r.RamPerVM = res['project_application_renewal_ram_per_vm'];
                                                r.Comment = res['project_application_renewal_comment'];
                                                let special_hardware = [];
                                                if (res['project_application_renewal_special_hardware'] != null) {
                                                    let special_hardware_string = res['project_application_renewal_special_hardware'].toString();

                                                    for (let c = 0; c < special_hardware_string.length; c++) {
                                                        let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                                                        special_hardware.push(sh)

                                                    }

                                                    r.SpecialHardware = special_hardware;
                                                }

                                                a.ApplicationExtension = r
                                                this.all_applications.push(a)
                                            })

                                        }
                                        else {
                                            this.all_applications.push((a))
                                        }


                                    }

                                }
                            });
                        break;
                    }
                }

            }
        )
    }


    public requestExtension(data) {

        this.applicataionsservice.requestRenewal(data).subscribe(result => {
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        })


    }

    public approveExtension(application_id: number) {
        console.log('extend')
        this.applicataionsservice.approveRenewal(application_id).subscribe(result => {
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        })
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

    public lifeTimeReached(lifetime: number, running: number, status_changed_string: string): string {
        let status_changed = new Date(status_changed_string);
        let LifetimeDays = Math.ceil(Math.abs(moment(status_changed).add(lifetime, 'months').toDate().getTime() - status_changed.getTime())) / (1000 * 3600 * 24)

        return (LifetimeDays - running) < 0 ? "red" : "black";
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

    public resetNotificationModal() {
        this.notificationModalTitle = "Notification";
        this.notificationModalMessage = "Please wait...";
        this.notificationModalType = "info";
        this.notificationModalIsClosable = false;
    }

    public updateNotificaitonModal(title: string, message: string, closable: true, type: string) {
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    }


    public createGroup(name, description, manager_elixir_id, application_id, compute_center, openstack_project, numberofVms, volumelimit, lifetime, longname, volumecounter) {

        //get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: number;
        let manager_member_user_id: number;
        let new_group_id: number;

        let re = /[-:. ,/]/gi
        let  shortNameDate=name + (new Date(Date.now()).toLocaleString().replace(re,''));
        this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).toPromise()
            .then(member_raw => {
                    let member = member_raw.json();
                    manager_member_id = member["id"];
                    manager_member_user_id = member["userId"];
                    // create new group

                    return this.groupservice.createGroup(shortNameDate, description).toPromise();
                }
            ).then(group_raw => {
            let group = group_raw.json();
            new_group_id = group["id"];

            //add the application user to the group
            return this.groupservice.addMember(new_group_id, manager_member_id, compute_center).toPromise();

        }).then(null_result => {
            return this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center).toPromise();
        }).then(null_result => {
            return this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("approved"), compute_center).toPromise();
        }).then(null_result => {
            //setting approved status for Perun Group
            let APPRVOVED = 2;
            this.groupservice.setPerunGroupStatus(new_group_id, APPRVOVED).toPromise();
            this.groupservice.setdeNBIDirectAcces(new_group_id, openstack_project).toPromise();
            if (compute_center != 'undefined') {
                this.groupservice.assignGroupToResource(new_group_id.toString(), compute_center).subscribe();
            }
            this.groupservice.setShortname(new_group_id.toString(), name).subscribe();
            this.groupservice.setName(new_group_id.toString(), longname).subscribe();
            this.groupservice.setNumberOfVms(new_group_id.toString(), numberofVms.toString()).subscribe();
            this.groupservice.setDescription(new_group_id.toString(), description).subscribe();
            this.groupservice.setLifetime(new_group_id.toString(), lifetime.toString()).subscribe();
            this.groupservice.setPerunId(new_group_id.toString(), application_id).subscribe();
            this.groupservice.setGroupVolumeLimit(new_group_id, volumelimit).subscribe();
            this.groupservice.setGroupVolumeCounter(new_group_id, volumecounter).subscribe();
            //update modal
            this.updateNotificaitonModal("Success", "The new project was created", true, "success");
            //update applications
            this.all_applications = [];
            this.user_applications = [];
            this.getUserApplications();
            this.getAllApplications();
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
                this.getAllApplications();
                this.updateNotificaitonModal("Success", "The Application was declined", true, "success");
            })
            .catch(error => {
                this.updateNotificaitonModal("Failed", "Application could be declined!", true, "danger");
            });
    }

    public deleteApplication(application_id) {
        this.applicataionsservice.deleteApplication(application_id).toPromise()
            .then(result => {
                this.updateNotificaitonModal('Success', 'The application has been successfully removed', true, 'success');
            }).then(result => {
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        })
            .catch(error => {
                this.updateNotificaitonModal("Failed", "Application could not be removed!", true, "danger");
            });
    }

    public activeApplicationsAvailable(): boolean {
        for (let application of this.all_applications) {
            if (application.Status == 1 || application.Status == 4) {
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
