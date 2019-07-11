import {Component, ElementRef, Input, OnInit} from '@angular/core';
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
import {AbstractBaseClasse} from '../shared/shared_modules/baseClass/abstract-base-class';
import {IResponseTemplate} from '../api-connector/response-template';
import {Userinfo} from '../userinfo/userinfo.model';
import {ViewChild, QueryList} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {MemberGuardService} from '../member-guard.service';

/**
 * Projectoverview component.
 */
@Component({
             selector: 'app-project-overview',
             templateUrl: 'overview.component.html',
             providers: [VoService, UserService, GroupService, ApiSettings]
           })
export class OverviewComponent extends AbstractBaseClasse implements OnInit {

  @Input() invitation_group_post: string = environment.invitation_group_post;
  @Input() voRegistrationLink: string = environment.voRegistrationLink;
  @Input() invitation_group_pre: string = environment.invitation_group_pre;
  @Input() wiki_group_invitation: string = environment.wiki_group_invitations;

  isAdmin: boolean = false;
  userProjects: {}[];
  filteredMembers: any = null;
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
  public usersModalProjectMembers: ProjectMember[] = [];
  public usersModalProjectID: number | string;
  public usersModalProjectName: string;
  public selectedProject: Project;

  public isLoaded: boolean = false;

  // modal variables for Add User Modal
  public addUserModalProjectID: number;
  public addUserModalProjectName: string;
  public addUserModalRealName: string;
  public addUserModalInvitationLink: string = '';

  public showLink: boolean = true;

  public UserModalFacilityDetails: [string, string][];
  public UserModalFacility: [string, number];

  constructor(private groupService: GroupService,
              private userService: UserService) {
    super();

  }

  approveMemberApplication(project: number, application: number, membername: string): void {
    this.loaded = false;
    this.application_action_done = false;
    this.groupService.approveGroupApplication(project, application).subscribe((tmp_application: any) => {
      this.selectedProject.ProjectMemberApplications = [];

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
      this.getUserProjectApplications(project);

    });
  }

  ngOnInit(): void {
    this.getUserProjects();
    this.getUserinfo();

  }

  rejectMemberApplication(project: number, application: number, membername: string): void {
    this.loaded = false;
    this.application_action_done = false;

    this.groupService.rejectGroupApplication(project, application)
      .subscribe((tmp_application: any) => {
                   this.selectedProject.ProjectMemberApplications = [];

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
                   this.getUserProjectApplications(project);

                 }
      );
  }

  showMembersOfTheProject(projectid: number | string, projectname: string, facility?: [string, number]): void {
    this.getMembersOfTheProject(projectid, projectname);

    if (facility) {
      this.UserModalFacility = facility;

    } else {
      this.UserModalFacility = null;

    }

  }

  /**
   * Get all user applications for a project.
   * @param projectId id of the project
   */
  getUserProjectApplications(projectId: number): void {
    this.loaded = false;
    this.groupService.getGroupApplications(projectId).subscribe((applications: any) => {
      this.selectedProject.ProjectMemberApplications = [];

      const newProjectApplications: ProjectMemberApplication[] = [];
      if (applications.length === 0) {
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

        this.selectedProject.ProjectMemberApplications = newProjectApplications;
        this.loaded = true;

      }

    })

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
          this.isAdmin,
          compute_center);
        newProject.OpenStackProject = group['openstack_project'];
        newProject.RealName = realname;
        this.projects.push(newProject);
      }
      this.isLoaded = true;
    })

  }

  /**
   * Get all members of a project.
   * @param projectId id of the project
   * @param projectName
   */
  getMembersOfTheProject(projectId: number | string, projectName: string): void {
    this.groupService.getGroupMembers(projectId.toString()).subscribe((members: any) => {

      this.usersModalProjectID = projectId;
      this.usersModalProjectName = projectName;
      this.usersModalProjectMembers = [];
      this.groupService.getGroupAdminIds(projectId.toString()).subscribe((result: any) => {
        const admindIds: any = result['adminIds'];
        for (const member of members) {
          const member_id: string = member['id'];
          const user_id: string = member['userId'];
          const fullName: string = `${member['firstName']} ${member['lastName']}`;
          const projectMember: ProjectMember = new ProjectMember(user_id, fullName, member_id);
          projectMember.ElixirId = member['elixirId'];
          projectMember.IsPi = admindIds.indexOf(user_id) !== -1;
          this.usersModalProjectMembers.push(projectMember);

        }
      })

    });
  }

  setAllMembersChecked(): void {
    if (!this.allSet) {
      this.usersModalProjectMembers.forEach((member: ProjectMember) => {
        if (!this.isMemberChecked(parseInt(member.MemberId.toString(), 10)) && this.userinfo.MemberId.toString() !== member.MemberId.toString()) {
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

  checkIfAllMembersChecked(): boolean {
    this.usersModalProjectMembers.forEach((member: ProjectMember) => {
      if (!this.isMemberChecked(parseInt(member.MemberId.toString(), 10)) && this.userinfo.MemberId !== member.MemberId) {
        return false;
      }
    });

    return true;
  }

  checkUnCheckMember(id: number): void {
    const indexOf: number = this.checked_member_list.indexOf(id);
    if (indexOf !== -1) {
      this.checked_member_list.splice(indexOf, 1);
      this.allSet = false;

    } else {
      this.checked_member_list.push(id);
      if (this.checkIfAllMembersChecked()) {
        this.allSet = true;
      } else {
        this.allSet = false;
      }
    }

  }

  removeCheckedMembers(groupId: number | string): void {
    let facility_id: string | number = null;
    if (this.UserModalFacility && this.UserModalFacility[1]) {
      facility_id = this.UserModalFacility[1]
    }
    const members_in: ProjectMember[] = [];

    const observables: Observable<number>[] = this.checked_member_list
      .map((id: number) => this.groupService.removeMember(groupId, id, facility_id));
    forkJoin(observables).subscribe(() => {

      this.usersModalProjectMembers.forEach((member: ProjectMember) => {

        if (!this.isMemberChecked(parseInt(member.MemberId.toString(), 10))) {
          members_in.push(member)

        }
      });
      this.usersModalProjectMembers = members_in;
      this.checked_member_list = [];
      this.allSet = false;

    })

  }

  resetCheckedMemberList(): void {
    this.allSet = false;
    this.checked_member_list = [];
  }

  setAddUserInvitationLink(): void {
    const uri: string = this.invitation_group_pre + this.addUserModalRealName + this.invitation_group_post + this.addUserModalRealName;
    this.addUserModalInvitationLink = uri

  }

  getProjectLifetime(project: Project): void {
    this.details_loaded = false;
    if (!project.Lifetime) {
      this.groupService.getLifetime(project.Id).subscribe((time: IResponseTemplate) => {
        const lifetime: number | string = <number>time.value;
        const dateCreated: Date = moment(project.DateCreated, 'DD.MM.YYYY').toDate();
        if (lifetime !== -1) {
          const expirationDate: string = moment(moment(dateCreated).add(lifetime, 'months').toDate()).format('DD.MM.YYYY');
          const lifetimeDays: number = Math.abs(moment(moment(expirationDate, 'DD.MM.YYYY').toDate())
                                                  .diff(moment(dateCreated), 'days'));

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

  copyToClipboard(text: string): void {
    document.addEventListener('copy', (clipEvent: ClipboardEvent) => {
      clipEvent.clipboardData.setData('text/plain', (text));
      clipEvent.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  resetAddUserModal(): void {
    this.addUserModalProjectID = null;
    this.addUserModalProjectName = null;
    this.UserModalFacility = null;
  }

  filterMembers(searchString: string): void {
    this.userService.getFilteredMembersOfdeNBIVo(searchString).subscribe((result: object) => {
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

  public showAddUserToProjectModal(projectid: number, projectname: string, realname: string, facility?: [string, number]): void {
    this.addUserModalProjectID = projectid;
    this.addUserModalProjectName = projectname;
    this.addUserModalRealName = realname;
    this.UserModalFacility = facility;

    if (facility) {
      this.UserModalFacility = facility;

    } else {
      this.UserModalFacility = null;

    }
  }

  getUserinfo(): void {
    this.userService.getUserInfo().subscribe((userinfo: any) => {
      this.userinfo = new Userinfo(userinfo);
    })
  }

  public addMember(groupid: number, memberid: number, firstName: string, lastName: string): void {
    let facility_id: string | number = null;
    if (this.UserModalFacility && this.UserModalFacility[1]) {
      facility_id = this.UserModalFacility[1]
    }
    this.groupService.addMember(groupid, memberid, facility_id).subscribe(
      (result: any) => {
        if (result.status === 200) {
          this.updateNotificationModal('Success', `Member ${firstName} ${lastName} added.`, true, 'success');

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
    let facility_id: string | number = null;
    if (this.UserModalFacility && this.UserModalFacility[1]) {
      facility_id = this.UserModalFacility[1]
    }
    this.groupService.addMember(groupId, memberId, facility_id).subscribe(
      () => {
        this.groupService.addAdmin(groupId, userId, facility_id).subscribe(
          (result: any) => {

            if (result.status === 200) {
              this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');

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
        this.groupService.addAdmin(groupId, userId, facility_id).subscribe(
          (result: any) => {

            if (result.status === 200) {
              this.updateNotificationModal('Success', `Admin ${firstName} ${lastName} added.`, true, 'success');

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
    let facility_id: string | number = null;
    if (this.UserModalFacility && this.UserModalFacility[1]) {
      facility_id = this.UserModalFacility[1]
    }
    this.groupService.addAdmin(groupid, userid, facility_id).toPromise()
      .then((result: any) => {

        if (result.status === 200) {
          this.updateNotificationModal('Success', `${username} promoted to Admin`, true, 'success');

        } else {
          this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
        }
      }).catch(() => {
      this.updateNotificationModal('Failed', `${username} could not be promoted to Admin!`, true, 'danger');
    });
  }

  public removeAdmin(groupid: number, userid: number, name: string): void {
    let facility_id: string | number = null;
    if (this.UserModalFacility && this.UserModalFacility[1]) {
      facility_id = this.UserModalFacility[1]
    }
    this.groupService.removeAdmin(groupid, userid, facility_id).toPromise()
      .then((result: any) => {

        if (result.status === 200) {
          this.updateNotificationModal('Success', `${name} was removed as Admin`, true, 'success');

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
    let facility_id: string | number = null;
    if (this.UserModalFacility && this.UserModalFacility[1]) {
      facility_id = this.UserModalFacility[1]
    }
    this.groupService.removeMember(groupid, memberid, facility_id).subscribe(
      (result: any) => {

        if (result.status === 200) {
          this.updateNotificationModal('Success', `Member ${name}  removed from the group`, true, 'success');

        } else {
          this.updateNotificationModal('Failed', `Member ${name}  could not be removed !`, true, 'danger');
        }
      },
      () => {
        this.updateNotificationModal('Failed', `Member ${name}  could not be removed !`, true, 'danger');
      });
  }

  public resetFacilityDetailsModal(): void {
    this.UserModalFacility = null;
    this.UserModalFacilityDetails = null;
  }

  public comingSoon(): void {
    alert('This function will be implemented soon.')
  }
}
