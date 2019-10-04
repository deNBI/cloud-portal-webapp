import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***ClientService***REMOVED*** from '../api-connector/client.service';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***IResponseTemplate***REMOVED*** from '../api-connector/response-template';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from '../shared/shared_modules/baseClass/application-base-class';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service';
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service';
import ***REMOVED***ProjectEnumeration***REMOVED*** from '../projectmanagement/project-enumeration';

/**
 * FullLayout component.
 */
@Component(***REMOVED***
             selector: 'app-dashboard',
             templateUrl: './full-layout.component.html',
             providers: [ApplicationsService, ApplicationStatusService, VoService, GroupService, UserService, FacilityService, ClientService, ApiSettings]
           ***REMOVED***)
export class FullLayoutComponent extends ApplicationBaseClass implements OnInit ***REMOVED***

  public year: number = new Date().getFullYear();
  public disabled: boolean = false;
  public status: ***REMOVED*** isopen: boolean ***REMOVED*** = ***REMOVED***isopen: false***REMOVED***;
  is_vo_admin: boolean = false;
  public is_facility_manager: boolean = false;
  public vm_project_member: boolean = false;
  public login_name: string = '';
  navbar_state: string = 'closed';
  overview_state: string = 'closed';
  project_enumeration: ProjectEnumeration[] = [];

  constructor(private voService: VoService, private groupService: GroupService, userservice: UserService,
              facilityService: FacilityService, applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService,
  ) ***REMOVED***
    super(userservice, applicationstatusservice, applicationsservice, facilityService);

  ***REMOVED***

  public get_is_vo_admin(): boolean ***REMOVED***
    return this.is_vo_admin;
  ***REMOVED***

  public toggled(open: boolean): void ***REMOVED***
    console.log('Dropdown is now: ', open);
  ***REMOVED***

  public toggleDropdown($event: MouseEvent): void ***REMOVED***
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  ***REMOVED***

  public get_is_facility_manager(): void ***REMOVED***
    this.facilityService.getManagerFacilities().subscribe(result => ***REMOVED***
      if (result.length > 0) ***REMOVED***
        this.is_facility_manager = true
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  is_vm_project_member(): void ***REMOVED***
    this.groupService.getSimpleVmByUser().subscribe(result => ***REMOVED***
      if (result.length > 0) ***REMOVED***
        this.vm_project_member = true
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  toggle_new_application(): void ***REMOVED***
    if (this.navbar_state === 'closed') ***REMOVED***
      this.navbar_state = 'open'
    ***REMOVED*** else ***REMOVED***
      this.navbar_state = 'closed'
    ***REMOVED***
  ***REMOVED***

  toggle_overview(): void ***REMOVED***
    if (this.overview_state === 'closed') ***REMOVED***
      this.overview_state = 'open'
    ***REMOVED*** else ***REMOVED***
      this.overview_state = 'closed'
    ***REMOVED***
  ***REMOVED***

  getGroupsEnumeration(): void ***REMOVED***
    this.groupService.getGroupsEnumeration().subscribe(res => ***REMOVED***
      this.project_enumeration = res;
    ***REMOVED***)
  ***REMOVED***

  checkVOstatus(): void ***REMOVED***
    this.voService.isVo().subscribe((result: IResponseTemplate) => ***REMOVED***
      this.is_vo_admin = <boolean><Boolean>result.value;
    ***REMOVED***)
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.getGroupsEnumeration();
    this.is_vm_project_member();
    this.get_is_facility_manager();
    this.getLoginName();

    this.checkVOstatus();
  ***REMOVED***

  getLoginName(): void ***REMOVED***
    this.userservice.getLoginElixirName().subscribe((login: IResponseTemplate) => ***REMOVED***
      this.login_name = <string>login.value
    ***REMOVED***);

  ***REMOVED***
***REMOVED***
