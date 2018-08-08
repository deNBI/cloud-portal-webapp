import {Component} from '@angular/core';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {NgForm} from '@angular/forms';
import {SpecialHardwareService} from '../api-connector/special-hardware.service'
import {SpecialHardware} from './special_hardware.model'
import {ApiSettings} from '../api-connector/api-settings.service'
import {ApplicationsService} from '../api-connector/applications.service'

@Component({
    templateUrl: 'addcloudapplication.component.html',
    providers: [SpecialHardwareService, ApiSettings, ApplicationsService]
})

export class AddcloudapplicationComponent {

    public wronginput: boolean = false;

    //notification Modal variables
    public notificationModalTitle: string = 'Notification';
    public notificationModalMessage: string = 'Please wait...';
    public notificationModalType: string = 'info';
    public notificationModalIsClosable: boolean = false;
    public notificationModalStay: boolean = true;
    public error: string[];
    public project_application_vms_requested=5;


    public acknowledgeModalMessage: string = 'The development and support of the cloud is possible above all through the funding of the cloud infrastructure by the Federal Ministry of Education and Research (BMBF)!\n' +
        'We would highly appreciate the following citation in your next publication(s): ‘This work was supported by the BMBF-funded de.NBI Cloud within the German Network for Bioinformatics Infrastructure (de.NBI) (031A537B, 031A533A, 031A538A, 031A533B, 031A535A, 031A537C, 031A534A, 031A532B).';
    public acknowledgeModalTitle: string = 'Acknowledge';
    public acknowledgeModalType: string = 'info';


    showjustvm: boolean;
    project_application_openstack_project: boolean=true;


    csrf: Object = Cookie.get('csrftoken');
    special_hardware: SpecialHardware[] = new Array();

    constructor(private specialhardwareservice: SpecialHardwareService,
                private  applicationsservice: ApplicationsService) {
        this.getSpecialHardware();

    }



    getSpecialHardware() {
        this.specialhardwareservice.getAllSpecialHardware().toPromise()
            .then(result => {
                let res = result;
                for (let key in res) {
                    let shj = res[key];
                    let sh = new SpecialHardware(shj['special_hardware_id'], shj['special_hardware_key'], shj['special_hardware_name']);
                    this.special_hardware.push(sh)
                }
            });
    }

    check_not_zero(values: {}) {
        if ('project_application_openstack_project' in values) {


            if ('project_application_cores_per_vm' in values && values['project_application_cores_per_vm'] > 0 && 'project_application_ram_per_vm' in values
                && values['project_application_ram_per_vm'] > 0 && 'project_application_volume_limit' in values && values['project_application_volume_limit'] > 0) {
                return true;
            }

            return false;
        }
        else {

            return true;
        }
    }

    onSubmit(f: NgForm) {
        this.error = null;
        if (this.wronginput == true) {

            this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
            this.notificationModalStay = true;
        }
        else {
            let values = {};
            values['project_application_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
            values['project_application_openstack_project']=this.project_application_openstack_project;
            for (let v in f.controls) {
                if (f.controls[v].value) {
                    values[v] = f.controls[v].value;
                }
            }
            if (this.check_not_zero(values) == false) {
                console.log('error')
                this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
                this.notificationModalStay = true;
                return;
            }



            this.applicationsservice.addNewApplication(values).toPromise()
                .then(result => {
                    this.updateNotificaitonModal('Success', 'The application was submitted', true, 'success');
                    this.notificationModalStay = false;
                }).catch(error => {
                var error_json = error
                this.error = []
                for (let key of Object.keys(error_json)) {
                    this.error.push(key.split('_',)[2])

                }


                this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
                this.notificationModalStay = true;
            })
        }
    }


    public updateNotificaitonModal(title: string, message: string, closable: true, type: string) {
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    }

    public resetNotificationModal() {

        this.notificationModalTitle = 'Notification';
        this.notificationModalMessage = 'Please wait...';
        this.notificationModalType = 'info';
        this.notificationModalIsClosable = false;
        this.notificationModalStay = true;
    }

    public checkShortname(shortname: string) {
        if (/^[a-zA-Z0-9\s]*$/.test(shortname) == false) {
            this.wronginput = true;
        }
        else {
            this.wronginput = false;
        }
    }
}


