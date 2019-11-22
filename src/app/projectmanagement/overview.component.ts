import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Project} from './project.model';
import {ProjectMember} from './project_member.model'
import {environment} from '../../environments/environment'
import {ApiSettings} from '../api-connector/api-settings.service';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import * as moment from 'moment';
import {VoService} from '../api-connector/vo.service';
import {ProjectMemberApplication} from './project_member_application';
import {ComputecenterComponent} from './computecenter.component';
import {Userinfo} from '../userinfo/userinfo.model';
import {forkJoin, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Application} from '../applications/application.model/application.model';
import {ApplicationBaseClassComponent} from '../shared/shared_modules/baseClass/application-base-class.component';
import {ApplicationStatusService} from '../api-connector/application-status.service';
import {FacilityService} from '../api-connector/facility.service';
import {ApplicationsService} from '../api-connector/applications.service';
import {Router} from '@angular/router'
import {FullLayoutComponent} from '../layouts/full-layout.component';
import {NgForm} from '@angular/forms';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {FlavorService} from '../api-connector/flavor.service';
import {IResponseTemplate} from '../api-connector/response-template';
import {CreditsService} from '../api-connector/credits.service';

/**
 * Projectoverview component.
 */
@Component({
             selector: 'app-project-overview',
             templateUrl: 'overview.component.html',
             providers: [FlavorService, ApplicationStatusService, ApplicationsService,
               FacilityService, VoService, UserService, GroupService, ApiSettings, VoService, CreditsService]
           })
export class OverviewComponent extends ApplicationBaseClassComponent implements OnInit {

  @Input() invitation_group_post: string = environment.invitation_group_post;
  @Input() voRegistrationLink: string = environment.voRegistrationLink;
  @Input() invitation_group_pre: string = environment.invitation_group_pre;
  @Input() wiki_group_invitation: string = environment.wiki_group_invitations;

  @ViewChild(NgForm) simpleVmForm: NgForm;

  /**
   * If at least 1 flavor is selected.
   * @type {boolean}
   */
  public min_vm: boolean = true;

  project_id: string;
  application_id: string;
  project: Project;
  application_details_visible: boolean = false;
  credits: number = 0;

  /**
   * id of the extension status.
   * @type {number}
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

  title: string = 'Project Overview';

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
              private router: Router,
              private voservice: VoService, private creditsService: CreditsService) {
    super(userservice, applicationstatusservice, applicationsservice, facilityService);
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
    this.applicationsservice.getApplication(this.application_id).subscribe((aj: object) => {
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
    })
  }

  initRamCores(): void {
    console.log('init');
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
   */
  onSubmit(form: NgForm): void {
    const values: { [key: string]: string | number | boolean } = {};
    for (const value in form.controls) {
      if (form.controls[value].disabled) {
        continue;
      }
      if (form.controls[value].value) {
        values[value] = form.controls[value].value;
      }
    }
    values['project_application_id'] = this.project_application.Id;
    values['total_cores_new'] = this.totalNumberOfCores;
    values['total_ram_new'] = this.totalRAM;
    values['project_application_renewal_credits'] = this.credits;

    this.requestExtension(values);

  }

  /**
   * Sends a request to the BE to get the initital credits for a new application.
   */
  calculateInitialCredits(form: NgForm): void {

    /*todo calculate */
    this.credits = 0;

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
      this.getApplication()

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

  /**
   * Bugfix not scrollable site after closing modal
   */
  removeModalOpen(): void {
    document.body.classList.remove('modal-open');
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((paramsId: any) => {
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
      this.checkVOstatus();

    });

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

  /**
   * Check vm status.
   * @param {UserService} userservice
   */
  checkVOstatus(): void {
    this.voservice.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo_admin = <boolean><Boolean>result.value;
    })
  }
}
