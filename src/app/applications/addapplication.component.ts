import ***REMOVED***Component, ViewChild***REMOVED*** from '@angular/core';
import 'rxjs/add/operator/toPromise';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***NgForm, FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***SpecialHardwareService***REMOVED*** from '../api-connector/special-hardware.service'
import ***REMOVED***SpecialHardware***REMOVED*** from './special_hardware.model'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';

@Component(***REMOVED***
  templateUrl: 'addapplication.component.html',
  providers: [SpecialHardwareService, ApiSettings, ApplicationsService]
  // providers: []
***REMOVED***)

export class AddApplicationComponent ***REMOVED***

  //notification Modal variables
  public notificationModal;
  public notificationModalTitle: string = "Notification";
  public notificationModalMessage: string = "Please wait...";
  public notificationModalType: string = "info";
  public notificationModalIsClosable: boolean = false;
  public notificationModalStay: boolean = true;

  csrf: Object = Cookie.get("csrftoken");
  special_hardware: SpecialHardware[] = new Array();

  constructor(private specialhardwareservice: SpecialHardwareService,
              private  applicationsservice: ApplicationsService) ***REMOVED***
    this.getSpecialHardware();
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
    console.log("F.VALUE:")
    console.log(f.value)
    console.log("F.DATA:")
    let data = f.value
    console.log(data)
    console.log("LOOOP-BEGIN")
    for (let key in f.value) ***REMOVED***
      console.log("KEY BACK:" + key + "=>" + data[key]);
      console.log("KEY VAL :" + key + "=>" + data.key);
      if (data[key] === null || data[key] === undefined || data[key] === "") ***REMOVED***
        delete data[key];
      ***REMOVED***
      console.log("F.VALUE (2):")
      console.log(f.value)
      console.log("F.DATA (2):")
      console.log(data)
      let newdata = ***REMOVED******REMOVED***
      for (let key in f.value) ***REMOVED***
        if (data[key] === null || data[key] === undefined || data[key] === "") ***REMOVED***
        ***REMOVED*** else ***REMOVED***
          newdata[key] = data[key];
        ***REMOVED***
      ***REMOVED***
      console.log("NEWDATA:")
      console.log(newdata);
    ***REMOVED***

    this.applicationsservice.addNewApplication(f.value).toPromise()
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

