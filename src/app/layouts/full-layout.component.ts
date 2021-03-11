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
import {ProjectEnumeration} from '../projectmanagement/project-enumeration';
import {environment} from '../../environments/environment';
import {is_vo} from '../shared/globalvar';
import {VirtualmachineService} from '../api-connector/virtualmachine.service';
import {Application_States} from '../shared/shared_modules/baseClass/abstract-base-class';
import * as moment from 'moment';
import {WIKI, WIKI_FAQ} from '../../links/links';

/**
 * FullLayout component.
 */
@Component({
             selector: 'app-dashboard',
             templateUrl: './full-layout.component.html',
             providers: [ApplicationsService,
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

  project_enumeration: ProjectEnumeration[] = [];
  Application_States: typeof Application_States = Application_States;

  WIKI: string = WIKI;
  WIKI_FAQ: string = WIKI_FAQ;

  constructor(private voService: VoService, private groupService: GroupService, userservice: UserService,
              facilityService: FacilityService, applicationsservice: ApplicationsService,
              private virtualMachineService: VirtualmachineService
  ) {
    super(userservice, applicationsservice, facilityService);

  }

  componentAdded(event: any): void {
    this.TITLE = event.title;
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
      this.project_enumeration.forEach((enumeration: ProjectEnumeration): void => {
        this.pushAdditionalStates(enumeration);
      });
      this.project_enumeration.sort((firstProject: ProjectEnumeration, secondProject: ProjectEnumeration): number => {
        if (firstProject.is_open_stack && !secondProject.is_open_stack) {
          return -1;
        }
        if (!firstProject.is_open_stack && secondProject.is_open_stack) {
          return 1;
        }

        return 0;
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
   *
   * @param enumeration
   */
  pushAdditionalStates(enumeration: ProjectEnumeration): void {

    const days_left: number = this.getDaysLeft(enumeration);
    const days_running: number = this.getDaysRunning(enumeration);
    if (enumeration.project_application_status.includes(Application_States.APPROVED)) {
      if (days_left < 14 && days_left >= 0) {
        enumeration.project_application_status.push(Application_States.EXPIRES_SOON);

      } else if (days_left < 0) {
        enumeration.project_application_status.push(Application_States.EXPIRED);

      }
      if (days_running < 14) {
        enumeration.project_application_status.push(Application_States.APPROVED_LAST_2_WEEKS);
      }
    }

  }

  getDaysLeft(projEnum: ProjectEnumeration): number {

    const expirationDate: string = moment(moment(projEnum.project_start_date).add(projEnum.project_lifetime, 'months').toDate()).format('DD.MM.YYYY');
    const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate()).diff(moment(projEnum.project_start_date), 'days'));

    const daysRunning: number = this.getDaysRunning(projEnum);

    return lifetimeDays - daysRunning;
  }

  getDaysRunning(projectEnumeration: ProjectEnumeration): number {
    return Math.ceil((Math.abs(Date.now() - new Date(projectEnumeration.project_start_date).getTime()))
      / (1000 * 3600 * 24));
  }

}
