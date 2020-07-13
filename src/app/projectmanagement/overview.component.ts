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
import {forkJoin, Observable, Subscription} from 'rxjs';
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
import {ExtensionRequestType} from '../shared/shared_modules/baseClass/abstract-base-class';

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

  @ViewChild(NgForm) simpleVmForm: NgForm;
  @ViewChild('creditsChart') creditsCanvas: ElementRef;
  private subscription: Subscription = new Subscription();

  /**
   * If at least 1 flavor is selected.
   * @type {boolean}
   */
  public min_vm: boolean = true;

  /**
   * The credits for the extension.
   */
  private extensionCredits: number = 0;

  /**
   * the credits for a resource modification.
   */
  private modificationCredits: number = 0;

  project_id: string;
  application_id: string;
  project: Project;
  application_details_visible: boolean = false;
  credits: number = 0;

  errorMessage: string;
  terminate_confirmation_given: boolean = false;

  /**
   * id of the extension status.
   * @type {number}
   */
  extension_status: number = 0;
  /**
   * id of the modification status
   * @type {number}, needs yet to be implemented
   */
  modification_status: number = 0;

  /**
   * defines weither the request is an extension (1), modification (2) or credit (3) request.
   * @type {number}, initialized with 0
   */
  request_type: number = ExtensionRequestType.NONE;

  newDoi: string;
  remove_members_clicked: boolean;
  life_time_string: string;
  dois: Doi[];
  isAdmin: boolean = false;
  invitation_link: string;
  filteredMembers: any = null;
  project_application: Application;
  project_service_in_development: boolean = true;
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
  @ViewChild('edam_ontology') edam_ontology: AutocompleteComponent;

  checked_member_list: number[] = [];

  // modal variables for User list
  public project_members: ProjectMember[] = [];
  public isLoaded: boolean = false;
  public showLink: boolean = true;
  private project_application_extra_credits: number;
  public project_application_extra_credits_comment: string;
  private current_credits: number = 0;
  private updateCreditsUsedIntervals: number;

  private updateCreditHistoryIntervals: number;

  creditsChart: any;
  ExtensionRequestType: typeof ExtensionRequestType = ExtensionRequestType;

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

  calculateCreditsLifeTime(): void {
    this.subscription.add(this.creditsService.getExtraCreditsForExtension(this.project_application.project_application_total_cores,
                                                                          this.project_application.project_application_total_ram,
                                                                          this.project_application.project_application_extension.extra_lifetime,
                                                                          this.project_application.project_application_id.toString()).subscribe(
      (credits: number): void => {
        this.project_application.project_application_extension.extra_credits = credits;
      }))

  }

  calculateCreditsModification(): void {
    this.subscription.add(this.creditsService.getExtraCreditsForExtension(this.project_application.project_application_modification.total_cores,
                                                                          this.project_application.project_application_modification.total_ram,
                                                                          this.project_application.project_application_lifetime,
                                                                          this.project_application.project_application_id.toString()).subscribe(
      (credits: number): void => {
        this.project_application.project_application_modification.extra_credits = credits;
      }))

  }

  calculateCredits(lifetime: number): void {
    if (lifetime === null || lifetime === undefined || lifetime.toString() === '') {
      lifetime = 0;
    }
    this.creditsService.getExtraCreditsForExtension(this.totalNumberOfCores,
                                                    this.totalRAM, lifetime,
                                                    this.project_application.project_application_id.toString()).subscribe(
      (credits: number): void => {
        this.project_application.project_application_modification.extra_credits = credits;
      })

  }

  fetchCurrentCreditsOfProject(): void {
    if (this.project_application != null) {
      // tslint:disable-next-line:max-line-length
      this.creditsService.getCurrentCreditsOfProject(Number(this.project_application.project_application_perun_id.toString())).toPromise().then(
        (credits: number): void => {
          this.current_credits = credits;
        }
      ).catch((err: Error): void => console.log(err.message))
    } else {
      console.log(this.project_application)
    }
    this.fetchCreditHistoryOfProject();
  }

  fetchCreditHistoryOfProject(): void {
    if (this.project != null) {
      this.creditsService.getCreditsUsageHistoryOfProject(Number(this.project.Id.toString())).toPromise()
        .then((response: {}): void => {
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
                        pointRadius: 0
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
        ).catch((err: Error): void => console.log(err.message));
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
    this.updateCreditsUsedIntervals = window.setInterval(
      (): any =>
        // tslint:disable-next-line:max-line-length
        this.subscription.add(this.creditsService.getCurrentCreditsOfProject(Number(this.project_application.project_application_perun_id.toString())).subscribe(
          (credits: number): void => {
            this.current_credits = credits;
          },
          (err: Error): void => {
            console.log(err.message)
          }
        )),
      10000);
  }

  initExampleFlavors(): void {
    const standardFlavors: Flavor[] = this.flavorList.filter((fl: Flavor, nu: number, arr: Flavor[]): boolean => fl.type.long_name === 'Standard Flavours');
    const highMemFlavors: Flavor[] = this.flavorList.filter((fl: Flavor, nu: number, arr: Flavor[]): boolean => fl.type.long_name === 'High Memory Flavours');
    standardFlavors.sort((fl1: Flavor, fl2: Flavor): number => fl1.vcpus - fl2.vcpus);
    highMemFlavors.sort((fl1: Flavor, fl2: Flavor): number => fl1.vcpus - fl2.vcpus);
    if (standardFlavors.length !== 0) {
      this.smallExampleFlavor = standardFlavors[0];
      this.creditsService.getCreditsPerHour(this.smallExampleFlavor.vcpus, this.smallExampleFlavor.ram).toPromise()
        .then((credits: number): void => {
          this.creditsPerHourSmallExample = credits * 4;
        }).catch((err: Error): void => console.log(err.message));
    }
    if (highMemFlavors.length !== 0) {
      this.largeExampleFlavor = highMemFlavors[0];
      this.creditsService.getCreditsPerHour(this.largeExampleFlavor.vcpus, this.largeExampleFlavor.ram).toPromise()
        .then((credits: number): void => {
          this.creditsPerHourLargeExample = credits;
        }).catch((err: Error): void => console.log(err.message));
    }
  }

  approveMemberApplication(project: number, application: number, membername: string): void {
    this.loaded = false;
    this.application_action_done = false;
    this.groupService.approveGroupApplication(project, application).subscribe((tmp_application: any): void => {
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
        (aj: Application): void => {
          if (aj.project_application_name === '') {
            this.isLoaded = false;
            this.errorMessage = 'Not found';

            return;
          }

          this.project_application = new Application(aj);
          if (!this.project_application.project_application_extension) {
            this.project_application.inititateExtension();
          }
          if (!this.project_application.project_application_modification) {
            this.project_application.inititateModification();
          }
          if (!this.project_application.project_credit_request) {
            this.project_application.initiateCreditsRequest();
          }

          if (this.project_application.project_application_perun_id) {
            this.startUpdateCreditUsageLoop();
          }

          if (this.project_application) {
            this.applicationsservice.getApplicationPerunId(this.application_id).subscribe((id: any): void => {
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
        (error: any): void => {
          this.isLoaded = false;
          this.errorMessage = `Status: ${error.status.toString()},
                   StatusText: ${error.statusText.toString()},
                   Error Message: ${error.error.toString()}`;
        })
  }

  public requestModification(): void {
    this.applicationsservice.requestModification(this.project_application.project_application_modification)
      .subscribe((result: { [key: string]: string }): void => {
        if (result['Error']) {
          this.extension_status = 2
        } else {
          this.extension_status = 1;
        }
        if (this.selected_ontology_terms.length > 0) {
          this.applicationsservice.addEdamOntologyTerms(this.application_id,
                                                        this.selected_ontology_terms
          ).subscribe((): void => {
            this.getApplication()

          });
        } else {
          this.getApplication()
        }

      })
  }

  public requestCreditsModification(): void {
    this.applicationsservice.requestAdditionalCredits(this.project_application.project_credit_request).subscribe()
  }

  public requestExtension(): void {
    this.applicationsservice.requestAdditionalLifetime(this.project_application.project_application_extension)
      .subscribe((result: { [key: string]: string }): void => {
        if (result['Error']) {
          this.extension_status = 2
        } else {
          this.extension_status = 1;
        }
        if (this.selected_ontology_terms.length > 0) {
          this.applicationsservice.addEdamOntologyTerms(this.application_id,
                                                        this.selected_ontology_terms
          ).subscribe((): void => {
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
    this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]): void => {
      this.flavorList = flavors
    });
  }

  /**
   * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void {
    this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]): void => this.setListOfTypes(types));
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
    this.life_time_string = `${this.project.DateCreated} -  ${this.project.DateEnd}`;
  }

  ngOnInit(): void {
    this.applicationsservice.getEdamOntologyTerms().subscribe((terms: EdamOntologyTerm[]): void => {
      this.edam_ontology_terms = terms;
      this.searchTermsInEdamTerms()
    });

    this.activatedRoute.params.subscribe((paramsId: any): void => {
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
      this.applicationsservice.approveAdditionalLifetime(this.application_id).subscribe()
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.updateCreditsUsedIntervals) {
      clearInterval(this.updateCreditsUsedIntervals);
    } catch (someError) {}
  }

  getDois(): void {
    this.groupService.getGroupDois(this.application_id).subscribe((dois: Doi[]): void => {
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
    this.groupService.deleteGroupDoi(doi.id).subscribe((dois: Doi[]): void => {
      this.dois = dois;
    })
  }

  addDoi(): void {
    if (this.isNewDoi()) {
      this.groupService.addGroupDoi(this.application_id, this.newDoi).subscribe((dois: Doi[]): void => {
        this.newDoi = null;
        this.dois = dois;
      })
    }

  }

  requestProjectTermination(): void {
    this.updateNotificationModal('Waiting', 'Termination request will be submitted...', true, 'info');

    this.groupService.requestProjectTermination(this.project.Id).subscribe((): void => {
      this.fullLayout.getGroupsEnumeration();
      this.getApplicationStatus();
      this.getApplication();
      this.updateNotificationModal('Success', 'Termination was requested!', true, 'success');

    })
  }

  /**
   * Get the facility of an application.
   * @param {Application} app
   */
  getFacilityProject():
    void {

    if (!this.project_application.ComputeCenter
      && !this.project_application.hasSubmittedStatus()
      && !this.project_application.hasTerminatedStatus()) {
      this.groupService.getFacilityByGroup(
        this.project_application.project_application_perun_id.toString()).subscribe((res: object): void => {

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
      .subscribe((tmp_application: any): void => {
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
    this.groupService.getGroupApplications(this.project.Id).subscribe((applications: any): void => {

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

    this.groupService.getGroupDetails(this.project_id).subscribe((group: any): void => {
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
      this.setLifetime();
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
    this.groupService.getGroupMembers(this.project_id).subscribe((members: any): void => {

      this.groupService.getGroupAdminIds(this.project_id).subscribe((result: any): void => {
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
      this.project_members.forEach((member: ProjectMember): void => {
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
    this.project_members.forEach((member: ProjectMember): void => {
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

  removeCheckedMembers(groupId
                         :
                         number | string
  ):
    void {
    this.remove_members_clicked = true;

    const members_in
      :
      ProjectMember[] = [];

    const observables: Observable<number>[] = this.checked_member_list
      .map((id: number): Observable<any> => this.groupService.removeMember(groupId, id, this.project.ComputeCenter.FacilityId));
    forkJoin(observables).subscribe((): void => {

      this.project_members.forEach((member: ProjectMember): void => {

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
    document.addEventListener('copy', (clipEvent: ClipboardEvent): void => {
      clipEvent.clipboardData.setData('text/plain', (text));
      clipEvent.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  filterMembers(searchString: string): void {
    this.userservice.getFilteredMembersOfdeNBIVo(searchString).subscribe((result: object): void => {
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
    this.userservice.getUserInfo().subscribe((userinfo: any): void => {
      this.userinfo = new Userinfo(userinfo);
    })
  }

  public addMember(groupid: number, memberid: number, firstName: string, lastName: string): void {
    this.groupService.addMember(groupid, memberid, this.project.ComputeCenter.FacilityId).subscribe(
      (result: any): void => {
        if (result.status === 200) {
          this.updateNotificationModal('Success', `Member ${firstName} ${lastName} added.`, true, 'success');
          this.getMembersOfTheProject()
        } else {

          this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
        }
      },
      (error: any): void => {

        if (error['name'] === 'AlreadyMemberException') {
          this.updateNotificationModal('Info', `${firstName} ${lastName} is already a member of the project.`, true, 'info');
        } else {
          this.updateNotificationModal('Failed', 'Member could not be added!', true, 'danger');
        }
      });

  }

  public addAdmin(groupId: number, memberId: number, userId: number, firstName: string, lastName: string): void {
    this.groupService.addMember(groupId, memberId, this.project.ComputeCenter.FacilityId).subscribe(
      (): void => {
        this.groupService.addAdmin(groupId, userId, this.project.ComputeCenter.FacilityId).subscribe(
          (result: any): void => {

            if (result.status === 200) {
              this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');
              this.getMembersOfTheProject();
            } else {
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            }
          },
          (error: any): void => {
            if (error['name'] === 'AlreadyAdminException') {
              this.updateNotificationModal(
                'Info', `${firstName} ${lastName} is already a admin of the project.`,
                true, 'info');
            } else {
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            }
          })
      },
      (): void => {
        this.groupService.addAdmin(groupId, userId, this.project.ComputeCenter.FacilityId).subscribe(
          (result: any): void => {

            if (result.status === 200) {
              this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');
              this.getMembersOfTheProject();

            } else {
              this.updateNotificationModal('Failed', 'Admin could not be added!', true, 'danger');
            }
          },
          (error: any): void => {
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
      .then((result: any): void => {

        if (result.status === 200) {
          this.updateNotificationModal('Success', `${username} promoted to Admin`, true, 'success');
          this.getMembersOfTheProject();

        } else {
          this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
        }
      }).catch((): void => {
      this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
    });
  }

  public removeAdmin(groupid: number, userid: number, name: string): void {

    this.groupService.removeAdmin(groupid, userid, this.project.ComputeCenter.FacilityId).toPromise()
      .then((result: any): void => {

        if (result.status === 200) {
          this.updateNotificationModal('Success', `${name} was removed as Admin`, true, 'success');
          this.getMembersOfTheProject()
        } else {
          this.updateNotificationModal('Failed', `${name} could not be removed as Admin!`, true, 'danger');
        }
      }).catch((): void => {
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
      (result: any): void => {

        if (result.status === 200) {
          this.updateNotificationModal('Success', `Member ${name}  removed from the group`, true, 'success');
          this.getMembersOfTheProject()

        } else {
          this.updateNotificationModal('Failed', `Member ${name}  could not be removed !`, true, 'danger');
        }
      },
      (): void => {
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
    this.applicationsservice.deleteApplication(this.project_application.project_application_id).subscribe(
      (): void => {
        this.updateNotificationModal('Success', 'The application has been successfully removed', true, 'success');
        this.fullLayout.getGroupsEnumeration();
        // tslint:disable:no-floating-promises
        this.router.navigate(['/userinfo'])
      },
      (): void => {
        this.updateNotificationModal('Failed', 'Application could not be removed!', true, 'danger');
      })

  }

  public comingSoon(): void {
    alert('This function will be implemented soon.')
  }

  onChangeFlavor(flavor: Flavor, value: number): void {
    this.project_application.project_application_modification.setFlavorInFlavors(flavor, value)

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
    if (nr_vm > 0 || this.project_application.project_application_openstack_project) {
      this.min_vm = true;
    } else if (nr_vm === 0) {
      this.min_vm = false;
    }
  }

}
