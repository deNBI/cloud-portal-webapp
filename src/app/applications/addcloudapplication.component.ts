import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***SpecialHardwareService***REMOVED*** from '../api-connector/special-hardware.service'
import ***REMOVED***SpecialHardware***REMOVED*** from './special_hardware.model'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';

@Component(***REMOVED***
    templateUrl: 'addcloudapplication.component.html',
    providers: [SpecialHardwareService, ApiSettings, ApplicationsService, FlavorService],
    styleUrls: ['addcloudapplication.component.css']
***REMOVED***)

export class AddcloudapplicationComponent ***REMOVED***

    public wronginput: boolean = false;
    public isCollapsed: boolean = true;


    //notification Modal variables
    public notificationModalTitle: string = 'Notification';
    public notificationModalMessage: string = 'Please wait...';
    public notificationModalType: string = 'info';
    public notificationModalIsClosable: boolean = false;
    public notificationModalStay: boolean = true;
    public error: string[];
    public project_application_vms_requested = 5;
    public flavorList: Flavor[];
    public typeList: FlavorType[];
    public collapseList: boolean[];
    public totalNumberOfCores = 0;
    public totalRAM = 0;
    public test: string[];



    public acknowledgeModalMessage: string = 'The development and support of the cloud is possible above all through the funding of the cloud infrastructure by the Federal Ministry of Education and Research (BMBF)!\n' +
        'We would highly appreciate the following citation in your next publication(s): ‘This work was supported by the BMBF-funded de.NBI Cloud within the German Network for Bioinformatics Infrastructure (de.NBI) (031A537B, 031A533A, 031A538A, 031A533B, 031A535A, 031A537C, 031A534A, 031A532B).';
    public acknowledgeModalTitle: string = 'Acknowledge';
    public acknowledgeModalType: string = 'info';


    showjustvm: boolean;
    project_application_openstack_project: boolean = true;


    csrf: Object = Cookie.get('csrftoken');
    special_hardware: SpecialHardware[] = new Array();

    constructor(private specialhardwareservice: SpecialHardwareService,
                private  applicationsservice: ApplicationsService, private flavorservice: FlavorService) ***REMOVED***
        this.getSpecialHardware();
        this.getListOfFlavors();
        this.getListOfTypes();

    ***REMOVED***

    presentEnteredData(f: NgForm) ***REMOVED***
      /**
       * need to collect data from Form f so total number of cores and ram can be calculated, number of vms can be shown
       */
    ***REMOVED***

    getListOfFlavors() ***REMOVED***
        this.flavorservice.getListOfFlavorsAvailable().subscribe(flavors => this.flavorList = flavors);
    ***REMOVED***

    getListOfTypes() ***REMOVED***
        this.flavorservice.getListOfTypesAvailable().subscribe(types => this.setListOfTypes(types));
    ***REMOVED***


    setListOfTypes(types: FlavorType[]) ***REMOVED***
      this.typeList = types;
      this.collapseList = new Array(types.length) as Array<boolean>;
      for (let i = 0; i < types.length; i++) ***REMOVED***
        this.collapseList.push(true);
      ***REMOVED***

    ***REMOVED***


    getSpecialHardware() ***REMOVED***
        this.specialhardwareservice.getAllSpecialHardware().toPromise()
            .then(result => ***REMOVED***
                let res = result;
                for (let key in res) ***REMOVED***
                    let shj = res[key];
                    let sh = new SpecialHardware(shj['special_hardware_id'], shj['special_hardware_key'], shj['special_hardware_name']);
                    this.special_hardware.push(sh)
                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    check_not_zero(values: ***REMOVED******REMOVED***) ***REMOVED***
        if ('project_application_openstack_project' in values) ***REMOVED***


            if ('project_application_volume_limit' in values && values['project_application_volume_limit'] > 0) ***REMOVED***
                return true;
            ***REMOVED***

            return false;
        ***REMOVED***
        else ***REMOVED***

            return true;
        ***REMOVED***
    ***REMOVED***

    onSubmit(f: NgForm) ***REMOVED***
        this.error = null;
        console.log(f)
        if (this.wronginput == true) ***REMOVED***

            this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
            this.notificationModalStay = true;
        ***REMOVED***
        else ***REMOVED***
            let values:***REMOVED***[key:string]:any***REMOVED*** = ***REMOVED******REMOVED***;
            values['project_application_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
            values['project_application_openstack_project'] = this.project_application_openstack_project;
            for (let v in f.controls) ***REMOVED***
                if (f.controls[v].value) ***REMOVED***

                    values[v] = f.controls[v].value;
                ***REMOVED***
            ***REMOVED***
            console.log(values)
            if (this.check_not_zero(values) == false) ***REMOVED***
                this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
                this.notificationModalStay = true;
                return;
            ***REMOVED***


            this.applicationsservice.addNewApplication(values).toPromise()
                .then(result => ***REMOVED***
                    this.updateNotificaitonModal('Success', 'The application was submitted', true, 'success');
                    this.notificationModalStay = false;
                ***REMOVED***).catch(error => ***REMOVED***
                var error_json = error
                this.error = []
                for (let key of Object.keys(error_json)) ***REMOVED***
                    this.error.push(key.split('_',)[2])

                ***REMOVED***


                this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
                this.notificationModalStay = true;
            ***REMOVED***)
        ***REMOVED***
    ***REMOVED***


    public updateNotificaitonModal(title: string, message: string, closable: true, type: string) ***REMOVED***
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    ***REMOVED***

    public resetNotificationModal() ***REMOVED***

        this.notificationModalTitle = 'Notification';
        this.notificationModalMessage = 'Please wait...';
        this.notificationModalType = 'info';
        this.notificationModalIsClosable = false;
        this.notificationModalStay = true;
    ***REMOVED***

    public checkShortname(shortname: string) ***REMOVED***
        if (/^[a-zA-Z0-9\s]*$/.test(shortname) == false) ***REMOVED***
            this.wronginput = true;
        ***REMOVED***
        else ***REMOVED***
            this.wronginput = false;
        ***REMOVED***
    ***REMOVED***
***REMOVED***


