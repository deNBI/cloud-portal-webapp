/**
 * Userinfo class.
 */
export class Userinfo {

  Id: number;
  FirstName: string;
  LastName: string;
  MemberId: number;
  ElixirId: string;
  PublicKey: string;
  UserLogin: string;
  Email: string;
  PendingEmails: string[];

  constructor(userInfo: any) {
    this.Id = userInfo.project_application_id;
    this.FirstName = userInfo.FirstName;
    this.LastName = userInfo.LastName;
    this.MemberId = userInfo.MemberId;
    this.ElixirId = userInfo.ElixirId;
    this.PublicKey = userInfo.PublicKey;
    this.UserLogin = userInfo.UserLogin;
    this.Email = userInfo.Email;
    this.PendingEmails = userInfo.PendingEmails;
  }
}
