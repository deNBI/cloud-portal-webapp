import {Component, OnInit} from '@angular/core';
import {ApiSettings} from '../api-connector/api-settings.service';
import {ClientService} from '../api-connector/client.service';
import {FacilityService} from '../api-connector/facility.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {VoService} from '../api-connector/vo.service';
import {IResponseTemplate} from '../api-connector/response-template';
import {ApplicationBaseClassComponent} from '../shared/shared_modules/baseClass/application-base-class.component';
import {ApplicationsService} from '../api-connector/applications.service';
import {ApplicationStatusService} from '../api-connector/application-status.service';
import {ProjectEnumeration} from '../projectmanagement/project-enumeration';
import {environment} from '../../environments/environment';
import {is_vo} from '../shared/globalvar';
import {VirtualmachineService} from '../api-connector/virtualmachine.service';
import {NavigationPoint} from '../shared/navigationPoint.model';

/**
 * FullLayout component.
 */
@Component({
             selector: 'app-dashboard',
             templateUrl: './full-layout.component.html',
             providers: [ApplicationsService,
               ApplicationStatusService,
               VirtualmachineService,
               VoService,
               GroupService,
               UserService,
               FacilityService,
               ClientService,
               ApiSettings]
           })
export class FullLayoutComponent extends ApplicationBaseClassComponent implements OnInit {

  public year: number = new Date().getFullYear();
  public disabled: boolean = false;
  public status: { isopen: boolean } = {isopen: false};
  is_vo_admin: boolean = false;
  public is_facility_manager: boolean = false;
  public vm_project_member: boolean = false;
  public login_name: string = '';
  public production: boolean = environment.production;
  navbar_state: string = 'closed';
  overview_state: string = 'closed';
  navbar_minimized: boolean = false;
  brand_logo: string = 'static/webapp/assets/img/denbi-logo-color.svg';
  brand_logo_minimized: string = 'static/webapp/assets/img/denbi-logo-minimized.svg';
  cluster_allowed: boolean = false;

  TITLE: string = '';
  NAVIGATION_POINTS: NavigationPoint[] = [];

  project_enumeration: ProjectEnumeration[] = [];
  project_badges_states: {[id: string]: number[]} = {};

  constructor(private voService: VoService, private groupService: GroupService, userservice: UserService,
              facilityService: FacilityService, applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService, private virtualMachineService: VirtualmachineService
  ) {
    super(userservice, applicationstatusservice, applicationsservice, facilityService);

  }

  componentAdded(event: any): void {

    this.TITLE = event.title;
    this.NAVIGATION_POINTS = event.navigationPoints;
  }

  public get_is_vo_admin(): boolean {
    return this.is_vo_admin;
  }

  set_cluster_allowed(): void {
    this.virtualMachineService.getClusterAllowed().subscribe((res: any): void => {
      this.cluster_allowed = res['allowed'];
    })
  }

  public get_is_facility_manager(): void {
    this.facilityService.getManagerFacilities().subscribe((result: any): void => {
      if (result.length > 0) {
        this.is_facility_manager = true
      }
    })
  }

  is_vm_project_member(): void {
    this.groupService.getSimpleVmByUser().subscribe((result: any): void => {
      if (result.length > 0) {
        this.vm_project_member = true
      }
    })
  }

  getGroupsEnumeration(): void {
    this.groupService.getGroupsEnumeration().subscribe((res: ProjectEnumeration[]): void => {
      this.project_enumeration = res;
      console.log(res);
      this.project_enumeration.forEach((enumeration: ProjectEnumeration): void => {
        this.project_badges_states[enumeration.application_id] = enumeration.project_status;
        this.pushAdditionalStates(enumeration);
      });
    });
  }

  ngOnInit(): void {
    this.set_cluster_allowed();
    this.getGroupsEnumeration();
    this.is_vm_project_member();
    this.get_is_facility_manager();
    this.getLoginName();

    this.is_vo_admin = is_vo;
  }

  getLoginName(): void {
    this.userservice.getLoginElixirName().subscribe((login: IResponseTemplate): void => {
      this.login_name = <string>login.value
    });

  }

  setSidebarStatus(): void {
    this.navbar_minimized = !this.navbar_minimized;
  }

  /**
   * Adding additional state numbers to list for expires soon (18), new project (19) and lifetime expired (20)
   * @param enumeration
   */
  pushAdditionalStates(enumeration: ProjectEnumeration): void {
    if (enumeration.project_status.includes(2) && (this.getDaysLeft(enumeration) < 14)) {
      this.project_badges_states[enumeration.application_id].push(18);
    }
    if (enumeration.project_status.includes(2) && (this.getDaysRunning(enumeration) < 14)) {
      this.project_badges_states[enumeration.application_id].push(19);
    }
    if (enumeration.project_status.includes(2) && (this.getDaysLeft(enumeration) < 0)) {
      this.project_badges_states[enumeration.application_id].push(20);
    }

  }

  getDaysLeft(projEnum: ProjectEnumeration): number {
    const max_days: number = 31 * projEnum.project_lifetime;
    const daysRunning: number = this.getDaysRunning(projEnum);

    return max_days - daysRunning;
  }

  getDaysRunning(projectEnumeration: ProjectEnumeration): number {
    return Math.ceil((Math.abs(Date.now() - new Date(projectEnumeration.project_start_date).getTime()))
      / (1000 * 3600 * 24));
  }

}
