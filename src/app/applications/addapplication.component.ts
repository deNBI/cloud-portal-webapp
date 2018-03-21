import ***REMOVED***Component***REMOVED*** from '@angular/core';
import 'rxjs/add/operator/toPromise';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***SpecialHardwareService***REMOVED*** from '../api-connector/special-hardware.service'
import ***REMOVED***SpecialHardware***REMOVED*** from './special_hardware.model'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'

@Component(***REMOVED***
    templateUrl: 'addapplication.component.html',
    providers: [SpecialHardwareService, ApiSettings, ApplicationsService]
***REMOVED***)

export class AddApplicationComponent ***REMOVED***

    //notification Modal variables
    public notificationModalTitle: string = "Notification";
    public notificationModalMessage: string = "Please wait...";
    public notificationModalType: string = "info";
    public notificationModalIsClosable: boolean = false;
    public notificationModalStay: boolean = true;

    showjustvm: boolean;
    project_application_openstack_project: boolean;


    csrf: Object = Cookie.get("csrftoken");
    special_hardware: SpecialHardware[] = new Array();

    constructor(private specialhardwareservice: SpecialHardwareService,
                private  applicationsservice: ApplicationsService) ***REMOVED***
        this.getSpecialHardware();

    ***REMOVED***

    chosenProjectType(checkbox: number) ***REMOVED***
        if (checkbox == 0) ***REMOVED***
            if (this.project_application_openstack_project) ***REMOVED***
                this.showjustvm = false;
            ***REMOVED***
        ***REMOVED***

        else if (checkbox == 1) ***REMOVED***
            if (this.showjustvm) ***REMOVED***
                this.project_application_openstack_project = false;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***

    getSpecialHardware() ***REMOVED***
        this.specialhardwareservice.getAllSpecialHardware().toPromise()
            .then(result => ***REMOVED***
                let res = result.json();
                for (let key in res) ***REMOVED***
                    let shj = res[key];
                    let sh = new SpecialHardware(shj["special_hardware_id"], shj["special_hardware_key"], shj["special_hardware_name"]);
                    this.special_hardware.push(sh)
                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    onSubmit(f: NgForm) ***REMOVED***

        let values = ***REMOVED******REMOVED***;
        values['project_application_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
        for (let v in f.controls) ***REMOVED***
            if (f.controls[v].value) ***REMOVED***
                values[v] = f.controls[v].value;
            ***REMOVED***
        ***REMOVED***


        this.applicationsservice.addNewApplication(values).toPromise()
            .then(result => ***REMOVED***
                this.updateNotificaitonModal("Success", "The application was submitted", true, "success");
                this.notificationModalStay = false;
            ***REMOVED***).catch(error => ***REMOVED***
            this.updateNotificaitonModal("Failed", "The application was not submitted, please check the required fields and try again.", true, "danger");
            this.notificationModalStay = true;
        ***REMOVED***)
    ***REMOVED***


    public updateNotificaitonModal(title: string, message: string, closable: true, type: string) ***REMOVED***
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    ***REMOVED***
***REMOVED***

