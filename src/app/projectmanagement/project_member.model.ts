/**
 * Project Member class.
 */
export class ProjectMember {

  Id: number | string;
  MemberId: number | string;
  Username: string;
  IsPi: boolean;
  ElixirId: string;
  Email: string;

  constructor(Id: number | string, Username: string, MemberId: number | string) {
    this.Id = Id;
    this.Username = Username;
    this.MemberId = MemberId;

  }
}
