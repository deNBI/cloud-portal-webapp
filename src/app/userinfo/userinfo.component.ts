import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Userinfo} from './userinfo.model'
import {ApiSettings} from '../api-connector/api-settings.service'
import {KeyService} from '../api-connector/key.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {IResponseTemplate} from '../api-connector/response-template';
import {forkJoin} from 'rxjs/index';

/**
 * UserInformation component.
 */
@Component({
             selector: 'app-userinfo',
             templateUrl: 'userinfo.component.html',
             providers: [GroupService, UserService, ApiSettings, KeyService]
           })
export class UserInfoComponent implements OnInit {
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
   * @type {boolean}
   */
  isLoaded: boolean = false;

  /**
   * If the user is part of a project.
   * @type {boolean}
   */
  isProjectMember: boolean = true;

  /**
   * If freemium is active.
   * @type {boolean}
   */
  freemiumActive: boolean = false;

  /**
   * Email requested to change.
   */
  emailChange: string;

  title: string = 'User Information';
  /**
   * Text refering to newsletter registration
   */
  dsgvo_text: string = 'By activating this option, you agree that your preferred e-mail address may be used for the newsletter. ' +
    'You will receive the newsletter until you deactivate the option in the settings again.';

  constructor(private groupService: GroupService, private userService: UserService, private keyService: KeyService) {
  }

  requestChangePreferredMailUser(email: string): void {
    this.userService.requestChangePreferredMailUser(email).subscribe(() => {
      this.getPendingPreferredMailUser();
    })
  }

  getPendingPreferredMailUser(): void {
    this.userService.getPendingPreferredMailUser().subscribe((res: IResponseTemplate) => {
      this.userInfo.PendingEmails = <string[]>res.value;

    })
  }

  ngOnInit(): void {
    this.getUserinfo();
    this.isFreemiumActive();
    this.isUserSimpleVmMember();
  }

  isFreemiumActive(): void {
    this.groupService.isFreemiumActive().subscribe((result: IResponseTemplate) => {
      this.freemiumActive = <boolean><Boolean>result.value;

    });
  }

  importKey(publicKey: string): void {

    const re: RegExp = /\+/gi;

    this.keyService.postKey(publicKey.replace(re, '%2B')).subscribe(() => {
      this.getUserPublicKey();
    });
  }

  getUserPublicKey(): void {
    this.keyService.getKey().subscribe((key: IResponseTemplate) => {
      this.userInfo.PublicKey = <string>key.value;
      this.isLoaded = true;
    })
  }

  getUserinfo(): void {
    this.userService.getUserInfo().subscribe((userinfo: any) => {
      this.userInfo = new Userinfo(userinfo);
      this.title = this.title.concat(': ', this.userInfo.FirstName, ' ', this.userInfo.LastName);

      forkJoin(
        this.userService.getNewsletterSubscription(),
        this.userService.getPendingPreferredMailUser()).subscribe((res: IResponseTemplate[]) => {

        this.newsletterSubscribed = <boolean>res[0].value;
        this.userInfo.PendingEmails = <string[]>res[1].value;

        this.isLoaded = true;

      })
    })

  }

  isUserSimpleVmMember(): void {
    this.groupService.getSimpleVmByUser().subscribe((result: any) => {
      if (result.length > 0) {
        this.isProjectMember = true
      } else {
        this.isProjectMember = false
      }
    })
  }

  setNewsletterSubscription(): void {
    if (this.newsletterSubscribed) {
      this.userService.setNewsletterSubscriptionWhenSubscribed().subscribe();
    } else {
      this.userService.setNewsletterSubscriptionWhenNotSubscribed().subscribe();
    }

  }

  validatePublicKey(): boolean {

    if (/ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.newPublicKey)) {
      return true;
    } else {

      return false;
    }

  }

  joinFreemium(): void {
    this.groupService.addMemberToFreemium().subscribe();
  }
}
