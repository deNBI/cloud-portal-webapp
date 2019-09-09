import {Component, OnInit} from '@angular/core';
import {ApiSettings} from '../api-connector/api-settings.service';
import {ClientService} from '../api-connector/client.service';
import {FacilityService} from '../api-connector/facility.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {VoService} from '../api-connector/vo.service';
import {IResponseTemplate} from '../api-connector/response-template';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {Project} from '../projectmanagement/project.model';
import * as moment from 'moment';

/**
 * FullLayout component.
 */
@Component({
             selector: 'app-dashboard',
             templateUrl: './full-layout.component.html',
             providers: [VoService, GroupService, UserService, FacilityService, ClientService, ApiSettings]
           })
export class FullLayoutComponent implements OnInit {

  public year: number = new Date().getFullYear();
  public disabled: boolean = false;
  public status: { isopen: boolean } = {isopen: false};
  is_vo_admin: boolean = false;
  public is_facility_manager: boolean = false;
  public vm_project_member: boolean = false;
  public login_name: string = '';
  navbar_state: string = 'closed';
  overview_state: string = 'closed';
  userProjects: {}[];

  projects: Project[] = [];

  constructor(private voService: VoService, private groupService: GroupService, private userservice: UserService,
              private facilityservice: FacilityService) {
  }

  public get_is_vo_admin(): boolean {
    return this.is_vo_admin;
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  public get_is_facility_manager(): void {
    this.facilityservice.getManagerFacilities().subscribe(result => {
      if (result.length > 0) {
        this.is_facility_manager = true
      }
    })
  }

  is_vm_project_member(): void {
    this.groupService.getSimpleVmByUser().subscribe(result => {
      if (result.length > 0) {
        this.vm_project_member = true
      }
    })
  }

  toggle_new_application(): void {
    if (this.navbar_state === 'closed') {
      this.navbar_state = 'open'
    } else {
      this.navbar_state = 'closed'
    }
  }

  toggle_overview(): void {
    if (this.overview_state === 'closed') {
      this.overview_state = 'open'
    } else {
      this.overview_state = 'closed'
    }
  }

  getUserProjects(): void {

    this.groupService.getGroupDetails().subscribe((result: any) => {
      this.userProjects = result;
      for (const group of this.userProjects) {
        const dateCreated: moment.Moment = moment.unix(group['createdAt']);
        const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
        const is_pi: boolean = group['is_pi'];
        const groupid: string = group['id'];
        const facility: any = group['compute_center'];
        const shortname: string = group['shortname'];

        const realname: string = group['name'];
        let compute_center: ComputecenterComponent = null;

        if (facility) {
          compute_center = new ComputecenterComponent(
            facility['compute_center_facility_id'], facility['compute_center_name'],
            facility['compute_center_login'], facility['compute_center_support_mail']);
        }

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
      }
    })

  }

  checkVOstatus(): void {
    this.voService.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo_admin = <boolean><Boolean>result.value;
    })
  }

  ngOnInit(): void {
    this.is_vm_project_member();
    this.get_is_facility_manager();
    this.getUserProjects();
    this.getLoginName();

    this.checkVOstatus();
  }

  getLoginName(): void {
    this.userservice.getLoginElixirName().subscribe((login: IResponseTemplate) => {
      this.login_name = <string>login.value
    });

  }
}
