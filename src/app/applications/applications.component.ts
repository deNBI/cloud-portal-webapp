import {Component, ViewChild} from '@angular/core';
import {ApplicationsService} from '../api-connector/applications.service'
import {SpecialHardwareService} from '../api-connector/special-hardware.service'
import {ApplicationStatusService} from '../api-connector/application-status.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Application} from "./application.model";
import {ApplicationStatus} from "./application_status.model";
import {SpecialHardware} from "./special_hardware.model";
import {ModalDirective} from "ngx-bootstrap";
import {ResourcesManager} from "../perun-connector/resources_manager";
import {GroupService} from "../api-connector/group.service";
import * as moment from 'moment';
import {UserService} from "../api-connector/user.service";
import {ApplicationExtension} from "./application_extension.model";
import {NgForm} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {VoService} from "../api-connector/vo.service";

@Component({
    templateUrl: 'applications.component.html',
    providers: [VoService, UserService, GroupService, PerunSettings, ApplicationStatusService, ApplicationsService, SpecialHardwareService, ApiSettings]
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
    extension_status = 0;
    public deleteId: number;
    isLoaded_userApplication = false;
    isLoaded_AllApplication = false;


    //notification Modal variables
    public notificationModal;
    public notificationModalTitle: string = "Notification";
    public notificationModalMessage: string = "Please wait...";
    public notificationModalType: string = "info";
    public notificationModalIsClosable: boolean = false;
    private APPROVED_STATUS = 2;
    private EXTENSION_STATUS = 4;
    private EXTENSTION_STATUS_STRING = 'modification requested';
    public FPGA = 1;
    public GPU = 2;

    collapse_status: { [id: string]: boolean } = {};

    constructor(private applicataionsservice: ApplicationsService,
                private applicationstatusservice: ApplicationStatusService,
                private specialhardwareservice: SpecialHardwareService,
                private perunsettings: PerunSettings,
                private userservice: UserService,
                private groupservice: GroupService,
                private voService: VoService) {
        this.groupservice.getGroupApplications(10599).subscribe();
        this.groupservice.rejectGroupApplication(10599,22367).subscribe()

        this.getUserApplications();
        this.getAllApplications();
        this.getApplicationStatus();
        this.getSpecialHardware();
        this.getComputeCenters()


    }

    getComputeCenters() {
        this.groupservice.getComputeCenters().subscribe(result => {
            this.computeCenters = result;

        })
    }


    setSelectedApplication(application: any) {
        this.selectedApplication = application;
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
            project_application_renewal_vms_requested: this.selectedApplication.VMsRequested,
            project_application_renewal_cores_per_vm: this.selectedApplication.CoresPerVM,
            project_application_renewal_ram_per_vm: this.selectedApplication.RamPerVM,
            project_application_renewal_volume_limit: this.selectedApplication.VolumeLimit,
            project_application_renewal_volume_counter: this.selectedApplication.VolumeCounter,
            project_application_renewal_object_storage: this.selectedApplication.ObjectStorage,
            project_application_renewal_comment: this.selectedApplication.Comment,


        })

    }

    getUserApplications() {
        this.applicataionsservice
            .getUserApplications().subscribe(result => {
            let res = result;
            if (Object.keys(res).length == 0) {
                this.isLoaded_userApplication = true;
            }
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
                if (aj['projectapplicationrenewal']) {
                    let r = new ApplicationExtension();

                    r.Id = aj['projectapplicationrenewal']['project_application'];
                    r.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                    r.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                    r.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                    r.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                    r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                    r.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                    r.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                    r.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                    r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                    let special_hardware = [];
                    if (aj['projectapplicationrenewal']['project_application_renewalspecial_hardware'] != null) {
                        let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

                        for (let c = 0; c < special_hardware_string.length; c++) {
                            let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                            special_hardware.push(sh)

                        }

                        r.SpecialHardware = special_hardware;
                    }
                    a.ApplicationExtension = r;
                }
                this.user_applications.push(a)
            }
            this.isLoaded_userApplication = true;

        });
    }

    getApplicationStatus() {
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then(result => {
                let res = result;
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
                let res = result;
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
        this.voService.isVo().subscribe(result => {

            this.is_vo_admin = result['Is_Vo_Manager'];
            if (this.is_vo_admin) {
                this.applicataionsservice.getAllApplications().subscribe(res => {
                    if (Object.keys(res).length == 0) {
                        this.isLoaded_AllApplication = true;
                    }

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
                        a.PerunId = aj['project_application_perun_id'];
                        a.OpenStackProject = aj["project_application_openstack_project"];
                        if (aj['projectapplicationrenewal']) {
                            let r = new ApplicationExtension();

                            r.Id = aj['projectapplicationrenewal']['project_application'];
                            r.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                            r.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                            r.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                            r.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                            r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                            r.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                            r.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                            r.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                            r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                            let special_hardware = [];
                            if (aj['projectapplicationrenewal']['project_application_renewalspecial_hardware'] != null) {
                                let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

                                for (let c = 0; c < special_hardware_string.length; c++) {
                                    let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                                    special_hardware.push(sh)

                                }

                                r.SpecialHardware = special_hardware;
                            }
                            a.ApplicationExtension = r;
                        }
                        a.ComputeCenter = ['', -1];

                        this.all_applications.push(a);

                    }
                    let observable_list = [];
                    for (let app of this.all_applications) {
                        // app.ComputeCenter = ['None', -1];
                        if (app.Status !== 1 && app.PerunId) {
                            observable_list.push(this.groupservice.getFacilityByGroup(app.PerunId.toString()))
                        }

                    }
                    forkJoin(observable_list).subscribe(result => {
                        for (let res of result) {

                            let details = res['Details'];
                            let details_array = [];
                            for (let detail in details) {
                                let detail_tuple = [detail, details[detail]];
                                details_array.push(detail_tuple);
                            }
                            for (let app of  this.all_applications) {
                                if (app.PerunId == res['Group']) {
                                    app.ComputecenterDetails = details_array,
                                        app.ComputeCenter = [res['Facility'], res['FacilityId']]
                                }

                            }


                        }
                        this.isLoaded_AllApplication = true;


                    });
                    if (observable_list.length == 0) {
                        this.isLoaded_AllApplication = true;

                    }

                });
            }
            else {
                this.isLoaded_AllApplication = true;

            }

        });
    }

    public requestExtension(data) {

        this.applicataionsservice.requestRenewal(data).subscribe(result => {
            if (result['Error']) {
                this.extension_status = 2
            }
            else {
                this.extension_status = 1;
            }
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        })


    }

    public approveExtension(application_id: number) {
        this.applicataionsservice.approveRenewal(application_id).subscribe(result => {
            if (result['Error']) {
                this.extension_status = 2
            }
            else {
                this.extension_status = 3;
            }
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        })
    }


    public declineExtension(application_id: number) {
        this.applicataionsservice.declineRenewal(application_id).subscribe(result => {
            if (result['Error']) {
                this.extension_status = 2
            }
            else {
                this.extension_status = 4;
            }
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
        let LifetimeDays = Math.ceil(Math.ceil(Math.abs(moment(status_changed).add(lifetime, 'months').toDate().getTime() - status_changed.getTime())) / (1000 * 3600 * 24));

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

        this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).toPromise()
            .then(member_raw => {
                    let member = member_raw;
                    manager_member_id = member["id"];
                    manager_member_user_id = member["userId"];
                    // create new group

                    return this.groupservice.createGroup(name, description).toPromise();
                }
            ).then(group_raw => {
            let group = group_raw;
            new_group_id = group["id"];

            //add the application user to the group
            return this.groupservice.addMember(new_group_id, manager_member_id, compute_center).toPromise();

        }).then(null_result => {
            return this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center).toPromise();
        }).then(null_result => {
            return this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("approved"), compute_center).toPromise();
        }).then(null_result => {
            //setting approved status for Perun Group

            if (compute_center != 'undefined') {
                this.groupservice.assignGroupToResource(new_group_id.toString(), compute_center).subscribe();
            }
            this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe()
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
