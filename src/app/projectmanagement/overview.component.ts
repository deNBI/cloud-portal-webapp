<<<<<<< HEAD
import ** * REMOVED ** * Component, Input, ViewChild ** * REMOVED ** * from '@angular/core';
import ** * REMOVED ** * AuthzResolver ** * REMOVED ** * from '../perun-connector/authz-resolver.service'
import ** * REMOVED ** * GroupsManager ** * REMOVED ** * from '../perun-connector/groups-manager.service'
import ** * REMOVED ** * MembersManager ** * REMOVED ** * from '../perun-connector/members-manager.service'
import ** * REMOVED ** * UsersManager ** * REMOVED ** * from '../perun-connector/users-manager.service'
import ** * REMOVED ** * Http ** * REMOVED ** * from '@angular/http';
import ** * REMOVED ** * PerunSettings ** * REMOVED ** * from '../perun-connector/connector-settings.service';
import ** * REMOVED ** * Project ** * REMOVED ** * from './project.model';
import ** * REMOVED ** * ModalDirective ** * REMOVED ** * from 'ngx-bootstrap/modal/modal.component';
import ** * REMOVED ** * ProjectMember ** * REMOVED ** * from './project_member.model'
import ** * REMOVED ** * ResourcesManager ** * REMOVED ** * from '../perun-connector/resources_manager';
       import 'rxjs/add/operator/toPromise';
import ** * REMOVED ** * isNumber ** * REMOVED ** * from 'util';
import ** * REMOVED ** * environment ** * REMOVED ** * from '../../environments/environment'
import ** * REMOVED ** * ApiSettings ** * REMOVED ** * from '../api-connector/api-settings.service';
import ** * REMOVED ** * GroupService ** * REMOVED ** * from '../api-connector/group.service';

       @Component( ** * REMOVED ** *
    templateUrl:   'overview.component.html',
                   providers: [GroupService, ResourcesManager, AuthzResolver, GroupsManager, MembersManager, UsersManager, PerunSettings, ApiSettings]
** * REMOVED ** * )
export class OverviewComponent ** * REMOVED ** *

  debug_module = false;

       @Input() voRegistrationLink: string = environment.voRegistrationLink;

       userprojects:    ** * REMOVED ** ** ** REMOVED ** * ;
       userid: number;
       member_id: number;
       user_data:    ** * REMOVED ** ** ** REMOVED ** * ;
       admingroups:    ** * REMOVED ** ** ** REMOVED ** * ;
       adminvos:    ** * REMOVED ** ** ** REMOVED ** * ;
       filteredMembers = null;
       projects: Project[] = new Array();

  // modal variables for User list
  public usersModal;
  public usersModalProjectMembers: ProjectMember[] = new Array;
  public usersModalProjectID: number;
  public usersModalProjectName: string;

  // modal variables for Add User Modal
  public addUserModal;
  public addUserModalProjectID: number;
  public addUserModalProjectName: string;
  public UserModalFacility: string;

  // notification Modal variables
  public notificationModal;
  public notificationModalTitle: string = 'Notification';
  public notificationModalMessage: string = 'Please wait...';
  public notificationModalType: string = 'info';
  public notificationModalIsClosable: boolean = false;

       constructor(private authzresolver: AuthzResolver,
                   private perunsettings: PerunSettings,
                   private useresmanager: UsersManager,
                   private groupsmanager: GroupsManager,
                   private membersmanager: MembersManager,
                   private  resourceManager: ResourcesManager,
                   private groupservice: GroupService) ** * REMOVED ** *
    this.getUserProjects(groupsmanager, membersmanager, useresmanager); 
       ** * REMOVED ** *

  public updateUserProjects() ** * REMOVED ** *
    this.projects = [];
       this.getUserProjects(this.groupsmanager, this.membersmanager, this.useresmanager); 
       ** * REMOVED ** *

    getUserProjects(groupsmanager: GroupsManager,
                    membersmanager: MembersManager,
                    usersmanager: UsersManager) ** * REMOVED ** *
        let user_id: number;
       let member_id: number;
       let user_projects:    ** * REMOVED ** ** ** REMOVED ** * ;
       let user_data:    ** * REMOVED ** ** ** REMOVED ** * ;
       let admin_groups:    ** * REMOVED ** ** ** REMOVED ** * ;
       let admin_vos:    ** * REMOVED ** ** ** REMOVED ** * ;

       this.authzresolver
            .getLoggedUser().toPromise()
            .then(function (userdata) ** * REMOVED ** *
                // TODO catch errors
                let userid = userdata.json()['id'];
       user_id = userid;
       user_data = userdata.json();

       return membersmanager.getMemberByUser(userid).toPromise(); 
       ** * REMOVED ** * )
            .then(function (memberdata) ** * REMOVED ** *
                let memberid = memberdata.json()['id'];
       member_id = memberid;

       return groupsmanager.getMemberGroups(memberid).toPromise(); 
       ** * REMOVED ** * ).then(function (groupsdata) ** * REMOVED ** *
            user_projects =     groupsdata.json(); 
       ** * REMOVED ** * ).then(function () ** * REMOVED ** *

       return usersmanager.getGroupsWhereUserIsAdmin(user_id).toPromise(); 
       ** * REMOVED ** * ).then(function (admingroups) ** * REMOVED ** *
            admin_groups =      admingroups.json(); 
       ** * REMOVED ** * ).then(function () ** * REMOVED ** *

       return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise(); 
       ** * REMOVED ** * ).then(function (adminvos) ** * REMOVED ** *
            admin_vos =         adminvos.json(); 
       ** * REMOVED ** * ).then(result => ** * REMOVED ** *

            // hold data in the class just in case
            this.userprojects = user_projects;
       this.userid = user_id;
       this.user_data = user_data;
       this.member_id = member_id;
       this.admingroups = admin_groups;
       this.adminvos = admin_vos;

       const is_admin = false;
            // check if user is a Vo admin so we can serv according buttons
       for (const vkey in this.adminvos) { ** * REMOVED ** * }
       if (this.adminvos[vkey]['id'] == this.perunsettings.getPerunVO().toString()) { ** * REMOVED ** *
                    is_admin
       } = true;
       break; 
       ** * REMOVED ** *
            ** * REMOVED ** *

       for (const key in this.userprojects) { ** * REMOVED ** *
                let
       } group = this.userprojects[key];
       const dateCreated = new Date(group['createdAt']);
       const dateDayDifference = Math.ceil((Math.abs(Date.now() - dateCreated.getTime())) / (1000 * 3600 * 24));
       const is_pi = false;

                // check if user is a PI (group manager)
       if (!is_admin) { ** * REMOVED ** * }
       for (const gkey in this.admingroups) { ** * REMOVED ** * }
       if (group['id'] == this.admingroups[gkey]['id']) { ** * REMOVED ** *
                            is_pi
       } = true;
       break; 
       ** * REMOVED ** *
                    ** * REMOVED ** *
                ** * REMOVED ** * else ** * REMOVED ** *
                    is_pi = true; 
       ** * REMOVED ** *
                this.resourceManager.getGroupAssignedResources(group['id']).subscribe(resource => ** * REMOVED ** *
       try ** * REMOVED ** *
                        let resource_id = resource.json()[0]['id'];
       this.resourceManager.getFacilityByResource(resource_id).subscribe(facility => ** * REMOVED ** *
                            let                                          newProject = new Project(
                                group['id'],
                                group['name'],
                                group['description'],
                                dateCreated.getDate() + '.' + (dateCreated.getMonth() + 1) + '.' + dateCreated.getFullYear(),
                                dateDayDifference,
                                is_pi,
                                is_admin,
                                facility.json()['name'])
       try ** * REMOVED ** *
                                this.groupservice.getComputeCentersDetails(resource_id).subscribe(details => ** * REMOVED ** *
       if (details) { ** * REMOVED ** *
                                        let
       } details_array = [];
       for (const detail in details) { ** * REMOVED ** *
                                            let
       } detail_as_string = detail + ': ' + details[detail];
       details_array.push(detail_as_string); 
       ** * REMOVED ** *
                                        newProject.ComputecenterDetails = details_array; 
       ** * REMOVED ** *
                                    this.projects.push(newProject); 

       ** * REMOVED ** * )
       ** * REMOVED ** * catch (e) ** * REMOVED ** *
                                this.projects.push(newProject); 
       ** * REMOVED ** *

                        ** * REMOVED ** * )
       ** * REMOVED ** * catch (e) ** * REMOVED ** *

                        this.projects.push(new Project(
                            group['id'],
                            group['name'],
                            group['description'],
                            dateCreated.getDate() + '.' + (dateCreated.getMonth() + 1) + '.' + dateCreated.getFullYear(),
                            dateDayDifference,
                            is_pi,
                            is_admin,
                            'None')
                        ); 

       ** * REMOVED ** *
                ** * REMOVED ** * )

       ** * REMOVED ** *

        ** * REMOVED ** * ); 
        // .then( function()***REMOVED*** groupsmanager.getGroupsWhereUserIsAdmin(this.userid); ***REMOVED***);
       ** * REMOVED ** *

  public resetAddUserModal() ** * REMOVED ** *
    this.addUserModalProjectID = null;
       this.addUserModalProjectName = null;
       this.UserModalFacility = null; 
       ** * REMOVED ** *

  filterMembers(firstName: string, lastName: string, groupid: number) ** * REMOVED ** *
    this.membersmanager.getMembersOfdeNBIVo(firstName, lastName, groupid.toString()).subscribe(result => ** * REMOVED ** *
      this.filteredMembers =                                                                   result; 
       ** * REMOVED ** * )
       ** * REMOVED ** *

  getMembesOfTheProject(projectid: number, projectname: string) ** * REMOVED ** *
    this.groupsmanager.getGroupRichMembers(projectid).toPromise()
      .then(function (members_raw) ** * REMOVED ** *

       return members_raw.json(); 
       ** * REMOVED ** * ).then(members => ** * REMOVED ** *
      this.usersModalProjectID = projectid;
       this.usersModalProjectName = projectname;
       this.usersModalProjectMembers = new Array();
       for (const member of members) { ** * REMOVED ** *
        let
       } member_id = member['id'];
       let user_id = member['userId'];
       const fullName = member['user']['firstName'] + ' ' + member['user']['lastName'];
       this.usersModalProjectMembers.push(new ProjectMember(user_id, fullName, member_id)); 
       ** * REMOVED ** *

    ** * REMOVED ** * ); 
       ** * REMOVED ** *

  public showMembersOfTheProject(projectid: number, projectname: string, facility: string) ** * REMOVED ** *
    this.getMembesOfTheProject(projectid, projectname);
       if (facility === 'None') { ** * REMOVED ** *
      this.UserModalFacility
       } = null; 
       ** * REMOVED ** *
    else ** * REMOVED ** *
      this.UserModalFacility = facility; 
       ** * REMOVED ** *
  ** * REMOVED ** *

  public resetNotificaitonModal() ** * REMOVED ** *
    this.notificationModalTitle = 'Notification';
       this.notificationModalMessage = 'Please wait...';
       this.notificationModalIsClosable = false;
       this.notificationModalType = 'info'; 
       ** * REMOVED ** *

  public updateNotificaitonModal(title: string, message: string, closable: true, type: string) ** * REMOVED ** *
    this.notificationModalTitle = title;
       this.notificationModalMessage = message;
       this.notificationModalIsClosable = closable;
       this.notificationModalType = type; 
       ** * REMOVED ** *

  public makeNotificationModalClosable(closable: boolean) ** * REMOVED ** *
    this.notificationModalIsClosable = closable; 
       ** * REMOVED ** *

  public changeNotificationModalTitle(title: string) ** * REMOVED ** *
    this.notificationModalTitle = title; 
       ** * REMOVED ** *

  public changeNotificationModalMessage(message: string) ** * REMOVED ** *
    this.notificationModalMessage = message; 
       ** * REMOVED ** *

  public changeNotificationModalType(type: string) ** * REMOVED ** *
    this.notificationModalType = type; 
       ** * REMOVED ** *

  public showAddUserToProjectModal(projectid: number, projectname: string, facility: string) ** * REMOVED ** *
      this.addUserModalProjectID = projectid;
       this.addUserModalProjectName = projectname;
       if (facility === 'None') { ** * REMOVED ** *
          this.UserModalFacility
       } = null; 
       ** * REMOVED ** *
      else ** * REMOVED ** *
          this.UserModalFacility = facility; 

       ** * REMOVED ** *
  ** * REMOVED ** *

    public addMember(groupid: number, memberid: number, firstName: string, lastName: string) ** * REMOVED ** *
        this.groupsmanager.addMember(groupid, memberid).toPromise()
            .then(result => ** * REMOVED ** *
       if (result.status == 200) { ** * REMOVED ** *
                    this.updateNotificaitonModal('Success', 'Member ' + firstName + ' ' + lastName + ' added.', true, 'success');
       }

       ** * REMOVED ** * else ** * REMOVED ** *
                    this.updateNotificaitonModal('Failed', 'Member could not be added!', true, 'danger'); 
       ** * REMOVED ** *
            ** * REMOVED ** * ). catch (error => ** * REMOVED ** *
            this.updateNotificaitonModal('Failed', 'Member could not be added!', true, 'danger'); 
       ** * REMOVED ** * ); 
       ** * REMOVED ** *

    public removeMember(groupid: number, memberid: number, name: string) ** * REMOVED ** *
        this.groupsmanager.removeMember(groupid, memberid).toPromise()
            .then(result => ** * REMOVED ** *
       if (result.status == 200) { ** * REMOVED ** *
                    this.updateNotificaitonModal('Success', 'Member ' + name + ' removed from the group', true, 'success');
       }

       ** * REMOVED ** * else ** * REMOVED ** *
                    this.updateNotificaitonModal('Failed', 'Member'  + name + ' could not be removed !', true, 'danger'); 
       ** * REMOVED ** *
            ** * REMOVED ** * ). catch (error => ** * REMOVED ** *
            this.updateNotificaitonModal('Failed', 'Member'  + name + ' could not be removed !', true, 'danger'); 
       ** * REMOVED ** * ); 
       ** * REMOVED ** *

    public comingSoon() ** * REMOVED ** *
        alert('This function will be implemented soon.')
    ** * REMOVED ** *
** * REMOVED ** *
=======
import {Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Project} from './project.model';
import {ProjectMember} from './project_member.model'
import {environment} from '../../environments/environment'
import {ApiSettings} from '../api-connector/api-settings.service';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import * as moment from 'moment';
import {ProjectMemberApplication} from './project_member_application';
import {ComputecenterComponent} from './computecenter.component';
import {Userinfo} from '../userinfo/userinfo.model';
import {forkJoin, Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Application} from '../applications/application.model/application.model';
import {ApplicationBaseClassComponent} from '../shared/shared_modules/baseClass/application-base-class.component';
import {ApplicationStatusService} from '../api-connector/application-status.service';
import {FacilityService} from '../api-connector/facility.service';
import {ApplicationsService} from '../api-connector/applications.service';
import {FullLayoutComponent} from '../layouts/full-layout.component';
import {NgForm} from '@angular/forms';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {FlavorService} from '../api-connector/flavor.service';
import {CreditsService} from '../api-connector/credits.service';
import {is_vo} from '../shared/globalvar';
import {WIKI_GROUP_INVITATIONS} from '../../links/links';
import {Doi} from '../applications/doi/doi';
import {EdamOntologyTerm} from '../applications/edam-ontology-term';
import {AutocompleteComponent} from 'angular-ng-autocomplete';
import {DOCUMENT} from '@angular/common';
import {Chart} from 'chart.js';

/**
 * Projectoverview component.
 */
@Component({
             selector: 'app-project-overview',
             templateUrl: 'overview.component.html',
             providers: [FlavorService, ApplicationStatusService, ApplicationsService,
               FacilityService, UserService, GroupService, ApiSettings, CreditsService]
           })
export class OverviewComponent extends ApplicationBaseClassComponent implements OnInit, OnDestroy {

  @Input() invitation_group_post: string = environment.invitation_group_post;
  @Input() voRegistrationLink: string = environment.voRegistrationLink;
  @Input() invitation_group_pre: string = environment.invitation_group_pre;
  WIKI_GROUP_INVITATIONS: string = WIKI_GROUP_INVITATIONS;
  selected_ontology_terms: EdamOntologyTerm[] = [];
  edam_ontology_terms: EdamOntologyTerm[];
  ontology_search_keyword: string = 'term';

  @ViewChild(NgForm, { static: false }) simpleVmForm: NgForm;
  @ViewChild('creditsChart', { static: false }) creditsCanvas: ElementRef;

  /**
   * If at least 1 flavor is selected.
   * @type {boolean}
   */
  public min_vm: boolean = true;

  /**
   * The credits for the extension.
   */
  private extensionCredits: number = 0;

  project_id: string;
  application_id: string;
  project: Project;
  application_details_visible: boolean = false;
  credits: number = 0;

  errorMessage: string;

  /**
   * id of the extension status.
   * @type {number}
   */
  extension_status: number = 0;
  newDoi: string;
  remove_members_clicked: boolean;
  life_time_string: string;
  dois: Doi[];
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
  renderer: Renderer2;
  smallExampleFlavor: Flavor;
  largeExampleFlavor: Flavor;
  smallExamplePossibleHours: number = 0;
  largeExamplePossibleHours: number = 0;
  creditsPerHourSmallExample: number;
  creditsPerHourLargeExample: number;
  smallExamplePossibleDays: string = '';
  largeExamplePossibleDays: string = '';

  title: string = 'Project Overview';
  @ViewChild('edam_ontology', { static: false }) edam_ontology: AutocompleteComponent;

  checked_member_list: number[] = [];

  // modal variables for User list
  public project_members: ProjectMember[] = [];
  public isLoaded: boolean = false;
  public showLink: boolean = true;
  private project_application_extra_credits: number;
  public project_application_extra_credits_comment: string;
  private current_credits: number = 0;
  project_application_renewal_lifetime: number;
  private updateCreditsUsedIntervals: number;

  private updateCreditHistoryIntervals: number;

  creditsChart: any;

  constructor(private flavorService: FlavorService,
              private groupService: GroupService,
              applicationstatusservice: ApplicationStatusService,
              applicationsservice: ApplicationsService,
              facilityService: FacilityService,
              userservice: UserService,
              private activatedRoute: ActivatedRoute,
              private fullLayout: FullLayoutComponent,
              private router: Router,
              private creditsService: CreditsService,
              @Inject(DOCUMENT) private document: Document) {
    super(userservice, applicationstatusservice, applicationsservice, facilityService);
  }

  async delay(ms: number): Promise<any> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve: any) => {
      setTimeout(resolve, ms)
    });
  }

  setModalOpen(bool: boolean): void {
    // tslint:disable-next-line:typedef
    (async () => {
        await this.delay(750).then().catch(); // needed, because bootstraps class-toggle-function seems to be too slow
        if (bool) {
          this.document.body.classList.add('modal-open');
        } else {
          this.document.body.classList.remove('modal-open');
        }
      }
    )().then().catch();
  }

  printSometing(text: any): void {
    console.log(text);
  }

  removeEDAMterm(term: EdamOntologyTerm): void {
    const indexOf: number = this.selected_ontology_terms.indexOf(term);
    this.selected_ontology_terms.splice(indexOf, 1);

  }

  selectEvent(item: any): void {
    if (this.selected_ontology_terms.indexOf(item) === -1) {
      this.selected_ontology_terms.push(item);
    }
    this.edam_ontology.clear();
  }

  calculateCredits(lifetime: number): void {
    // tslint:disable-next-line:triple-equals
    if (lifetime == null || isNaN(lifetime)) {
      lifetime = 0;
    }
    // tslint:disable-next-line:max-line-length
    this.creditsService.getExtraCreditsForExtension(this.totalNumberOfCores, this.totalRAM, lifetime, this.project_application.Id.toString()).toPromise()
      .then((credits: number) => {
        this.extensionCredits = credits;
      }).catch((err: Error) => console.log(err.message));
  }

  fetchCurrentCreditsOfProject(): void {
    if (this.project_application != null) {
      this.creditsService.getCurrentCreditsOfProject(Number(this.project_application.PerunId.toString())).toPromise().then(
        (credits: number) => {
          this.current_credits = credits;
        }
      ).catch((err: Error) => console.log(err.message))
    } else {
      console.log(this.project_application)
    }
    this.fetchCreditHistoryOfProject();
  }

  fetchCreditHistoryOfProject(): void {
    if (this.project != null) {
      this.creditsService.getCreditsUsageHistoryOfProject(Number(this.project.Id.toString())).toPromise()
        .then((response: {}) => {
          // tslint:disable-next-line:triple-equals
                if (response['data_points'] != undefined) {
                  const data_points: number[] = response['data_points'];
                  const ceiling_line: number[] = [];
                  const ceiling_value: number = Math.max.apply(null, data_points);
                  // tslint:disable-next-line:id-length prefer-for-of
                  for (let i: number = 0; i < data_points.length; i++) {
                    ceiling_line.push(ceiling_value);
                  }
                  this.creditsChart = new Chart(this.creditsCanvas.nativeElement, {
                    type: 'line',
                    data: {
                      labels: response['time_points'],
                      datasets: [{
                        label: 'Credit Usage',
                        data: data_points,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)'
                      }, {
                        label: 'Current Credits Used',
                        data: ceiling_line,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false,
                        bezierCurve: false,
                        pointRadius: 0,
                        tooltip: false
                      }]
                    },
                    options: {
                      animation: {
                        duration: 0
                      }
                    }
                  })
                }
              }
        ).catch((err: Error) => console.log(err.message));
    }
  }

  updateExampleCredits(numberOfCredits: number): void {
    const totalHoursSmall: number = Math.round((numberOfCredits / this.creditsPerHourSmallExample));
    const totalHoursLarge: number = Math.round((numberOfCredits / this.creditsPerHourLargeExample)) ;
    this.smallExamplePossibleHours = totalHoursSmall % 24;
    this.largeExamplePossibleHours = totalHoursLarge % 24;
    this.smallExamplePossibleDays = this.updateCreditsDaysString(totalHoursSmall);
    this.largeExamplePossibleDays = this.updateCreditsDaysString(totalHoursLarge);
  }

  updateCreditsDaysString(hours: number): string {
    let daysString: string = '';
    if (Math.floor(hours / 24) === 1) {
      daysString = ' day';
    } else if (Math.floor(hours / 24) > 1) {
      daysString = ' days';
    }
    if (daysString !== '') {
      return Math.floor(hours / 24).toString();
    }

    return ''
}

  startUpdateCreditUsageLoop(): void {
    this.updateCreditsUsedIntervals = setInterval(
      () =>
        this.creditsService.getCurrentCreditsOfProject(Number(this.project_application.PerunId.toString())).toPromise().then(
          (credits: number) => {
            this.current_credits = credits;
          }
          // tslint:disable-next-line:align
        ).catch((err: Error) => console.log(err.message)), 5000);
  }

  initExampleFlavors(): void {
    const standardFlavors: Flavor[] = this.flavorList.
    filter((fl: Flavor, nu: number, arr: Flavor[]) => fl.type.long_name === 'Standard Flavours');
    const highMemFlavors: Flavor[] = this.flavorList.
    filter((fl: Flavor, nu: number, arr: Flavor[]) => fl.type.long_name === 'High Memory Flavours');
    standardFlavors.sort((fl1: Flavor, fl2: Flavor) => fl1.vcpus - fl2.vcpus);
    highMemFlavors.sort((fl1: Flavor, fl2: Flavor) => fl1.vcpus - fl2.vcpus);
    if (standardFlavors.length !== 0) {
      this.smallExampleFlavor = standardFlavors[0];
      this.creditsService.getCreditsPerHour(this.smallExampleFlavor.vcpus, this.smallExampleFlavor.ram).toPromise()
        .then((credits: number) => {
          this.creditsPerHourSmallExample = credits * 4;
        }).catch((err: Error) => console.log(err.message));
    }
    if (highMemFlavors.length !== 0) {
      this.largeExampleFlavor = highMemFlavors[0];
      this.creditsService.getCreditsPerHour(this.largeExampleFlavor.vcpus, this.largeExampleFlavor.ram).toPromise()
        .then((credits: number) => {
          this.creditsPerHourLargeExample = credits;
        }).catch((err: Error) => console.log(err.message));
    }
  }

  approveMemberApplication(project: number, application: number, membername: string): void {
    this.loaded = false;
    this.application_action_done = false;
    this.groupService.approveGroupApplication(project, application).subscribe((tmp_application: any) => {
      if (tmp_application['state'] === 'APPROVED') {
        this.application_action_success = true;
      } else if (tmp_application['message']) {
        this.application_action_success = false;

        this.application_action_error_message = tmp_application['message'];

      } else {
        this.application_action_success = false;
      }

      this.application_action = 'approved';
      this.application_member_name = membername;
      this.application_action_done = true;
      this.getUserProjectApplications();
      this.getMembersOfTheProject();
      this.loaded = true;

    });
  }

  getApplication(): void {
    this.applicationsservice
      .getApplication(this.application_id)
      .subscribe(
        (aj: object) => {
          if (aj['project_application_name'] === '') {
            this.isLoaded = false;
            this.errorMessage = 'Not found';

            return;
          }
          const newApp: Application = this.setNewApplication(aj);

          this.project_application = newApp;
          if (this.project_application) {
            this.setLifetime();
            this.applicationsservice.getApplicationPerunId(this.application_id).subscribe((id: any) => {
              if (id['perun_id']) {
                this.project_id = id['perun_id'];

                this.getProject();

              } else {
                this.isLoaded = true;
              }

            })
          } else {
            this.isLoaded = true;
          }
        },
        (error: any) => {
          this.isLoaded = false;
          this.errorMessage = `Status: ${error.status.toString()},
                   StatusText: ${error.statusText.toString()},
                   Error Message: ${error.error.toString()}`;
        })
  }

  initRamCores(): void {
    this.totalNumberOfCores = 0;
    this.totalRAM = 0;
    // tslint:disable-next-line:forin
    for (const key in this.project_application.CurrentFlavors) {
      const flavor: any = this.project_application.CurrentFlavors[key];
      if (flavor != null) {
        const flav: Flavor = this.flavorList.find(function (fl: Flavor): boolean {
          return fl.name === key;

        });
        this.newFlavors[key] = {counter: flavor.counter, flavor: flav};
        this.calculateRamCores()

      }

    }

  }

  /**
   * Submits an renewal request for an application.
   * @param {NgForm} form
   * @param {boolean} isExtraCreditsApplication: whether or not only extra credits are applied for
   */
  onSubmit(form: NgForm, isExtraCreditsApplication: boolean): void {
    const values: { [key: string]: string | number | boolean } = {};
    values['project_application_id'] = this.project_application.Id;
    if (isExtraCreditsApplication) {
      values['is_only_extra_credits_application'] = isExtraCreditsApplication;
      values['project_application_renewal_comment'] = form.controls['project_application_extra_credits_comment'].value;
      values['project_application_renewal_credits'] = form.controls['project_application_extra_credits'].value;
    } else {
      for (const value in form.controls) {
        if (form.controls[value].disabled) {
          continue;
        }
        if (form.controls[value].value) {
          values[value] = form.controls[value].value;
        }
      }
      values['total_cores_new'] = this.totalNumberOfCores;
      values['total_ram_new'] = this.totalRAM;
      values['project_application_renewal_credits'] = this.extensionCredits;
      values['is_only_extra_credits_application'] = isExtraCreditsApplication;
    }
    this.requestExtension(values);

  }

  /**
   * Request an extension from an application.
   * @param data
   */
  public requestExtension(data: { [key: string]: string | number | boolean }): void {
    this.applicationsservice.requestRenewal(data).subscribe((result: { [key: string]: string }) => {
      if (result['Error']) {
        this.extension_status = 2
      } else {
        this.extension_status = 1;
      }
      if (this.selected_ontology_terms.length > 0) {
        this.applicationsservice.addEdamOntologyTerms(this.application_id,
                                                      this.selected_ontology_terms
        ).subscribe(() => {
          this.getApplication()

        });
      } else {
        this.getApplication()
      }

    })

  }

  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors(): void {
    this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
  }

  /**
   * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void {
    this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
  }

  fillUp(date: string): string {
    if (date.length === 1) {
      return `0${date}`;
    }

    return date;
  }

  /**
   * Returns a string with the end-date of a application which depends on the day it was approved and the lifetime in months
   * @param approval date in string when the application was approved
   * @param months number of months the application is permitted
   */
  getEndDate(months: number, approval?: string): string {
    if (!approval) {
      return ''
    }
    let date1: Date = new Date(Number(approval.substring(0, 4)), Number(approval.substring(5, 7)) - 1, Number(approval.substring(8)));
    const month: number = date1.getMonth();
    if ((month + months) > 11) {
      date1 = new Date(date1.getFullYear() + 1, (month + months - 12), date1.getDate());
    } else {
      date1.setMonth(date1.getMonth() + months);
    }

    return `${date1.getFullYear()}-${this.fillUp((date1.getMonth() + 1).toString())}-${this.fillUp(date1.getDate().toString())}`;
  }

  setLifetime(): void {

    // tslint:disable-next-line:max-line-length
    this.life_time_string = `${this.project_application.DateApproved} -  ${this.getEndDate(this.project_application.Lifetime, this.project_application.DateApproved)}`;
  }

  ngOnInit(): void {
    this.applicationsservice.getEdamOntologyTerms().subscribe((terms: EdamOntologyTerm[]) => {
      this.edam_ontology_terms = terms;
      this.searchTermsInEdamTerms()
    })

    this.activatedRoute.params.subscribe((paramsId: any) => {
      this.errorMessage = null;
      this.isLoaded = false;
      this.project = null;
      this.project_application = null;
      this.project_members = [];
      this.application_id = paramsId.id;
      this.getApplication();
      this.getApplicationStatus();
      this.getUserinfo();
      this.getListOfFlavors();
      this.getListOfTypes();
      this.getDois();
      this.is_vo_admin = is_vo;
      this.startUpdateCreditUsageLoop();
    });

  }

  ngOnDestroy(): void {
    clearInterval(this.updateCreditsUsedIntervals);
  }

  getDois(): void {
    this.groupService.getGroupDois(this.application_id).subscribe((dois: Doi[]) => {
      this.dois = dois;
    })
  }

  isNewDoi(): boolean {
    for (const doi of this.dois) {
      if (doi.identifier === this.newDoi) {
        return false;
      }
    }

    return true;
  }

  searchTermsInEdamTerms(): void {
    const tmp: EdamOntologyTerm[] = [];
    // tslint:disable-next-line:no-for-each-push typedef
    this.selected_ontology_terms.forEach(ele => {
      // tslint:disable-next-line:typedef
      // @ts-ignore
      // tslint:disable-next-line:typedef
      const td = this.edam_ontology_terms.find(term => term.term === ele);
      tmp.push(td)

    })
    this.selected_ontology_terms = tmp;
  }

  deleteDoi(doi: Doi): void {
    this.groupService.deleteGroupDoi(doi.id).subscribe((dois: Doi[]) => {
      this.dois = dois;
    })
  }

  addDoi(): void {
    if (this.isNewDoi()) {
      this.groupService.addGroupDoi(this.application_id, this.newDoi).subscribe((dois: Doi[]) => {
        this.newDoi = null;
        this.dois = dois;
      })
    }

  }

  /**
   * Get the facility of an application.
   * @param {Application} app
   */
  getFacilityProject(): void {

    if (!this.project_application.ComputeCenter && this.project_application.Status !== this.application_states.SUBMITTED
      && this.project_application.Status !== this.application_states.TERMINATED) {
      this.groupService.getFacilityByGroup(this.project_application.PerunId.toString()).subscribe((res: object) => {

        const login: string = res['Login'];
        const suport: string = res['Support'];
        const facilityname: string = res['Facility'];
        const facilityId: number = res['FacilityId'];
        if (facilityId) {
          this.project_application.ComputeCenter = new ComputecenterComponent(facilityId.toString(), facilityname, login, suport);
        }

      })
    }

  }

  rejectMemberApplication(project: number, application: number, membername: string): void {
    this.loaded = false;
    this.application_action_done = false;

    this.groupService.rejectGroupApplication(project, application)
      .subscribe((tmp_application: any) => {
                   this.project.ProjectMemberApplications = [];

                   if (tmp_application['state'] === 'REJECTED') {
                     this.application_action_success = true;

                   } else if (tmp_application['message']) {
                     this.application_action_success = false;

                     this.application_action_error_message = tmp_application['message'];
                   } else {
                     this.application_action_success = false;
                   }
                   this.application_action = 'rejected';
                   this.application_member_name = membername;
                   this.application_action_done = true;
                   this.getUserProjectApplications();
                   this.loaded = true;

                 }
      );
  }

  /**
   * Get all user applications for a project.
   * @param projectId id of the project
   */
  getUserProjectApplications(): void {
    this.loaded = false;
    this.groupService.getGroupApplications(this.project.Id).subscribe((applications: any) => {

      const newProjectApplications: ProjectMemberApplication[] = [];
      if (applications.length === 0) {
        this.project.ProjectMemberApplications = [];

        this.loaded = true;

      }
      for (const application of applications) {
        const dateApplicationCreated: moment.Moment = moment(application['createdAt'], 'YYYY-MM-DD HH:mm:ss.SSS');
        const membername: string = application['displayName'];

        const newMemberApplication: ProjectMemberApplication =
          new ProjectMemberApplication(
            application['id'], membername,
            `${dateApplicationCreated.date()}.${(dateApplicationCreated.month() + 1)}.${dateApplicationCreated.year()}`
          );
        newProjectApplications.push(newMemberApplication);
        this.project.ProjectMemberApplications = newProjectApplications;
        this.loaded = true;

      }

    })

  }

  getProject(): void {

    this.groupService.getGroupDetails(this.project_id).subscribe((group: any) => {
      const dateCreated: moment.Moment = moment.unix(group['createdAt']);
      const dateDayDifference: number = Math.ceil(moment().diff(dateCreated, 'days', true));
      const is_pi: boolean = group['is_pi'];
      const groupid: string = group['id'];
      const facility: any = group['compute_center'];
      const shortname: string = group['shortname'];
      const currentCredits: number = Number(group['current_credits']);
      const approvedCredits: number = Number(group['approved_credits']);

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
        this.isAdmin,
        compute_center,
        currentCredits,
        approvedCredits);
      const lifetime: number | string = <number>group['lifetime'];
      if (lifetime !== -1) {
        const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
        const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
                                                .diff(moment(dateCreated), 'days'));
        newProject.DateEnd = expirationDate;
        newProject.LifetimeDays = lifetimeDays;

      }
      newProject.OpenStackProject = group['openstack_project'];
      newProject.RealName = realname;
      this.project = newProject;
      if (this.project.UserIsPi || this.project.UserIsAdmin) {
        this.getMembersOfTheProject();
      } else {

        this.isLoaded = true;
      }
    })

  }

  /**
   * Get all members of a project.
   * @param projectId id of the project
   * @param projectName
   */
  getMembersOfTheProject(): void {
    this.groupService.getGroupMembers(this.project_id).subscribe((members: any) => {

      this.groupService.getGroupAdminIds(this.project_id).subscribe((result: any) => {
        this.project_members = [];

        const admindIds: any = result['adminIds'];
        for (const member of members) {
          const member_id: string = member['id'];
          const user_id: string = member['userId'];
          const fullName: string = `${member['firstName']} ${member['lastName']}`;
          const projectMember: ProjectMember = new ProjectMember(user_id, fullName, member_id);
          projectMember.ElixirId = member['elixirId'];
          projectMember.IsPi = admindIds.indexOf(user_id) !== -1;
          this.project_members.push(projectMember);

        }
        this.isLoaded = true;

      })

    });
  }

  setAllMembersChecked(): void {
    if (!this.allSet) {
      this.project_members.forEach((member: ProjectMember) => {
        if (!this.isMemberChecked(parseInt(member.MemberId.toString(), 10))
          && this.userinfo.MemberId.toString() !== member.MemberId.toString()) {
          this.checked_member_list.push(parseInt(member.MemberId.toString(), 10));
        }
      });
      this.allSet = true;
    } else {
      this.checked_member_list = [];
      this.allSet = false;
    }
  }

  isMemberChecked(id: number): boolean {
    return this.checked_member_list.indexOf(id) > -1;

  }

  checkIfAllMembersChecked(): void {
    let all_set: boolean = true;
    this.project_members.forEach((member: ProjectMember) => {
      if (!this.isMemberChecked(parseInt(member.MemberId.toString(), 10)) && this.userinfo.MemberId !== member.MemberId) {
        all_set = false;

      }
    });

    this.allSet = all_set;

  }

  checkUnCheckMember(id: number): void {
    const indexOf: number = this.checked_member_list.indexOf(id);
    if (indexOf !== -1) {
      this.checked_member_list.splice(indexOf, 1);
      this.allSet = false;

    } else {
      this.checked_member_list.push(id);
      this.checkIfAllMembersChecked()

    }

  }

  removeCheckedMembers(groupId: number | string): void {
    this.remove_members_clicked = true;

    const members_in: ProjectMember[] = [];

    const observables: Observable<number>[] = this.checked_member_list
      .map((id: number) => this.groupService.removeMember(groupId, id, this.project.ComputeCenter.FacilityId));
    forkJoin(observables).subscribe(() => {

      this.project_members.forEach((member: ProjectMember) => {

        if (!this.isMemberChecked(parseInt(member.MemberId.toString(), 10))) {
          members_in.push(member)

        }

      });
      this.project_members = members_in;
      this.checked_member_list = [];
      this.allSet = false;
      this.remove_members_clicked = false;

    });
    this.allSet = false;
  }

  resetCheckedMemberList(): void {
    this.allSet = false;
    this.checked_member_list = [];
  }

  setAddUserInvitationLink(): void {
    const uri: string = this.invitation_group_pre + this.project.RealName + this.invitation_group_post + this.project.RealName;
    this.invitation_link = uri;

  }

  /**
   * Uses the data from the application form to fill the confirmation-modal with information.
   * @param form the application form with corresponding data
   */
  filterEnteredData(form: NgForm): void {
    this.generateConstants();
    this.valuesToConfirm = [];
    for (const key in form.controls) {
      if (form.controls[key].value) {
        if (key === 'project_application_name') {
          this.projectName = form.controls[key].value;
          if (this.projectName.length > 50) {
            this.projectName = `${this.projectName.substring(0, 50)}...`;
          }
        }
        if (key in this.constantStrings) {
          if (form.controls[key].disabled) {
            continue;
          }

          this.valuesToConfirm.push(this.matchString(key.toString(), form.controls[key].value.toString()));

        }
      }

    }
    if (!this.project_application_report_allowed) {
      this.valuesToConfirm.push('Dissemination allowed: No');
    }

  }

  copyToClipboard(text: string): void {
    document.addEventListener('copy', (clipEvent: ClipboardEvent) => {
      clipEvent.clipboardData.setData('text/plain', (text));
      clipEvent.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  filterMembers(searchString: string): void {
    this.userservice.getFilteredMembersOfdeNBIVo(searchString).subscribe((result: object) => {
      this.filteredMembers = result;
    })
  }

  isPi(member: ProjectMember): string {
    if (member.IsPi) {
      return 'blue'
    } else {
      return 'black'
    }

  }

  getUserinfo(): void {
    this.userservice.getUserInfo().subscribe((userinfo: any) => {
      this.userinfo = new Userinfo(userinfo);
    })
  }

  public addMember(groupid: number, memberid: number, firstName: string, lastName: string): void {
    this.groupService.addMember(groupid, memberid, this.project.ComputeCenter.FacilityId).subscribe(
      (result: any) => {
        if (result.status === 200) {
          this.updateNotificationModal('Success', `Member ${firstName} ${lastName} added.`, true, 'success');
          this.getMembersOfTheProject()
        } else {

          this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
        }
      },
      (error: any) => {

        if (error['name'] === 'AlreadyMemberException') {
          this.updateNotificationModal('Info', `${firstName} ${lastName} is already a member of the project.`, true, 'info');
        } else {
          this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
        }
      });

  }

  public addAdmin(groupId: number, memberId: number, userId: number, firstName: string, lastName: string): void {
    this.groupService.addMember(groupId, memberId, this.project.ComputeCenter.FacilityId).subscribe(
      () => {
        this.groupService.addAdmin(groupId, userId, this.project.ComputeCenter.FacilityId).subscribe(
          (result: any) => {

            if (result.status === 200) {
              this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');
              this.getMembersOfTheProject();
            } else {
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            }
          },
          (error: any) => {
            if (error['name'] === 'AlreadyAdminException') {
              this.updateNotificationModal(
                'Info', `${firstName} ${lastName} is already a admin of the project.`,
                true, 'info');
            } else {
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            }
          })
      },
      () => {
        this.groupService.addAdmin(groupId, userId, this.project.ComputeCenter.FacilityId).subscribe(
          (result: any) => {

            if (result.status === 200) {
              this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');
              this.getMembersOfTheProject();

            } else {
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            }
          },
          (error: any) => {
            if (error['name'] === 'AlreadyAdminException') {
              this.updateNotificationModal(
                'Info', `${firstName} ${lastName} is already a admin of the project.`,
                true, 'info');
            } else {
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            }
          })
      })
  }

  public promoteAdmin(groupid: number, userid: number, username: string): void {

    this.groupService.addAdmin(groupid, userid, this.project.ComputeCenter.FacilityId).toPromise()
      .then((result: any) => {

        if (result.status === 200) {
          this.updateNotificationModal('Success', `${username} promoted to Admin`, true, 'success');
          this.getMembersOfTheProject();

        } else {
          this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
        }
      }).catch(() => {
      this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
    });
  }

  public removeAdmin(groupid: number, userid: number, name: string): void {

    this.groupService.removeAdmin(groupid, userid, this.project.ComputeCenter.FacilityId).toPromise()
      .then((result: any) => {

        if (result.status === 200) {
          this.updateNotificationModal('Success', `${name} was removed as Admin`, true, 'success');
          this.getMembersOfTheProject()
        } else {
          this.updateNotificationModal('Failed', `${name} could not be removed as Admin!`, true, 'danger');
        }
      }).catch(() => {
      this.updateNotificationModal('Failed', `${name} could not be removed as Admin!`, true, 'danger'
      );
    });
  }

  /**
   * Remove an member from a group.
   * @param groupid  of the group
   * @param memberid of the member
   * @param name  of the member
   */
  public removeMember(groupid: number, memberid: number, name: string): void {
    const indexOf: number = this.checked_member_list.indexOf(memberid);
    if (indexOf !== -1) {
      this.checked_member_list.splice(indexOf, 1);
      this.allSet = false;
    }

    this.groupService.removeMember(groupid, memberid, this.project.ComputeCenter.FacilityId).subscribe(
      (result: any) => {

        if (result.status === 200) {
          this.updateNotificationModal('Success', `Member ${name}  removed from the group`, true, 'success');
          this.getMembersOfTheProject()

        } else {
          this.updateNotificationModal('Failed', `Member ${name}  could not be removed !`, true, 'danger');
        }
      },
      () => {
        this.updateNotificationModal('Failed', `Member ${name}  could not be removed !`, true, 'danger');
      });
  }

  checkIfTypeGotSimpleVmFlavor(type: FlavorType): boolean {
    for (const flav of this.flavorList) {
      if (flav.type.shortcut === type.shortcut && flav.simple_vm) {
        return true
      }

    }

    return false

  }

  /**
   * Delete an application.
   * @param application_id
   */
  public deleteApplication(): void {
    this.applicationsservice.deleteApplication(this.project_application.Id).subscribe(
      () => {
        this.updateNotificationModal('Success', 'The application has been successfully removed', true, 'success');
        this.fullLayout.getGroupsEnumeration();
        // tslint:disable:no-floating-promises
        this.router.navigate(['/userinfo'])
      },
      () => {
        this.updateNotificationModal('Failed', 'Application could not be removed!', true, 'danger');
      })

  }

  public comingSoon(): void {
    alert('This function will be implemented soon.')
  }

  onChangeFlavor(value: number): void {

    this.checkIfMinVmIsSelected();
  }

  checkIfMinVmIsSelected(): void {
    let nr_vm: number = 0;
    for (const fl of this.flavorList) {
      const control: string = `project_application_renewal_${fl.name}`;
      if (control in this.simpleVmForm.controls) {
        if (this.simpleVmForm.controls[control].value > 0) {
          nr_vm += this.simpleVmForm.controls[control].value;
        }
      }
    }
    if (nr_vm > 0 || this.project_application.OpenStackProject) {
      this.min_vm = true;
    } else if (nr_vm === 0) {
      this.min_vm = false;
    }
  }

}
>>>>>>> dev
