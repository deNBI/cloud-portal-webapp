import {ProjectMemberApplication} from './project_member_application';
import {ComputecenterComponent} from './computecenter.component';

/**
 * Project class.
 */
export class Project {

  Id: number | string;
  Name: string;
  Description: string;
  DateCreated: string;
  DateEnd: string;
  DaysRunning: number;
  LifetimeDays: number;
  Lifetime: number | string;
  UserIsAdmin: boolean;
  UserIsPi: boolean;
  Status: number;
  ComputeCenter: ComputecenterComponent;
  PerunId: number;
  ProjectMemberApplications: ProjectMemberApplication[];
  RealName: string;
  OpenStackProject: boolean;
  LifetimeReached: number;
  CurrentCredits: number;
  ApprovedCredits: number;

  constructor(Id: number | string, Name: string, Description: string, DateCreated: string, DaysRunning: number,
              UserIsAdmin: boolean, UserIsPi: boolean, ComputeCenter: ComputecenterComponent,
              CurrentCredits: number, ApprovedCredits: number) {
    this.Id = Id;
    this.Name = Name;
    this.Description = Description;
    this.DateCreated = DateCreated;
    this.DaysRunning = DaysRunning;
    this.UserIsAdmin = UserIsAdmin;
    this.UserIsPi = UserIsPi;
    this.ComputeCenter = ComputeCenter;
    this.ApprovedCredits = ApprovedCredits;
    this.CurrentCredits = CurrentCredits;
  }
}
