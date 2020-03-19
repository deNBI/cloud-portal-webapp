import {assertPlatform, Component, OnInit} from '@angular/core';
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
import {Application} from '../applications/application.model/application.model';
import {Project} from '../projectmanagement/project.model';

/**
 * FullLayout component.
 */
@Component({
             selector: 'app-dashboard',
             templateUrl: './full-layout.component.html',
             providers: [ApplicationsService,
               ApplicationStatusService,
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

  TITLE: string = '';

  project_enumeration: ProjectEnumeration[] = [];
  project_badges_states: {[id: string]: number} = {};

  constructor(private voService: VoService, private groupService: GroupService, userservice: UserService,
              facilityService: FacilityService, applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService
  ) {
    super(userservice, applicationstatusservice, applicationsservice, facilityService);

  }

  componentAdded(event: any): void {

    this.TITLE = event.title;

  }

  public get_is_vo_admin(): boolean {
    return this.is_vo_admin;
  }

  public get_is_facility_manager(): void {
    this.facilityService.getManagerFacilities().subscribe((result: any) => {
      if (result.length > 0) {
        this.is_facility_manager = true
      }
    })
  }

  is_vm_project_member(): void {
    this.groupService.getSimpleVmByUser().subscribe((result: any) => {
      if (result.length > 0) {
        this.vm_project_member = true
      }
    })
  }

  getGroupsEnumeration(): void {
    this.groupService.getGroupsEnumeration().subscribe((res: ProjectEnumeration[]) => {
      this.project_enumeration = res;
      this.project_enumeration.forEach((enumeration: ProjectEnumeration) => {
         this.badgeState(enumeration).then((value: number) => {
            this.project_badges_states[enumeration.application_id] = value;
         }).catch((reason: any) => {console.log(reason)});
      })
    });
  }

  ngOnInit(): void {
    this.getGroupsEnumeration();
    this.is_vm_project_member();
    this.get_is_facility_manager();
    this.getLoginName();

    this.is_vo_admin = is_vo;
  }

  getLoginName(): void {
    this.userservice.getLoginElixirName().subscribe((login: IResponseTemplate) => {
      this.login_name = <string>login.value
    });

  }

  setSidebarStatus(): void {
    this.navbar_minimized = !this.navbar_minimized;
  }

  async badgeState(projEnum: ProjectEnumeration): Promise<number> {

      if (projEnum.project_status === 'wait for confirmation') { return 4; }

      if (projEnum.project_status === 'modification requested') { return 3; }

      if (projEnum.project_status === 'suspended') { return 2; }

      if ((this.getDaysRunning(projEnum.project_start_date) < 8) && projEnum.project_status === 'approved') { return 0; }

      if (this.getDaysLeft(projEnum) < 21 ) { return 1; }

      return -1;
  }

  getDaysLeft(projEnum: ProjectEnumeration): number {
    const max_days: number = 31 * projEnum.project_lifetime;
    const daysRunning: number = this.getDaysRunning(projEnum.project_start_date);

    return max_days - daysRunning;
  }

  getDaysRunning(datestring: string): number {
    return Math.ceil((Math.abs(Date.now() - new Date(datestring).getTime())) / (1000 * 3600 * 24));
  }

}
