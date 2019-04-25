import {Component} from '@angular/core';
import {VoService} from '../api-connector/vo.service';
import {Project} from '../projectmanagement/project.model';
import {ProjectMember} from '../projectmanagement/project_member.model';
import {GroupService} from '../api-connector/group.service';
import * as moment from 'moment';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {FilterBaseClass} from '../shared/shared_modules/baseClass/filter-base-class';
import {IResponseTemplate} from "../api-connector/response-template";
import {FacilityService} from "../api-connector/facility.service";
import {forkJoin} from "rxjs/index";

/**
 * Vo Overview component.
 */
@Component({
  selector: 'app-vo-overview',
  templateUrl: 'voOverview.component.html',
  providers: [VoService, GroupService, FacilityService]

})

export class VoOverviewComponent extends FilterBaseClass {

  public emailSubject: string;
  public emailReply: string = '';
  public emailText: string;
  public emailStatus: number = 0;
  public emailHeader: string;
  public emailVerify: string;
  public emailType: number;
  public selectedProject: Project;
  computecenters: ComputecenterComponent[] = [];

  selectedProjectType: string = 'ALL';
  selectedFacility: string | number = 'ALL';

  public newsletterSubscriptionCounter: number;
  isLoaded: boolean = false;
  details_loaded: boolean = false;

  member_id: number;
  projects: Project[] = [];
  projects_filtered: Project[] = [];

  // modal variables for User list
  public usersModalProjectMembers: ProjectMember[] = [];
  public usersModalProjectID: number;
  public usersModalProjectName: string;

  public managerFacilities: [string, number][];

  // public selectedFacility: [string, number];

  constructor(private voService: VoService, private groupservice: GroupService, private facilityService: FacilityService) {
    super();
    this.getVoProjects();
    this.voService.getNewsletterSubscriptionCounter().subscribe((result: IResponseTemplate) => {
      this.newsletterSubscriptionCounter = <number>result.value

    });
  }

  setProjectStatus(project: Project, status: number): void {
    this.voService.setProjectStatus(project.Id, status).subscribe(() => {
      this.getProjectStatus(project)

    })
  }

  getVoProjects(): void {
    this.voService.getAllGroupsWithDetails().subscribe(result => {
      const vo_projects = result;
      for (const group of vo_projects) {
        const dateCreated: moment.Moment = moment(group['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
        const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
        const is_pi: boolean = group['is_pi'];
        const lifetime: number = group['lifetime'];

        const groupid: number = group['id'];
        const facility = group['compute_center'];
        let shortname: string = group['shortname'];
        if (!shortname) {
          shortname = group['name']
        }
        let compute_center: ComputecenterComponent = null;
        if (facility) {

          compute_center = new ComputecenterComponent(
            facility['compute_center_facility_id'],
            facility['compute_center_name'],
            facility['compute_center_login'],
            facility['compute_center_support_mail']);
        }

        const newProject: Project = new Project(
          Number(groupid),
          shortname,
          group['description'],
          `${dateCreated.date()}.${(dateCreated.month() + 1)}.${dateCreated.year()}`,
          dateDayDifference,
          is_pi,
          true,
          compute_center);
        newProject.Lifetime = lifetime;
        newProject.Status = group['status'];
        newProject.OpenStackProject = group['openstack_project'];
        let expirationDate: string = '';
        if (lifetime !== -1) {
          expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
          const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
                                                  .diff(moment(dateCreated), 'days'));

          newProject.LifetimeDays = lifetimeDays;
          newProject.DateEnd = expirationDate;
          newProject.LifetimeReached = this.lifeTimeReached(lifetimeDays, dateDayDifference)

        }

        this.projects.push(newProject);
      }
      this.applyFilter();

      this.isLoaded = true;

    })

  }

  sendEmail(): void {
    const emailDict: {[key: string]: string} = {
      subject: encodeURIComponent(this.emailSubject),
      message: encodeURIComponent(this.emailText),
      reply: encodeURIComponent(this.emailReply)};
    switch (this.emailType) {
      case 0: {
        this.sendMailToVo(this.selectedFacility.toString(), this.selectedProjectType, emailDict);
        break;
      }
      case 1: {
        this.sendNewsletterToVo(emailDict);
        break;
      }
      default:
        return
    }
  }

  applyFilter(): void {
    this.projects_filtered = this.projects.filter(vm => this.checkFilter(vm));

  }

  checkFilter(project: Project): boolean {
    let facNameFilter: boolean = true;
    if (project.ComputeCenter) {
      facNameFilter = this.isFilterFacilityName(project.ComputeCenter.Name)
    }

    return facNameFilter
      && this.isFilterProjectStatus(project.Status, project.LifetimeReached)
      && this.isFilterProjectName(project.Name)
      && this.isFilterProjectId(project.Id)

  }

  sendNewsletterToVo(emailDict: {[key: string]: string}): void {
    this.voService.sendNewsletterToVo(emailDict)
      .subscribe((result: IResponseTemplate) => {
        if (<boolean><Boolean>result.value === true) {
          this.emailStatus = 1;
        } else {
          this.emailStatus = 2;
        }
      })

  }

  sendMailToVo(facility: string, type: string, emailDict: {[key: string]: string}): void {
    this.voService.sendMailToVo(facility, type, emailDict)
      .subscribe((result: IResponseTemplate) => {
        if (<boolean><Boolean>result.value === true) {

          this.emailStatus = 1;
        } else {
          this.emailStatus = 2;
        }
        this.selectedProjectType = 'ALL';
        this.selectedFacility = 'ALL';
      })

  }

  getProjectStatus(project: Project): void {
    this.voService.getProjectStatus(project.Id).subscribe((res: IResponseTemplate) => {
      project.Status = <number>res.value;
    })
  }

  showMembersOfTheProject(projectid: number, projectname: string, facility: [string, number]): void {
    this.getMembesOfTheProject(projectid, projectname);

  }

  getMembesOfTheProject(projectid: number, projectname: string): void {
    this.voService.getVoGroupRichMembers(projectid).subscribe(members => {
                                                                this.usersModalProjectID = projectid;
                                                                this.usersModalProjectName = projectname;
                                                                this.usersModalProjectMembers = [];
                                                                for (const member of members) {
                                                                  const member_id: number = member['id'];
                                                                  const user_id: number = member['userId'];
                                                                  const fullName: string = `${member['firstName']}  ${member['lastName']}`;
                                                                  const newMember: ProjectMember = new ProjectMember(user_id, fullName, member_id);
                                                                  newMember.ElixirId = member['elixirId'];
                                                                  newMember.Email = member['email'];
                                                                  this.usersModalProjectMembers.push(newMember);
                                                                }

                                                              }
    )
  }

  setEmailType(type: number): void {
    this.emailType = type;
    switch (this.emailType) {
      case 0: {
        this.emailHeader = 'Send email to all members of the vo';
        this.emailVerify = 'Are you sure you want to send this email to all members of the vo?';
        break;
      }
      case 1: {
        this.emailHeader = 'Send newsletter to vo';
        this.emailVerify = 'Are you sure you want to send this newsletter?';
        break;
      }
      default:
        return
    }
  }

  resetEmailModal(): void {

    this.emailHeader = null;
    this.emailSubject = null;
    this.emailText = null;
    this.emailType = null;
    this.emailVerify = null;
    this.emailReply = '';
    this.emailStatus = 0;

  }

  /**
   * Get all computecenters.
   */
  getComputeCenters(): void {
    this.facilityService.getComputeCenters().subscribe(result => {
      for (const cc of result) {
        const compute_center: ComputecenterComponent = new ComputecenterComponent(
          cc['compute_center_facility_id'], cc['compute_center_name'],
          cc['compute_center_login'], cc['compute_center_support_mail']);
        this.computecenters.push(compute_center)
      }

    })
  }

  getProjectLifetime(project: Project): void {
    this.details_loaded = false;
    if (!project.Lifetime) {
      this.groupservice.getLifetime(project.Id.toString()).subscribe((time: IResponseTemplate) => {
        const lifetime: number = <number>time.value;
        const dateCreatedString: string = project.DateCreated;

        let expirationDate: string;
        const dateCreated: Date = moment(dateCreatedString, 'DD.MM.YYYY').toDate();
        if (lifetime !== -1) {
          expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
          project.LifetimeDays = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
            .diff(moment(dateCreated), 'days'));

          project.DateEnd = expirationDate;
        }
        project.Lifetime = lifetime;
        this.details_loaded = true;

      })
    } else {
      this.details_loaded = true;
    }
  }

  suspendProject(project: Project): void {
    forkJoin(this.voService.removeResourceFromGroup(project.Id), this.voService.setProjectStatus(project.Id, 4)
    ).subscribe((res: IResponseTemplate[]) => {
      const removedRes: number = <number> res[0].value;
      const newProjectSatus: number = <number> res[1].value;

      project.Status = newProjectSatus;
      if (removedRes === -1) {
        project.ComputeCenter = null
      }
    });
  }

  removeResourceFromGroup(groupid: number | string): void {
    this.voService.removeResourceFromGroup(groupid.toString()).subscribe()
  }

}
