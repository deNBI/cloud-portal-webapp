import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Project} from './project.model';
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


@Component({
  selector: 'app-virtual-machine-detail',
  templateUrl: 'vmdetail.component.html',
  providers: [FlavorService, FacilityService, VoService, UserService, GroupService, ApiSettings, VoService, CreditsService]
})

export class VmDetailComponent extends AbstractBaseClasse implements OnInit {
  vm_id:string;
  constructor( private activatedRoute: ActivatedRoute) {
    super();
  }
  ngOnInit(): void {
    console.log('site loaded');
    this.activatedRoute.params.subscribe((paramsId: any) => {
      this.isLoaded = false;

      this.vm_id = paramsId.id;

    });
  }
}
