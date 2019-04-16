import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***Project***REMOVED*** from '../projectmanagement/project.model';
import ***REMOVED***ProjectMember***REMOVED*** from '../projectmanagement/project_member.model';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import * as moment from 'moment';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***FilterBaseClass***REMOVED*** from '../shared/shared_modules/baseClass/filter-base-class';
import ***REMOVED***IResponseTemplate***REMOVED*** from "../api-connector/response-template";
import ***REMOVED***FacilityService***REMOVED*** from "../api-connector/facility.service";
import ***REMOVED***forkJoin***REMOVED*** from "rxjs/index";

/**
 * Vo Overview component.
 */
@Component(***REMOVED***
  selector: 'app-vo-overview',
  templateUrl: 'voOverview.component.html',
  providers: [VoService, GroupService, FacilityService]

***REMOVED***)

export class VoOverviewComponent extends FilterBaseClass ***REMOVED***

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
  projects: Project[] = new Array();
  projects_filtered: Project[] = new Array();

  // modal variables for User list
  public usersModalProjectMembers: ProjectMember[] = [];
  public usersModalProjectID: number;
  public usersModalProjectName: string;

  public managerFacilities: [string, number][];

  // public selectedFacility: [string, number];

  constructor(private voserice: VoService, private groupservice: GroupService, private facilityService: FacilityService) ***REMOVED***
    super();
    this.getVoProjects();
    this.voserice.getNewsletterSubscriptionCounter().subscribe((result: IResponseTemplate) => ***REMOVED***
      this.newsletterSubscriptionCounter = <number>result.value

    ***REMOVED***);

  ***REMOVED***

  applyFilter(): void ***REMOVED***

    this.projects_filtered = this.projects.filter(vm => this.checkFilter(vm));

  ***REMOVED***

  checkFilter(project: Project): boolean ***REMOVED***
    let facNameFilter: boolean = true;
    if (project.ComputeCenter) ***REMOVED***
      facNameFilter = this.isFilterFacilityName(project.ComputeCenter.Name)
    ***REMOVED***

    return facNameFilter
      && this.isFilterProjectStatus(project.Status, project.LifetimeReached)
      && this.isFilterProjectName(project.Name)
      && this.isFilterProjectId(project.Id)

  ***REMOVED***

  sendEmail(subject: string, message: string, reply?: string): void ***REMOVED***
    console.log(this.emailType);
    switch (this.emailType) ***REMOVED***
      case 0: ***REMOVED***
        this.sendMailToVo(subject, message, this.selectedFacility.toString(), this.selectedProjectType, reply);
        break;
      ***REMOVED***
      case 1: ***REMOVED***
        this.sendNewsletterToVo(subject, message, reply);
        break;
      ***REMOVED***
      default:
        return
    ***REMOVED***

  ***REMOVED***

  sendNewsletterToVo(subject: string, message: string, reply?: string): void ***REMOVED***
    this.voserice.sendNewsletterToVo(encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply))
      .subscribe((result: IResponseTemplate) => ***REMOVED***
        if (<boolean><Boolean>result.value === true) ***REMOVED***
          this.emailStatus = 1;
        ***REMOVED*** else ***REMOVED***
          this.emailStatus = 2;
        ***REMOVED***
      ***REMOVED***)

  ***REMOVED***

  sendMailToVo(subject: string, message: string, facility: string, type: string, reply?: string): void ***REMOVED***
    this.voserice.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message), facility, type, encodeURIComponent(reply))
      .subscribe((result: IResponseTemplate) => ***REMOVED***
        if (<boolean><Boolean>result.value === true) ***REMOVED***

          this.emailStatus = 1;
        ***REMOVED*** else ***REMOVED***
          this.emailStatus = 2;
        ***REMOVED***
        this.selectedProjectType = 'ALL';
        this.selectedFacility = 'ALL';
      ***REMOVED***)

  ***REMOVED***

  setEmailType(type: number): void ***REMOVED***
    this.emailType = type;
    switch (this.emailType) ***REMOVED***
      case 0: ***REMOVED***
        this.emailHeader = 'Send email to all members of the vo';
        this.emailVerify = 'Are you sure you want to send this email to all members of the vo?';
        break;
      ***REMOVED***
      case 1: ***REMOVED***
        this.emailHeader = 'Send newsletter to vo';
        this.emailVerify = 'Are you sure you want to send this newsletter?';
        break;
      ***REMOVED***
      default:
        return

    ***REMOVED***

  ***REMOVED***

  public resetEmailModal(): void ***REMOVED***

    this.emailHeader = null;
    this.emailSubject = null;
    this.emailText = null;
    this.emailType = null;
    this.emailVerify = null;
    this.emailReply = '';
    this.emailStatus = 0;

  ***REMOVED***

  /**
   * Get all computecenters.
   */
  getComputeCenters(): void ***REMOVED***
    this.facilityService.getComputeCenters().subscribe(result => ***REMOVED***
      for (const cc of result) ***REMOVED***
        const compute_center: ComputecenterComponent = new ComputecenterComponent(
          cc['compute_center_facility_id'], cc['compute_center_name'],
          cc['compute_center_login'], cc['compute_center_support_mail']);
        this.computecenters.push(compute_center)
      ***REMOVED***

    ***REMOVED***)
  ***REMOVED***

  getProjectLifetime(project: Project): void ***REMOVED***
    this.details_loaded = false;
    if (!project.Lifetime) ***REMOVED***
      this.groupservice.getLifetime(project.Id.toString()).subscribe((time: IResponseTemplate) => ***REMOVED***
        const lifetime: number = <number>time.value;
        const dateCreatedString: string = project.DateCreated;

        let expirationDate: string;
        const dateCreated: Date = moment(dateCreatedString, 'DD.MM.YYYY').toDate();
        if (lifetime !== -1) ***REMOVED***
          expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
          project.LifetimeDays = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
            .diff(moment(dateCreated), 'days'));

          project.DateEnd = expirationDate;
        ***REMOVED***
        project.Lifetime = lifetime;
        this.details_loaded = true;

      ***REMOVED***)
    ***REMOVED*** else ***REMOVED***
      this.details_loaded = true;
    ***REMOVED***
  ***REMOVED***

  getVoProjects(): void ***REMOVED***
    this.voserice.getAllGroupsWithDetails().subscribe(result => ***REMOVED***
      const vo_projects = result;
      for (const group of vo_projects) ***REMOVED***
        const dateCreated: moment.Moment = moment(group['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
        const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
        const is_pi: boolean = group['is_pi'];
        const lifetime: number = group['lifetime'];

        const groupid: number = group['id'];
        const facility = group['compute_center'];
        let shortname: string = group['shortname'];
        if (!shortname) ***REMOVED***
          shortname = group['name']
        ***REMOVED***
        let compute_center: ComputecenterComponent = null;
        console.log(facility)
        if (facility) ***REMOVED***

          compute_center = new ComputecenterComponent(
            facility['compute_center_facility_id'],
            facility['compute_center_name'],
            facility['compute_center_login'],
            facility['compute_center_support_mail']);
        ***REMOVED***

        const newProject: Project = new Project(
          Number(groupid),
          shortname,
          group['description'],
          `$***REMOVED***dateCreated.date()***REMOVED***.$***REMOVED***(dateCreated.month() + 1)***REMOVED***.$***REMOVED***dateCreated.year()***REMOVED***`,
          dateDayDifference,
          is_pi,
          true,
          compute_center);
        newProject.Lifetime = lifetime;
        newProject.Status = group['status'];
        newProject.OpenStackProject = group['openstack_project'];
        let expirationDate: string = '';
        if (lifetime !== -1) ***REMOVED***
          expirationDate = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
          const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
            .diff(moment(dateCreated), 'days'));

          newProject.LifetimeDays = lifetimeDays;
          newProject.DateEnd = expirationDate;
          newProject.LifetimeReached = this.lifeTimeReached(lifetimeDays, dateDayDifference)

        ***REMOVED***

        this.projects.push(newProject);
      ***REMOVED***
      this.applyFilter();

      this.isLoaded = true;

    ***REMOVED***)
  ***REMOVED***

  getProjectStatus(project: Project): void ***REMOVED***
    this.voserice.getProjectStatus(project.Id).subscribe((res: IResponseTemplate) => ***REMOVED***
      project.Status = <number>res.value;
    ***REMOVED***)
  ***REMOVED***

  suspendProject(project: Project): void ***REMOVED***
    forkJoin(this.voserice.removeResourceFromGroup(project.Id), this.voserice.setProjectStatus(project.Id, 4)).subscribe((res: IResponseTemplate[]) => ***REMOVED***
      const removedRes: number = <number> res[0].value;
      const newProjectSatus: number = <number> res[1].value;

      project.Status = newProjectSatus;
      if (removedRes === -1) ***REMOVED***
        project.ComputeCenter = null
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***

  setProjectStatus(project: Project, status: number): void ***REMOVED***
    this.voserice.setProjectStatus(project.Id, status).subscribe(() => ***REMOVED***
      this.getProjectStatus(project)

    ***REMOVED***)
  ***REMOVED***

  removeResourceFromGroup(groupid: number | string): void ***REMOVED***
    this.voserice.removeResourceFromGroup(groupid.toString()).subscribe()
  ***REMOVED***

  getMembesOfTheProject(projectid: number, projectname: string): void ***REMOVED***
    this.voserice.getVoGroupRichMembers(projectid).subscribe(members => ***REMOVED***
        this.usersModalProjectID = projectid;
        this.usersModalProjectName = projectname;
        this.usersModalProjectMembers = new Array();
        for (const member of members) ***REMOVED***
          const member_id: number = member['id'];
          const user_id: number = member['userId'];
          const fullName: string = `$***REMOVED***member['firstName']***REMOVED***  $***REMOVED***member['lastName']***REMOVED***`;
          const newMember: ProjectMember = new ProjectMember(user_id, fullName, member_id);
          newMember.ElixirId = member['elixirId'];
          newMember.Email = member['email'];
          this.usersModalProjectMembers.push(newMember);
        ***REMOVED***

      ***REMOVED***
    )
  ***REMOVED***

  public showMembersOfTheProject(projectid: number, projectname: string, facility: [string, number]): void ***REMOVED***
    this.getMembesOfTheProject(projectid, projectname);

  ***REMOVED***

***REMOVED***
