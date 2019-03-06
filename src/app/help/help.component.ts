import {Component} from '@angular/core';
import {UserService} from '../api-connector/user.service';


@Component({
    templateUrl: './help.component.html',
    providers: [UserService]

})

export class HelpComponent {

  public emailSubject: string;
  public emailText: string;
  public emailStatus = 0;
  public emailAdress: string;
  public emailReply = '';


  constructor(private userService: UserService) {

}

  sendEmail(subject: string, message: string, reply: string) {
        this.userService.sendHelpMail(encodeURIComponent(subject), encodeURIComponent(message), encodeURIComponent(reply)).subscribe(result => {
            if (result == 1) {
                this.emailStatus = 1;
            } else {
                this.emailStatus = 2;
            }
        })

    }
  resetEmail() {
    this.emailStatus = 0;
    this.emailText = '';
    this.emailSubject = '';
    this.emailAdress = '';
    this.emailReply = '';

  }
}


