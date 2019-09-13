import ***REMOVED***Component, ElementRef, Input, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Project***REMOVED*** from './project.model';
import ***REMOVED***ProjectMember***REMOVED*** from './project_member.model'
import ***REMOVED***environment***REMOVED*** from '../../environments/environment'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import * as moment from 'moment';
import ***REMOVED***VoService***REMOVED*** from '../api-connector/vo.service';
import ***REMOVED***ProjectMemberApplication***REMOVED*** from './project_member_application';
import ***REMOVED***ComputecenterComponent***REMOVED*** from './computecenter.component';
import ***REMOVED***Userinfo***REMOVED*** from '../userinfo/userinfo.model';
import ***REMOVED***forkJoin, Observable***REMOVED*** from 'rxjs';
import ***REMOVED***ActivatedRoute***REMOVED*** from '@angular/router';
import ***REMOVED***Application***REMOVED*** from '../applications/application.model/application.model';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from '../shared/shared_modules/baseClass/application-base-class';
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service';
import ***REMOVED***Router***REMOVED*** from '@angular/router'
import ***REMOVED***FullLayoutComponent***REMOVED*** from '../layouts/full-layout.component';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';

/**
 * Projectoverview component.
 */
@Component(***REMOVED***
             selector: 'app-project-overview',
             templateUrl: 'overview.component.html',
             providers: [FlavorService, ApplicationStatusService, ApplicationsService,
               FacilityService, VoService, UserService, GroupService, ApiSettings]
           ***REMOVED***)
export class OverviewComponent extends ApplicationBaseClass implements OnInit ***REMOVED***

  @Input() invitation_group_post: string = environment.invitation_group_post;
  @Input() voRegistrationLink: string = environment.voRegistrationLink;
  @Input() invitation_group_pre: string = environment.invitation_group_pre;
  @Input() wiki_group_invitation: string = environment.wiki_group_invitations;

  project_id: string;
  application_id: string;
  project: Project;
  application_details_visible: boolean = false;

  /**
   * id of the extension status.
   * @type ***REMOVED***number***REMOVED***
   */
  extension_status: number = 0;
  remove_members_clicked: boolean;
  life_time_string: string;

  isAdmin: boolean = false;
  invitation_link: string;
  filteredMembers: any = null;
  project_application: Application;
  application_action: string = '';
  application_member_name: string = '';
  application_action_done: boolean = false;
  application_action_success: boolean;
  application_action_error_message: boolean;
  projects: Project[] = [];
  loaded: boolean = true;
  details_loaded: boolean = false;
  userinfo: Userinfo;
  allSet: boolean = false;

  checked_member_list: number[] = [];

  // modal variables for User list
  public project_members: ProjectMember[] = [];
  public isLoaded: boolean = false;
  public showLink: boolean = true;

  constructor(private flavorService: FlavorService,
              private groupService: GroupService,
              applicationstatusservice: ApplicationStatusService,
              applicationsservice: ApplicationsService,
              facilityService: FacilityService,
              userservice: UserService,
              private activatedRoute: ActivatedRoute,
              private fullLayout: FullLayoutComponent,
              private router: Router) ***REMOVED***
    super(userservice, applicationstatusservice, applicationsservice, facilityService);
  ***REMOVED***

  approveMemberApplication(project: number, application: number, membername: string): void ***REMOVED***
    this.loaded = false;
    this.application_action_done = false;
    this.groupService.approveGroupApplication(project, application).subscribe((tmp_application: any) => ***REMOVED***
      if (tmp_application['state'] === 'APPROVED') ***REMOVED***
        this.application_action_success = true;
      ***REMOVED*** else if (tmp_application['message']) ***REMOVED***
        this.application_action_success = false;

        this.application_action_error_message = tmp_application['message'];

      ***REMOVED*** else ***REMOVED***
        this.application_action_success = false;
      ***REMOVED***

      this.application_action = 'approved';
      this.application_member_name = membername;
      this.application_action_done = true;

    ***REMOVED***);
  ***REMOVED***

  getApplication(): void ***REMOVED***
    this.applicationsservice.getApplication(this.application_id).subscribe((aj: object) => ***REMOVED***
      const newApp: Application = this.setNewApplication(aj);

      this.project_application = newApp;
      if (this.project_application) ***REMOVED***
        this.setLifetime();

        this.applicationsservice.getApplicationPerunId(this.application_id).subscribe(id => ***REMOVED***
          if (id['perun_id']) ***REMOVED***
            this.project_id = id['perun_id'];

            this.getProject();

          ***REMOVED*** else ***REMOVED***
            this.isLoaded = true;
          ***REMOVED***

        ***REMOVED***)
      ***REMOVED*** else ***REMOVED***
        this.isLoaded = true;
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  /**
   * Called whenvalues of the flavor-input-fields are changed and if so changes the values shown at the end of the form.
   * @param form the form which contains the input-fields
   */
  protected valuesChanged(form: NgForm): void ***REMOVED***
    this.totalNumberOfCores = 0;
    this.totalRAM = 0;
    for (const key in form.controls) ***REMOVED***
      if (form.controls[key].value) ***REMOVED***
        const flavor: Flavor = this.isKeyFlavor(key.toString());
        if (flavor != null) ***REMOVED***
          this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * form.controls[key].value);
          this.totalRAM = this.totalRAM + (flavor.ram * form.controls[key].value);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

  ***REMOVED***

  /**
   * Submits an renewal request for an application.
   * @param ***REMOVED***NgForm***REMOVED*** form
   */
  onSubmit(form: NgForm): void ***REMOVED***
    const values: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED*** = ***REMOVED******REMOVED***;
    for (const value in form.controls) ***REMOVED***
      if (form.controls[value].disabled) ***REMOVED***
        continue;
      ***REMOVED***
      if (form.controls[value].value) ***REMOVED***
        values[value] = form.controls[value].value;
      ***REMOVED***
    ***REMOVED***
    values['project_application_id'] = this.project_application.Id;
    values['total_cores_new'] = this.totalNumberOfCores;
    values['total_ram_new'] = this.totalRAM;
    this.requestExtension(values);

  ***REMOVED***

  /**
   * Request an extension from an application.
   * @param data
   */
  public requestExtension(data: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED***): void ***REMOVED***
    this.applicationsservice.requestRenewal(data).subscribe((result: ***REMOVED*** [key: string]: string ***REMOVED***) => ***REMOVED***
      if (result['Error']) ***REMOVED***
        this.extension_status = 2
      ***REMOVED*** else ***REMOVED***
        this.extension_status = 1;
      ***REMOVED***
      this.getApplication()

    ***REMOVED***)

  ***REMOVED***

  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors(): void ***REMOVED***
    this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
  ***REMOVED***

  /**
   * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void ***REMOVED***
    this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
  ***REMOVED***

  fillUp(date: string): string ***REMOVED***
    if (date.length === 1) ***REMOVED***
      return `0$***REMOVED***date***REMOVED***`;
    ***REMOVED***

    return date;
  ***REMOVED***

  /**
   * Returns a string with the end-date of a application which depends on the day it was approved and the lifetime in months
   * @param approval date in string when the application was approved
   * @param months number of months the application is permitted
   */
  getEndDate(months: number, approval?: string): string ***REMOVED***
    if (!approval) ***REMOVED***
      return ''
    ***REMOVED***
    let date1: Date = new Date(Number(approval.substring(0, 4)), Number(approval.substring(5, 7)) - 1, Number(approval.substring(8)));
    const month: number = date1.getMonth();
    if ((month + months) > 11) ***REMOVED***
      date1 = new Date(date1.getFullYear(), (month + months - 12), date1.getDate());
    ***REMOVED*** else ***REMOVED***
      date1.setMonth(date1.getMonth() + months);
    ***REMOVED***

    return `$***REMOVED***date1.getFullYear()***REMOVED***-$***REMOVED***this.fillUp((date1.getMonth() + 1).toString())***REMOVED***-$***REMOVED***this.fillUp(date1.getDate().toString())***REMOVED***`;
  ***REMOVED***

  setLifetime(): void ***REMOVED***

    this.life_time_string = `$***REMOVED***this.project_application.DateApproved***REMOVED*** - $***REMOVED***this.getEndDate(this.project_application.Lifetime, this.project_application.DateApproved)***REMOVED***`;

  ***REMOVED***

  /**
   * Bugfix not scrollable site after closing modal
   */
  removeModalOpen(): void ***REMOVED***
    document.body.classList.remove('modal-open');
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.getApplicationStatus();
    this.getUserinfo();
    this.getListOfFlavors();
    this.getListOfTypes();
    this.activatedRoute.params.subscribe(paramsId => ***REMOVED***
      this.isLoaded = false;
      this.project = null;
      this.project_application = null;
      this.project_members = [];
      this.application_id = paramsId.id;
      this.getApplication();

    ***REMOVED***);

  ***REMOVED***

  /**
   * Get the facility of an application.
   * @param ***REMOVED***Application***REMOVED*** app
   */
  getFacilityProject(): void ***REMOVED***

    if (!this.project_application.ComputeCenter && this.project_application.Status !== this.application_states.SUBMITTED && this.project_application.Status !== this.application_states.TERMINATED) ***REMOVED***
      this.groupService.getFacilityByGroup(this.project_application.PerunId.toString()).subscribe((res: object) => ***REMOVED***

        const login: string = res['Login'];
        const suport: string = res['Support'];
        const facilityname: string = res['Facility'];
        const facilityId: number = res['FacilityId'];
        if (facilityId) ***REMOVED***
          this.project_application.ComputeCenter = new ComputecenterComponent(facilityId.toString(), facilityname, login, suport);
        ***REMOVED***

      ***REMOVED***)
    ***REMOVED***

  ***REMOVED***

  rejectMemberApplication(project: number, application: number, membername: string): void ***REMOVED***
    this.loaded = false;
    this.application_action_done = false;

    this.groupService.rejectGroupApplication(project, application)
      .subscribe((tmp_application: any) => ***REMOVED***
                   this.project.ProjectMemberApplications = [];

                   if (tmp_application['state'] === 'REJECTED') ***REMOVED***
                     this.application_action_success = true;

                   ***REMOVED*** else if (tmp_application['message']) ***REMOVED***
                     this.application_action_success = false;

                     this.application_action_error_message = tmp_application['message'];
                   ***REMOVED*** else ***REMOVED***
                     this.application_action_success = false;
                   ***REMOVED***
                   this.application_action = 'rejected';
                   this.application_member_name = membername;
                   this.application_action_done = true;
                   this.getUserProjectApplications();

                 ***REMOVED***
      );
  ***REMOVED***

  /**
   * Get all user applications for a project.
   * @param projectId id of the project
   */
  getUserProjectApplications(): void ***REMOVED***
    this.loaded = false;
    this.groupService.getGroupApplications(this.project.Id).subscribe((applications: any) => ***REMOVED***

      const newProjectApplications: ProjectMemberApplication[] = [];
      if (applications.length === 0) ***REMOVED***
        this.loaded = true;

      ***REMOVED***
      for (const application of applications) ***REMOVED***
        const dateApplicationCreated: moment.Moment = moment(application['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
        const membername: string = application['displayName'];

        const newMemberApplication: ProjectMemberApplication =
          new ProjectMemberApplication(
            application['id'], membername,
            `$***REMOVED***dateApplicationCreated.date()***REMOVED***.$***REMOVED***(dateApplicationCreated.month() + 1)***REMOVED***.$***REMOVED***dateApplicationCreated.year()***REMOVED***`
          );
        newProjectApplications.push(newMemberApplication);

        this.project.ProjectMemberApplications = newProjectApplications;
        this.loaded = true;

      ***REMOVED***

    ***REMOVED***)

  ***REMOVED***

  getProject(): void ***REMOVED***

    this.groupService.getGroupDetails(this.project_id).subscribe((group: any) => ***REMOVED***
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
        this.isAdmin,
        compute_center);
      const lifetime: number | string = <number>group['lifetime'];
      if (lifetime !== -1) ***REMOVED***
        const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
        const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
                                                .diff(moment(dateCreated), 'days'));
        newProject.DateEnd = expirationDate;
        newProject.LifetimeDays = lifetimeDays;

      ***REMOVED***
      newProject.OpenStackProject = group['openstack_project'];
      newProject.RealName = realname;
      this.project = newProject;
      if (this.project.UserIsPi || this.project.UserIsAdmin) ***REMOVED***
        this.getMembersOfTheProject();
      ***REMOVED*** else ***REMOVED***

        this.isLoaded = true;
      ***REMOVED***
    ***REMOVED***)

  ***REMOVED***

  /**
   * Get all members of a project.
   * @param projectId id of the project
   * @param projectName
   */
  getMembersOfTheProject(): void ***REMOVED***
    this.groupService.getGroupMembers(this.project_id).subscribe((members: any) => ***REMOVED***

      this.groupService.getGroupAdminIds(this.project_id).subscribe((result: any) => ***REMOVED***
        this.project_members = [];

        const admindIds: any = result['adminIds'];
        for (const member of members) ***REMOVED***
          const member_id: string = member['id'];
          const user_id: string = member['userId'];
          const fullName: string = `$***REMOVED***member['firstName']***REMOVED*** $***REMOVED***member['lastName']***REMOVED***`;
          const projectMember: ProjectMember = new ProjectMember(user_id, fullName, member_id);
          projectMember.ElixirId = member['elixirId'];
          projectMember.IsPi = admindIds.indexOf(user_id) !== -1;
          this.project_members.push(projectMember);

        ***REMOVED***
        this.isLoaded = true;

      ***REMOVED***)

    ***REMOVED***);
  ***REMOVED***

  setAllMembersChecked(): void ***REMOVED***
    if (!this.allSet) ***REMOVED***
      this.project_members.forEach((member: ProjectMember) => ***REMOVED***
        if (!this.isMemberChecked(parseInt(member.MemberId.toString(), 10)) && this.userinfo.MemberId.toString() !== member.MemberId.toString()) ***REMOVED***
          this.checked_member_list.push(parseInt(member.MemberId.toString(), 10));
        ***REMOVED***
      ***REMOVED***);
      this.allSet = true;
    ***REMOVED*** else ***REMOVED***
      this.checked_member_list = [];
      this.allSet = false;
    ***REMOVED***
  ***REMOVED***

  isMemberChecked(id: number): boolean ***REMOVED***
    return this.checked_member_list.indexOf(id) > -1;

  ***REMOVED***

  checkIfAllMembersChecked(): void ***REMOVED***
    let all_set: boolean = true;
    this.project_members.forEach((member: ProjectMember) => ***REMOVED***
      if (!this.isMemberChecked(parseInt(member.MemberId.toString(), 10)) && this.userinfo.MemberId !== member.MemberId) ***REMOVED***
        all_set = false;

      ***REMOVED***
    ***REMOVED***);

    this.allSet = all_set;

  ***REMOVED***

  checkUnCheckMember(id: number): void ***REMOVED***
    const indexOf: number = this.checked_member_list.indexOf(id);
    if (indexOf !== -1) ***REMOVED***
      this.checked_member_list.splice(indexOf, 1);
      this.allSet = false;

    ***REMOVED*** else ***REMOVED***
      this.checked_member_list.push(id);
      this.checkIfAllMembersChecked()

    ***REMOVED***

  ***REMOVED***

  removeCheckedMembers(groupId: number | string): void ***REMOVED***
    this.remove_members_clicked = true;

    const members_in: ProjectMember[] = [];

    const observables: Observable<number>[] = this.checked_member_list
      .map((id: number) => this.groupService.removeMember(groupId, id, this.project.ComputeCenter.FacilityId));
    forkJoin(observables).subscribe(() => ***REMOVED***

      this.project_members.forEach((member: ProjectMember) => ***REMOVED***

        if (!this.isMemberChecked(parseInt(member.MemberId.toString(), 10))) ***REMOVED***
          members_in.push(member)

        ***REMOVED***

      ***REMOVED***);
      this.project_members = members_in;
      this.checked_member_list = [];
      this.allSet = false;
      this.remove_members_clicked = false;

    ***REMOVED***);
    this.allSet = false;
  ***REMOVED***

  resetCheckedMemberList(): void ***REMOVED***
    this.allSet = false;
    this.checked_member_list = [];
  ***REMOVED***

  setAddUserInvitationLink(): void ***REMOVED***
    const uri: string = this.invitation_group_pre + this.project.RealName + this.invitation_group_post + this.project.RealName;
    this.invitation_link = uri;

  ***REMOVED***

  copyToClipboard(text: string): void ***REMOVED***
    document.addEventListener('copy', (clipEvent: ClipboardEvent) => ***REMOVED***
      clipEvent.clipboardData.setData('text/plain', (text));
      clipEvent.preventDefault();
      document.removeEventListener('copy', null);
    ***REMOVED***);
    document.execCommand('copy');
  ***REMOVED***

  filterMembers(searchString: string): void ***REMOVED***
    this.userservice.getFilteredMembersOfdeNBIVo(searchString).subscribe((result: object) => ***REMOVED***
      this.filteredMembers = result;
    ***REMOVED***)
  ***REMOVED***

  isPi(member: ProjectMember): string ***REMOVED***
    if (member.IsPi) ***REMOVED***
      return 'blue'
    ***REMOVED*** else ***REMOVED***
      return 'black'
    ***REMOVED***

  ***REMOVED***

  getUserinfo(): void ***REMOVED***
    this.userservice.getUserInfo().subscribe((userinfo: any) => ***REMOVED***
      this.userinfo = new Userinfo(userinfo);
    ***REMOVED***)
  ***REMOVED***

  public addMember(groupid: number, memberid: number, firstName: string, lastName: string): void ***REMOVED***
    this.groupService.addMember(groupid, memberid, this.project.ComputeCenter.FacilityId).subscribe(
      (result: any) => ***REMOVED***
        if (result.status === 200) ***REMOVED***
          this.updateNotificationModal('Success', `Member $***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** added.`, true, 'success');
          this.getMembersOfTheProject()
        ***REMOVED*** else ***REMOVED***

          this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
        ***REMOVED***
      ***REMOVED***,
      (error: any) => ***REMOVED***

        if (error['name'] === 'AlreadyMemberException') ***REMOVED***
          this.updateNotificationModal('Info', `$***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** is already a member of the project.`, true, 'info');
        ***REMOVED*** else ***REMOVED***
          this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
        ***REMOVED***
      ***REMOVED***);

  ***REMOVED***

  calculateRamCores(): void ***REMOVED***
    this.totalNumberOfCores = 0;
    this.totalRAM = 0;
    for (const key in this.project_application.CurrentFlavors) ***REMOVED***
      const flavor = this.project_application.CurrentFlavors[key];
      if (flavor != null) ***REMOVED***
        this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * flavor.counter);
        this.totalRAM = this.totalRAM + (flavor.ram * flavor.counter);

      ***REMOVED***

    ***REMOVED***
  ***REMOVED***

  public addAdmin(groupId: number, memberId: number, userId: number, firstName: string, lastName: string): void ***REMOVED***
    this.groupService.addMember(groupId, memberId, this.project.ComputeCenter.FacilityId).subscribe(
      () => ***REMOVED***
        this.groupService.addAdmin(groupId, userId, this.project.ComputeCenter.FacilityId).subscribe(
          (result: any) => ***REMOVED***

            if (result.status === 200) ***REMOVED***
              this.updateNotificationModal('Success', `Admin $***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** added.`, true, 'success');
              this.getMembersOfTheProject();
            ***REMOVED*** else ***REMOVED***
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            ***REMOVED***
          ***REMOVED***,
          (error: any) => ***REMOVED***
            if (error['name'] === 'AlreadyAdminException') ***REMOVED***
              this.updateNotificationModal(
                'Info', `$***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** is already a admin of the project.`,
                true, 'info');
            ***REMOVED*** else ***REMOVED***
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            ***REMOVED***
          ***REMOVED***)
      ***REMOVED***,
      () => ***REMOVED***
        this.groupService.addAdmin(groupId, userId, this.project.ComputeCenter.FacilityId).subscribe(
          (result: any) => ***REMOVED***

            if (result.status === 200) ***REMOVED***
              this.updateNotificationModal('Success', `Admin $***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** added.`, true, 'success');
              this.getMembersOfTheProject();

            ***REMOVED*** else ***REMOVED***
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            ***REMOVED***
          ***REMOVED***,
          (error: any) => ***REMOVED***
            if (error['name'] === 'AlreadyAdminException') ***REMOVED***
              this.updateNotificationModal(
                'Info', `$***REMOVED***firstName***REMOVED*** $***REMOVED***lastName***REMOVED*** is already a admin of the project.`,
                true, 'info');
            ***REMOVED*** else ***REMOVED***
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            ***REMOVED***
          ***REMOVED***)
      ***REMOVED***)
  ***REMOVED***

  public promoteAdmin(groupid: number, userid: number, username: string): void ***REMOVED***

    this.groupService.addAdmin(groupid, userid, this.project.ComputeCenter.FacilityId).toPromise()
      .then((result: any) => ***REMOVED***

        if (result.status === 200) ***REMOVED***
          this.updateNotificationModal('Success', `$***REMOVED***username***REMOVED*** promoted to Admin`, true, 'success');
          this.getMembersOfTheProject();

        ***REMOVED*** else ***REMOVED***
          this.updateNotificationModal('Failed', `$***REMOVED***username***REMOVED*** could not be promoted to Admin!`, true, 'danger');
        ***REMOVED***
      ***REMOVED***).catch(() => ***REMOVED***
      this.updateNotificationModal('Failed', `$***REMOVED***username***REMOVED*** could not be promoted to Admin!`, true, 'danger');
    ***REMOVED***);
  ***REMOVED***

  public removeAdmin(groupid: number, userid: number, name: string): void ***REMOVED***

    this.groupService.removeAdmin(groupid, userid, this.project.ComputeCenter.FacilityId).toPromise()
      .then((result: any) => ***REMOVED***

        if (result.status === 200) ***REMOVED***
          this.updateNotificationModal('Success', `$***REMOVED***name***REMOVED*** was removed as Admin`, true, 'success');
          this.getMembersOfTheProject()
        ***REMOVED*** else ***REMOVED***
          this.updateNotificationModal('Failed', `$***REMOVED***name***REMOVED*** could not be removed as Admin!`, true, 'danger');
        ***REMOVED***
      ***REMOVED***).catch(() => ***REMOVED***
      this.updateNotificationModal('Failed', `$***REMOVED***name***REMOVED*** could not be removed as Admin!`, true, 'danger'
      );
    ***REMOVED***);
  ***REMOVED***

  /**
   * Remove an member from a group.
   * @param groupid  of the group
   * @param memberid of the member
   * @param name  of the member
   */
  public removeMember(groupid: number, memberid: number, name: string): void ***REMOVED***
    const indexOf: number = this.checked_member_list.indexOf(memberid);
    if (indexOf !== -1) ***REMOVED***
      this.checked_member_list.splice(indexOf, 1);
      this.allSet = false;
    ***REMOVED***

    this.groupService.removeMember(groupid, memberid, this.project.ComputeCenter.FacilityId).subscribe(
      (result: any) => ***REMOVED***

        if (result.status === 200) ***REMOVED***
          this.updateNotificationModal('Success', `Member $***REMOVED***name***REMOVED***  removed from the group`, true, 'success');
          this.getMembersOfTheProject()

        ***REMOVED*** else ***REMOVED***
          this.updateNotificationModal('Failed', `Member $***REMOVED***name***REMOVED***  could not be removed !`, true, 'danger');
        ***REMOVED***
      ***REMOVED***,
      () => ***REMOVED***
        this.updateNotificationModal('Failed', `Member $***REMOVED***name***REMOVED***  could not be removed !`, true, 'danger');
      ***REMOVED***);
  ***REMOVED***

  /**
   * Delete an application.
   * @param application_id
   */
  public deleteApplication(): void ***REMOVED***
    this.applicationsservice.deleteApplication(this.project_application.Id).subscribe(
      () => ***REMOVED***
        this.updateNotificationModal('Success', 'The application has been successfully removed', true, 'success');
        this.fullLayout.getGroupsEnumeration();
        this.router.navigate(['/userinfo'])
      ***REMOVED***,
      () => ***REMOVED***
        this.updateNotificationModal('Failed', 'Application could not be removed!', true, 'danger');
      ***REMOVED***)

  ***REMOVED***

  public comingSoon(): void ***REMOVED***
    alert('This function will be implemented soon.')
  ***REMOVED***
***REMOVED***
