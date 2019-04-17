import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Userinfo***REMOVED*** from './userinfo.model'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***KeyService***REMOVED*** from '../api-connector/key.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***IResponseTemplate***REMOVED*** from '../api-connector/response-template';
import ***REMOVED***forkJoin***REMOVED*** from 'rxjs/index';

/**
 * UserInformation component.
 */
@Component(***REMOVED***
  selector: 'app-userinfo',
  templateUrl: 'userinfo.component.html',
  providers: [GroupService, UserService, ApiSettings, KeyService]
***REMOVED***)
export class UserInfoComponent implements OnInit ***REMOVED***
  /**
   * Information of the logged in User
   */
  userInfo: Userinfo;

  /**
   * If the user has subscribed to the newsletter.
   */
  newsletterSubscribed: boolean;

  /**
   * New requested public key.
   */
  newPublicKey: string;

  /**
   * If every data is loaded.
   * @type ***REMOVED***boolean***REMOVED***
   */
  isLoaded: boolean = false;

  /**
   * If the user is part of a project.
   * @type ***REMOVED***boolean***REMOVED***
   */
  isProjectMember: boolean = true;

  /**
   * If freemium is active.
   * @type ***REMOVED***boolean***REMOVED***
   */
  freemiumActive: boolean = false;

  /**
   * Email requested to change.
   */
  emailChange: string;

  constructor(private groupService: GroupService, private userService: UserService, private keyService: KeyService) ***REMOVED***

  ***REMOVED***

  requestChangePreferredMailUser(email: string): void ***REMOVED***
    this.userService.requestChangePreferredMailUser(email).subscribe(() => ***REMOVED***
      this.getPendingPreferredMailUser();
    ***REMOVED***)
  ***REMOVED***

  getPendingPreferredMailUser(): void ***REMOVED***
    this.userService.getPendingPreferredMailUser().subscribe((res: IResponseTemplate) => ***REMOVED***
      this.userInfo.PendingEmails = <string[]>res.value;

    ***REMOVED***)
  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.getUserinfo();
    this.isFreemiumActive();
    this.isUserSimpleVmMember();

  ***REMOVED***

  isFreemiumActive(): void ***REMOVED***
    this.groupService.isFreemiumActive().subscribe((result: IResponseTemplate) => ***REMOVED***
      this.freemiumActive = <boolean><Boolean> result.value;

    ***REMOVED***);
  ***REMOVED***

  importKey(publicKey: string): void ***REMOVED***

    const re: RegExp = /\+/gi;

    this.keyService.postKey(publicKey.replace(re, '%2B')).subscribe(() => ***REMOVED***
      this.getUserPublicKey();
    ***REMOVED***);
  ***REMOVED***

  getUserPublicKey(): void ***REMOVED***
    this.keyService.getKey().subscribe((key: IResponseTemplate) => ***REMOVED***
      this.userInfo.PublicKey = <string>key.value;
      this.isLoaded = true;
    ***REMOVED***)
  ***REMOVED***

  getUserinfo(): void ***REMOVED***
    this.userService.getUserInfo().subscribe((userinfo: any) => ***REMOVED***
      this.userInfo = new Userinfo(userinfo);
      forkJoin(
        this.userService.getNewsletterSubscription(),
        this.userService.getPendingPreferredMailUser()).subscribe((res: IResponseTemplate[]) => ***REMOVED***

        this.newsletterSubscribed = <boolean>res[0].value;
        this.userInfo.PendingEmails = <string[]>res[1].value;
        this.isLoaded = true;

      ***REMOVED***)
    ***REMOVED***)

  ***REMOVED***

  isUserSimpleVmMember(): void ***REMOVED***
    this.groupService.getSimpleVmByUser().subscribe(result => ***REMOVED***
      if (result.length > 0) ***REMOVED***
        this.isProjectMember = true
      ***REMOVED*** else ***REMOVED***
        this.isProjectMember = false
      ***REMOVED***
    ***REMOVED***)
  ***REMOVED***

  setNewsletterSubscription(): void ***REMOVED***
    if (this.newsletterSubscribed) ***REMOVED***
      this.userService.setNewsletterSubscriptionWhenSubscribed().subscribe();
    ***REMOVED*** else ***REMOVED***
      this.userService.setNewsletterSubscriptionWhenNotSubscribed().subscribe();
    ***REMOVED***

  ***REMOVED***


  validatePublicKey(): boolean ***REMOVED***

    if (/ssh-rsa AAAA[0-9A-Za-z+/]+[=]***REMOVED***0,3***REMOVED***( [^@]+@[^@]+)?/.test(this.newPublicKey)) ***REMOVED***
      return true;
    ***REMOVED*** else ***REMOVED***

      return false;
    ***REMOVED***

  ***REMOVED***

  joinFreemium(): void ***REMOVED***
    this.groupService.addMemberToFreemium().subscribe();
  ***REMOVED***


***REMOVED***
