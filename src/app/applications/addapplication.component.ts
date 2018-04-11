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

  public wronginput: boolean = false;

  //notification Modal variables
  public notificationModalTitle: string = 'Notification';
  public notificationModalMessage: string = 'Please wait...';
  public notificationModalType: string = 'info';
  public notificationModalIsClosable: boolean = false;
  public notificationModalStay: boolean = true;

  showjustvm: boolean;
  project_application_openstack_project: boolean;


  csrf: Object = Cookie.get('csrftoken');
  special_hardware: SpecialHardware[] = new Array();

  constructor(private specialhardwareservice: SpecialHardwareService,
              private  applicationsservice: ApplicationsService) {
    this.getSpecialHardware();

  }

  chosenProjectType(checkbox: number) {
    if (checkbox == 0) {
      if (this.project_application_openstack_project) {
        this.showjustvm = false;
      }
    }

    else if (checkbox == 1) {
      if (this.showjustvm) {
        this.project_application_openstack_project = false;
      }
    }
  }

  getSpecialHardware() {
    this.specialhardwareservice.getAllSpecialHardware().toPromise()
      .then(result => {
        let res = result.json();
        for (let key in res) {
          let shj = res[key];
          let sh = new SpecialHardware(shj['special_hardware_id'], shj['special_hardware_key'], shj['special_hardware_name']);
          this.special_hardware.push(sh)
        }
      });
  }

  onSubmit(f: NgForm) {
    if (this.wronginput == true) {
      this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
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
          this.updateNotificaitonModal('Success', 'The application was submitted', true, 'success');
          this.notificationModalStay = false;
        }).catch(error => {
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

  public resetModal(){

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


