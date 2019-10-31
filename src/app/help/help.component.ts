import {Component} from '@angular/core';
import {UserService} from '../api-connector/user.service';
import {IResponseTemplate} from '../api-connector/response-template';

/**
 * Help component.
 */
@Component({
             selector: 'app-help',
             templateUrl: './help.component.html',
             providers: [UserService]

           })

export class HelpComponent {

  public emailSubject: string;
  public emailText: string;
  public emailStatus: number = 0;
  public emailAdress: string;
  public emailReply: string = '';

  title: string = 'Help';

  constructor(private userService: UserService) {

  }

  sendEmail(subject: string, message: string, reply: string): void {
    this.userService.sendHelpMail(
      encodeURIComponent(subject), encodeURIComponent(message),
      encodeURIComponent(reply)).subscribe((result: IResponseTemplate) => {
      if (<boolean><Boolean>result.value) {
        this.emailStatus = 1;
      } else {
        this.emailStatus = 2;
      }
    })

  }

  resetEmail(): void {
    this.emailStatus = 0;
    this.emailText = '';
    this.emailSubject = '';
    this.emailAdress = '';
    this.emailReply = '';

  }
}
