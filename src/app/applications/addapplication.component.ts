import {Component} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {NgForm} from '@angular/forms';
import {SpecialHardwareService} from '../api-connector/special-hardware.service'
import {SpecialHardware} from './special_hardware.model'
import {ApiSettings} from '../api-connector/api-settings.service'
import {ApplicationsService} from '../api-connector/applications.service'

@Component({
  templateUrl: 'addapplication.component.html',
  providers: [SpecialHardwareService, ApiSettings, ApplicationsService]
})

export class AddApplicationComponent {

  //notification Modal variables
  public notificationModalTitle: string = "Notification";
  public notificationModalMessage: string = "Please wait...";
  public notificationModalType: string = "info";
  public notificationModalIsClosable: boolean = false;
  public notificationModalStay: boolean = true;

  csrf: Object = Cookie.get("csrftoken");
  special_hardware: SpecialHardware[] = new Array();

  constructor(private specialhardwareservice: SpecialHardwareService,
              private  applicationsservice: ApplicationsService) {
    this.getSpecialHardware();
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

  onSubmit(f: NgForm) {
    f.controls['project_application_special_hardware']
      .setValue(this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id))
    if (!f.value['project_application_openstack_project']) {
      f.controls['project_application_openstack_project'].setValue(false);
     
    }
    this.applicationsservice.addNewApplication(f.value).toPromise()
      .then(result => {
        this.updateNotificaitonModal("Success", "The application was submitted", true, "success");
        this.notificationModalStay = false;
      }).catch(error => {
      this.updateNotificaitonModal("Failed", "The application was not submitted, please check the required fields and try again.", true, "danger");
      this.notificationModalStay = true;
    })
  }

  public updateNotificaitonModal(title: string, message: string, closable: true, type: string) {
    this.notificationModalTitle = title;
    this.notificationModalMessage = message;
    this.notificationModalIsClosable = closable;
    this.notificationModalType = type;
  }
}

