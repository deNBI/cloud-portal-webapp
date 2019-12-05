import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../environments/environment'
import {FlavorService} from "../api-connector/flavor.service";
import {ApplicationStatusService} from "../api-connector/application-status.service";
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
import {forEach} from "@angular/router/src/utils/collection";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";


@Component({
  selector: 'app-virtual-machine-detail',
  templateUrl: 'vmdetail.component.html',
  providers: [FlavorService, FacilityService, VoService, UserService, GroupService, ApiSettings, VoService, CreditsService, VirtualmachineService]
})

export class VmDetailComponent extends AbstractBaseClasse implements OnInit {
  vm_id: string;
  vm_to_show: Observable<VirtualMachine>;
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
    this.activatedRoute.params.subscribe((virtM: VirtualMachine) => {
      this.virtualMachine = virtM;
      this.title = this.virtualMachine.name;
      this.isLoaded = true;
    });
  }
}
