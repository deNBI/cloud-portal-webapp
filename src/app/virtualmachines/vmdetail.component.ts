import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../environments/environment'
import {FlavorService} from "../api-connector/flavor.service";
import {ApplicationsService} from "../api-connector/applications.service";
import {FacilityService} from "../api-connector/facility.service";
import {VoService} from "../api-connector/vo.service";
import {UserService} from "../api-connector/user.service";
import {GroupService} from "../api-connector/group.service";
import {ApiSettings} from "../api-connector/api-settings.service";
import {CreditsService} from "../api-connector/credits.service";
import {AbstractBaseClasse} from "../shared/shared_modules/baseClass/abstract-base-class";
import {ActivatedRoute} from "@angular/router";
import {VirtualMachine} from "./virtualmachinemodels/virtualmachine";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";



@Component({
  selector: 'app-virtual-machine-detail',
  templateUrl: 'vmdetail.component.html',
  providers: [FlavorService, FacilityService, VoService, UserService, GroupService, ApiSettings, VoService, CreditsService, VirtualmachineService]
})

export class VmDetailComponent extends AbstractBaseClasse implements OnInit {
  vm_id: string;
  vm_to_show: VirtualMachine;
  virtualmachineService: VirtualmachineService;
  userService: UserService;
  applicationService: ApplicationsService;
  title: string;
  virtualMachine: VirtualMachine;


  constructor( private activatedRoute: ActivatedRoute,
               virtualmachineService: VirtualmachineService,
               userService: UserService,
               applicationService: ApplicationsService) {
    super();
    this.virtualmachineService = virtualmachineService;
    this.userService = userService;
    this.applicationService = applicationService;

  }
  ngOnInit(): void {

    console.log('site loaded');
    this.activatedRoute.params.subscribe((paramsId: any) => {
     this.vm_id = paramsId.id;
     this.getVmById();

    });
  }

  getVmById(): void {
    this.virtualmachineService.getVmById(this.vm_id).subscribe(
      (aj: object) => {
        console.log(aj['name']);
        const newVM: VirtualMachine = this.setNewVirtualMachine(aj);
        this.vm_to_show = newVM;
        this.isLoaded = true;
      },
      (error: any) => {
          this.isLoaded = false;
          console.log(error.error.toString());
          console.log('error loading vm with id');
      }
    );
  }

  setNewVirtualMachine(aj: any): VirtualMachine {
    return null;
  }
}
