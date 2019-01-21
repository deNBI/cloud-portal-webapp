import {Component} from '@angular/core';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {NgForm} from '@angular/forms';
import {SpecialHardwareService} from '../api-connector/special-hardware.service'
import {SpecialHardware} from './special_hardware.model'
import {ApiSettings} from '../api-connector/api-settings.service'
import {ApplicationsService} from '../api-connector/applications.service'
import {AbstractBaseClasse} from "../shared_modules/baseClass/abstract-base-class";
import {Flavor} from "../virtualmachines/virtualmachinemodels/flavor";
import {FlavorService} from "../api-connector/flavor.service";
import {environment} from "../../environments/environment";

@Component({
    templateUrl: 'addsinglevm.component.html',
    providers: [FlavorService, SpecialHardwareService, ApiSettings, ApplicationsService]
})

export class AddsinglevmComponent extends AbstractBaseClasse {
    /**
     * Check if the shortname provided is valid.
     * @type {boolean}
     */
    public wronginput: boolean = false;


    /**
     * List of flavors.
     */
    public flavorList: Flavor[];


    public production = environment.production;


    public error: string[];
    public project_application_vms_requested = 3;
    public project_application_report_allowed = false;


    public acknowledgeModalMessage: string = 'The development and support of the cloud is possible above all through the funding of the cloud infrastructure by the Federal Ministry of Education and Research (BMBF)!\n' +
        'We would highly appreciate the following citation in your next publication(s): ‘This work was supported by the BMBF-funded de.NBI Cloud within the German Network for Bioinformatics Infrastructure (de.NBI) (031A537B, 031A533A, 031A538A, 031A533B, 031A535A, 031A537C, 031A534A, 031A532B).';
    public acknowledgeModalTitle: string = 'Acknowledge';
    public acknowledgeModalType: string = 'info';

    /**
     * Available special hardware.
     * @type {any[]}
     */
    special_hardware: SpecialHardware[] = new Array();

    constructor(private specialhardwareservice: SpecialHardwareService,
                private  applicationsservice: ApplicationsService, private flavorService: FlavorService) {
        super();
        this.getSpecialHardware();
        this.getListOfFlavors();


    }


    /**
     * Get available special hardware.
     */
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


    /**
     * Submit simple vm application.
     * @param {NgForm} f
     */
    onSubmit(f: NgForm) {
        this.error = null;
        if (this.wronginput == true) {
            this.updateNotificationModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
            this.notificationModalStay = true;
        }
        else {
            let values = {};
            values['project_application_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
            for (let v in f.controls) {
                if (f.controls[v].value) {
                    values[v] = f.controls[v].value;
                }
            }

            this.applicationsservice.addNewApplication(values).toPromise()
                .then(result => {
                    this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
                    this.notificationModalStay = false;
                }).catch(error => {
                var error_json = error;
                this.error = [];
                for (let key of Object.keys(error_json)) {
                    this.error.push(key.split('_',)[2])

                }


                this.updateNotificationModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
                this.notificationModalStay = true;
            })
        }
    }

    /**
     * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
     */
    getListOfFlavors() {
        this.flavorService.getListOfFlavorsAvailable().subscribe(flavors => {
            this.flavorList = flavors;
        });
    }


    /**
     * Check if shortname is valid.
     * @param {string} shortname
     */
    public checkShortname(shortname: string) {
        if (/^[a-zA-Z0-9\s]*$/.test(shortname) == false) {
            this.wronginput = true;
        }
        else {
            this.wronginput = false;
        }
    }

     sendTestApplication() {
        let values: { [key: string]: any } = {};

        values['project_application_comment'] = 'TestApplication';
        values['project_application_description'] = 'TestApplication';
        values['project_application_institute'] = 'TestApplication';
        values['project_application_lifetime'] = 3;
        values['project_application_name'] = 'TestApplication';
        values['project_application_openstack_project'] = false;
        for (let f of this.flavorList) {
            let fname = 'project_application_' + f.name;
            values[fname] = 1;
        }
        values['project_application_report_allowed'] = true;
        values['project_application_shortname'] = 'TestApplication';
        values['project_application_volume_counter'] = 5;
        values['project_application_volume_limit'] = 20;
        values['project_application_workgroup'] = 'TestApplication';

        this.applicationsservice.addNewApplication(values).toPromise()
            .then(result => {
                this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
                this.notificationModalStay = false;
            }).catch(error => {
            var error_json = error
            this.error = []
            for (let key of Object.keys(error_json)) {
                this.error.push(key.split('_',)[2])

            }


            this.updateNotificationModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
            this.notificationModalStay = true;
        })


    }
}


