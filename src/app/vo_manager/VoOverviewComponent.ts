import {Component, OnInit} from '@angular/core';
import {VoService} from '../api-connector/vo.service';
import {Project} from '../projectmanagement/project.model';
import {ProjectMember} from '../projectmanagement/project_member.model';
import {GroupService} from '../api-connector/group.service';
import * as moment from 'moment';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {FilterBaseClass} from '../shared/shared_modules/baseClass/filter-base-class';
import {IResponseTemplate} from '../api-connector/response-template';
import {FacilityService} from '../api-connector/facility.service';
import {forkJoin} from 'rxjs/index';
import {Application} from '../applications/application.model/application.model';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {VirtualMachine} from '../virtualmachines/virtualmachinemodels/virtualmachine';
import {Volume} from '../virtualmachines/volumes/volume';
import {FullLayoutComponent} from '../layouts/full-layout.component';
import {SnapshotModel} from '../virtualmachines/snapshots/snapshot.model';
import {createUTCDate} from 'ngx-bootstrap/chronos/create/date-from-array';

/**
 * Vo Overview component.
 */
@Component({
             selector: 'app-vo-overview',
             templateUrl: 'voOverview.component.html',
             providers: [VoService, GroupService, FacilityService]

           })

export class VoOverviewComponent extends FilterBaseClass implements OnInit {

  title: string = 'VO Overview';
  public emailSubject: string;
  public emailReply: string = '';
  public emailText: string;
  public emailStatus: number = 0;
  public emailHeader: string;
  public emailVerify: string;
  public emailType: number;
  public selectedProject: Project;
  public selectedProjectVms: VirtualMachine[] = [];
  public selectedProjectVolumes: Volume[] = [];
  public selectedProjectSnapshots: SnapshotModel[] = [];
  computecenters: ComputecenterComponent[] = [];

  selectedProjectType: string = 'ALL';
  selectedFacility: string | number = 'ALL';

  public newsletterSubscriptionCounter: number;
  isLoaded: boolean = false;
  details_loaded: boolean = false;

  member_id: number;
  projects: Project[] = new Array();
  projects_filtered: Project[] = new Array();

  // modal variables for User list
  public usersModalProjectMembers: ProjectMember[] = [];
  public usersModalProjectID: number;
  public usersModalProjectName: string;
  public downloadJsonHref: string;

  public managerFacilities: [string, number][];

  // public selectedFacility: [string, number];

  constructor(private fullLayout: FullLayoutComponent,
              private sanitizer: DomSanitizer,
              private voserice: VoService,
              private groupservice: GroupService,
              private facilityService: FacilityService) {
    super();

  }

  ngOnInit(): void {

    this.getVoProjects();
    this.voserice.getNewsletterSubscriptionCounter().subscribe((result: IResponseTemplate) => {
      this.newsletterSubscriptionCounter = <number>result.value

    });
  }

  getApplicationInfos(): void {
    this.voserice.getVoProjectResourcesTimeframes().subscribe()

    this.voserice.getVoProjectCounter().subscribe();
    this.voserice.getVoProjectDates().subscribe();
  }

  sendEmail(subject: string, message: string, reply?: string): void {
    switch (this.emailType) {
      case 0: {
        this.sendMailToVo(subject, message, this.selectedFacility.toString(), this.selectedProjectType, reply);
        break;
      }
      case 1: {
        this.sendNewsletterToVo(subject, message, reply);
        break;
      }
      default:
        return
    }
  }

  applyFilter(): void {
    this.projects_filtered = this.projects.filter((project: Project) => this.checkFilter(project));

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

  sendNewsletterToVo(subject: string, message: string, reply?: string): void {
    this.voserice.sendNewsletterToVo(encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply))
      .subscribe((result: IResponseTemplate) => {
        if (<boolean><Boolean>result.value === true) {
          this.emailStatus = 1;
        } else {
          this.emailStatus = 2;
        }
      })

  }

  sendMailToVo(subject: string, message: string, facility: string, type: string, reply?: string): void {
    this.voserice.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message), facility, type, encodeURIComponent(reply))
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

  getVoProjects(): void {
    this.projects = [];
    this.voserice.getAllGroupsWithDetails().subscribe((result: any) => {
      const vo_projects: any = result;
      for (const group of vo_projects) {
        const dateCreated: moment.Moment = moment.unix(group['createdAt']);
        const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
        const is_pi: boolean = group['is_pi'];
        const lifetime: number = group['lifetime'];
        const currentCredits: number = Number(group['current_credits']);
        const approvedCredits: number = Number(group['approved_credits']);
        const groupid: number = group['id'];
        const facility: any = group['compute_center'];
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
          compute_center,
          currentCredits,
          approvedCredits
          );
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

  resetEmailModal(): void {

    this.emailHeader = null;
    this.emailSubject = null;
    this.emailText = null;
    this.emailType = null;
    this.emailVerify = null;
    this.emailReply = '';
    this.emailStatus = 0;

  }

  public resetNotificationModal(): void {
    this.notificationModalTitle = 'Notification';
    this.notificationModalMessage = 'Please wait...';
    this.notificationModalIsClosable = false;
    this.notificationModalType = 'info';
  }

  /**
   * Get all computecenters.
   */
  getComputeCenters(): void {
    this.facilityService.getComputeCenters().subscribe((result: any) => {
      for (const cc of result) {
        const compute_center: ComputecenterComponent = new ComputecenterComponent(
          cc['compute_center_facility_id'], cc['compute_center_name'],
          cc['compute_center_login'], cc['compute_center_support_mail']);
        this.computecenters.push(compute_center)
      }

    })
  }

  /**
   * Bugfix not scrollable site after closing modal
   */
  removeModalOpen(): void {
    document.body.classList.remove('modal-open');
  }

  public getProjectDetails(): void {
    this.voserice.getProjectDetails(this.selectedProject.Id).subscribe((res: any) => {
      this.selectedProjectVms = res['vms'];
      this.selectedProjectVolumes = res['volumes'];
      this.selectedProjectSnapshots = res['snapshots'];
    })
  }

  public terminateProject(): void {
    this.voserice.terminateProject(this.selectedProject.Id)
      .subscribe(() => {
                   const indexAll: number = this.projects.indexOf(this.selectedProject, 0);

                   this.projects.splice(indexAll, 1);
                   this.applyFilter();
                   this.fullLayout.getGroupsEnumeration();

                   this.updateNotificationModal('Success', 'The  project was terminated.', true, 'success');

                 },
                 () => {
                   this.updateNotificationModal('Failed', 'The project could not be terminated.', true, 'danger');

                 }
      )
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

  getProjectStatus(project: Project): void {
    this.voserice.getProjectStatus(project.Id).subscribe((res: IResponseTemplate) => {
      project.Status = <number>res.value;
    })
  }

  suspendProject(project: Project): void {
    this.voserice.removeResourceFromGroup(project.Id).subscribe(() => {
      this.getProjectStatus(project);
      project.ComputeCenter = null;
    });

  }

  resumeProject(project: Project): void {
    this.voserice.resumeProject(project.Id).subscribe(() => {
      this.getVoProjects();
    });

  }

  setProjectStatus(project: Project, status: number): void {
    this.voserice.setProjectStatus(project.Id, status).subscribe(() => {
      this.getProjectStatus(project)

    })
  }

  removeResourceFromGroup(groupid: number | string): void {
    this.voserice.removeResourceFromGroup(groupid.toString()).subscribe()
  }

  getMembesOfTheProject(projectid: number, projectname: string): void {
    this.voserice.getVoGroupRichMembers(projectid)
      .subscribe((members: any) => {
                   this.usersModalProjectID = projectid;
                   this.usersModalProjectName = projectname;
                   this.usersModalProjectMembers = new Array();
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

  showMembersOfTheProject(projectid: number, projectname: string): void {
    this.getMembesOfTheProject(projectid, projectname);

  }

}
