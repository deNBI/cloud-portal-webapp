import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***ClientService***REMOVED*** from '../api-connector/client.service';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***IResponseTemplate***REMOVED*** from '../api-connector/response-template';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***Project***REMOVED*** from '../projectmanagement/project.model';
import * as moment from 'moment';

/**
 * FullLayout component.
 */
@Component(***REMOVED***
             selector: 'app-dashboard',
             templateUrl: './full-layout.component.html',
             providers: [VoService, GroupService, UserService, FacilityService, ClientService, ApiSettings]
           ***REMOVED***)
export class FullLayoutComponent implements OnInit ***REMOVED***

  public year: number = new Date().getFullYear();
  public disabled: boolean = false;
  public status: ***REMOVED*** isopen: boolean ***REMOVED*** = ***REMOVED***isopen: false***REMOVED***;
  is_vo_admin: boolean = false;
  public is_facility_manager: boolean = false;
  public vm_project_member: boolean = false;
  public login_name: string = '';
  navbar_state: string = 'closed';
  overview_state: string = 'closed';
  userProjects: ***REMOVED******REMOVED***[];

  projects: Project[] = [];

  constructor(private voService: VoService, private groupService: GroupService, private userservice: UserService,
              private facilityservice: FacilityService) ***REMOVED***
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
    this.facilityservice.getManagerFacilities().subscribe(result => ***REMOVED***
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

  getUserProjects(): void ***REMOVED***

    this.groupService.getGroupDetails().subscribe((result: any) => ***REMOVED***
      this.userProjects = result;
      for (const group of this.userProjects) ***REMOVED***
        const dateCreated: moment.Moment = moment.unix(group['createdAt']);
        const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
        const is_pi: boolean = group['is_pi'];
        const groupid: string = group['id'];
        const facility: any = group['compute_center'];
        const shortname: string = group['shortname'];

        const realname: string = group['name'];
        let compute_center: ComputecenterComponent = null;

        if (facility) ***REMOVED***
          compute_center = new ComputecenterComponent(
            facility['compute_center_facility_id'], facility['compute_center_name'],
            facility['compute_center_login'], facility['compute_center_support_mail']);
        ***REMOVED***

        const newProject: Project = new Project(
          groupid,
          shortname,
          group['description'],
          moment(dateCreated).format('DD.MM.YYYY'),
          dateDayDifference,
          is_pi,
          group['is_pi'],
          compute_center);
        newProject.OpenStackProject = group['openstack_project'];
        newProject.RealName = realname;
        this.projects.push(newProject);
      ***REMOVED***
    ***REMOVED***)

  ***REMOVED***

  checkVOstatus(): void ***REMOVED***
    this.voService.isVo().subscribe((result: IResponseTemplate) => ***REMOVED***
      this.is_vo_admin = <boolean><Boolean>result.value;
    ***REMOVED***)
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.is_vm_project_member();
    this.get_is_facility_manager();
    this.getUserProjects();
    this.getLoginName();

    this.checkVOstatus();
  ***REMOVED***

  getLoginName(): void ***REMOVED***
    this.userservice.getLoginElixirName().subscribe((login: IResponseTemplate) => ***REMOVED***
      this.login_name = <string>login.value
    ***REMOVED***);

  ***REMOVED***
***REMOVED***
