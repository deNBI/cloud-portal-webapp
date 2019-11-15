import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../projectmanagement/project.model';
import {ProjectMember} from '../projectmanagement/project_member.model'
import {environment} from '../../environments/environment'
import {ApiSettings} from '../api-connector/api-settings.service';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import {FacilityService} from '../api-connector/facility.service';
import * as moment from 'moment';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {FilterBaseClass} from '../shared/shared_modules/baseClass/filter-base-class';
import {IResponseTemplate} from '../api-connector/response-template';

/**
 * Facility Project overview component.
 */
@Component({
             selector: 'app-facility-projects',
             templateUrl: 'facilityprojectsoverview.component.html',
             providers: [FacilityService, UserService, GroupService, ApiSettings]
           })
export class FacilityProjectsOverviewComponent extends FilterBaseClass implements OnInit {

  debug_module: boolean = false;

  @Input() voRegistrationLink: string = environment.voRegistrationLink;

  title: string = 'Projects Overview';
  member_id: number;
  isLoaded: boolean = false;
  projects: Project[] = [];
  details_loaded: boolean = false;
  /**
   * Approved group status.
   * @type {number}
   */
  STATUS_APPROVED: number = 2;

  selectedProjectType: string = 'ALL';

  // modal variables for User list
  public usersModalProjectMembers: ProjectMember[] = [];
  public usersModalProjectID: number;
  public usersModalProjectName: string;
  public selectedProject: Project;

  public emailSubject: string;
  public emailText: string;
  public emailStatus: number = 0;
  public emailReply: string = '';
  public sendNews: boolean;

  public managerFacilities: [string, number][];
  public selectedFacility: [string, number];
  projects_filtered: Project[] = [];

  constructor(private groupservice: GroupService,
              private facilityservice: FacilityService) {
    super();
  }

  ngOnInit(): void {
    this.facilityservice.getManagerFacilities().subscribe((result: any) => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
      this.emailSubject = `[${this.selectedFacility['Facility']}]`;

      this.getFacilityProjects(this.managerFacilities[0]['FacilityId']);
      this.title = `${this.title}:${this.selectedFacility['Facility']}`;

    })
    this.sendNews = true;
  }

  applyFilter(): void {
    this.projects_filtered = this.projects.filter((project: Project) => this.checkFilter(project));
  }

  checkFilter(project: Project): boolean {
    return this.isFilterLongProjectName(project.RealName) && this.isFilterProjectStatus(project.Status, project.LifetimeReached)
      && this.isFilterProjectName(project.Name) && this.isFilterProjectId(project.Id)
  }

  /**
   * Gets projects and sets email subject prefix when selected facility changes.
   */
  onChangeSelectedFacility(): void {
    this.getFacilityProjects(this.selectedFacility['FacilityId']);
    this.emailSubject = `[${this.selectedFacility['Facility']}`
  }

  getProjectLifetime(project: Project): void {
    this.details_loaded = false;
    if (!project.Lifetime) {
      this.groupservice.getLifetime(project.Id).subscribe((time: IResponseTemplate) => {
        const lifetime: number = <number>time.value;
        const dateCreated: Date = moment(project.DateCreated, 'DD.MM.YYYY').toDate();

        if (lifetime !== -1) {
          const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
          const lifetimeDays: number = Math.abs(
            moment(moment(expirationDate, 'DD.MM.YYYY').toDate()).diff(moment(dateCreated), 'days'));

          project.LifetimeDays = lifetimeDays;
          project.DateEnd = expirationDate;
        }
        project.Lifetime = lifetime;
        this.details_loaded = true;

      })
    } else {
      this.details_loaded = true;
    }
  }

  /**
   * Returns the name of the project with the id of the selectedProjectType
   */
  getProjectNameBySelectedProjectTypeAsId(): string {
    const id: string = this.selectedProjectType;
    if (!id) {
      return 'NOT_FOUND';
    }
    const project: Project = this.projects.find(function (element: Project): boolean {

      return element.Id.toString() === id.toString();

    });
    if (project) {
      return project.Name
    }

    return 'NOT_FOUND';
  }

  getFacilityProjects(facility: string): void {
    this.projects = [];

    this.facilityservice.getFacilityAllowedGroupsWithDetailsAndSpecificStatus(facility, this.STATUS_APPROVED).subscribe((result: any) => {
      const facility_projects: any = result;
      const is_pi: boolean = false;
      const is_admin: boolean = false;
      for (const group of facility_projects) {
        const dateCreated: moment.Moment = moment.unix(group['createdAt']);
        const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
        const groupid: string = group['id'];

        const currentCredits: number = Number(group['current_credits']);
        const approvedCredits: number = Number(group['approved_credits']);
        const tmp_facility: any = group['compute_center'];
        let shortname: string = group['shortname'];
        let compute_center: ComputecenterComponent = null;
        const lifetime: number = group['lifetime'];

        if (!shortname) {
          shortname = group['name']
        }
        if (tmp_facility) {
          compute_center = new ComputecenterComponent(
            tmp_facility['compute_center_facility_id'],
            tmp_facility['compute_center_name'],
            tmp_facility['compute_center_login'],
            tmp_facility['compute_center_support_mail']);
        }

        const newProject: Project = new Project(
          Number(groupid),
          shortname,
          group['description'],
          `${dateCreated.date()}.${(dateCreated.month() + 1)}.${dateCreated.year()}`,
          dateDayDifference,
          is_pi,
          is_admin,
          compute_center,
          currentCredits,
          approvedCredits);
        newProject.Status = group['status'];

        if (lifetime !== -1) {
          const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
          const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY')
                                                         .toDate()).diff(moment(dateCreated), 'days'));

          newProject.LifetimeDays = lifetimeDays;
          newProject.DateEnd = expirationDate;
          newProject.LifetimeReached = this.lifeTimeReached(lifetimeDays, dateDayDifference)

        }
        newProject.RealName = group['name'];
        newProject.Lifetime = lifetime;
        newProject.OpenStackProject = group['openstack_project'];

        this.projects.push(newProject);
      }
      this.applyFilter();
      this.isLoaded = true;

    })

  }

  sendMailToFacility(facility: string, subject: string, message: string, reply?: string, send?: any): void {
    this.facilityservice.sendMailToFacility(
      facility, encodeURIComponent(subject), encodeURIComponent(message), this.selectedProjectType,
      encodeURIComponent(reply), send).subscribe(
      (result: any) => {
        if (result.status === 201) {
          this.emailStatus = 1;
        } else {
          this.emailStatus = 2;
        }
      },
      () => {
        this.emailStatus = 2;
      })

  }

  getMembesOfTheProject(projectid: number, projectname: string): void {
    this.facilityservice.getFacilityGroupRichMembers(projectid, this.selectedFacility['FacilityId'])
      .subscribe((members: any) => {
                   this.usersModalProjectID = projectid;
                   this.usersModalProjectName = projectname;
                   this.usersModalProjectMembers = [];
                   for (const member of members) {
                     const member_id: string = member['id'];
                     const user_id: string = member['userId'];
                     const fullName: string = `${member['firstName']} ${member['lastName']}`;
                     const newMember: ProjectMember = new ProjectMember(user_id, fullName, member_id);
                     newMember.ElixirId = member['elixirId'];
                     newMember.Email = member['email'];
                     this.usersModalProjectMembers.push(newMember);
                   }

                 }
      )
  }

  public showMembersOfTheProject(project_id: number, projectname: string): void {
    this.getMembesOfTheProject(project_id, projectname);

  }

  public resetEmailModal(): void {
    this.selectedProjectType = 'ALL';
    this.emailSubject = `[${this.selectedFacility['Facility']}]`;
    this.emailText = null;
    this.emailReply = null;
    this.emailStatus = 0;
    this.sendNews = true;
  }

  public comingSoon(): void {
    alert('This function will be implemented soon.')
  }
}
