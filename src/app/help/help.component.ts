import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";


@Component(***REMOVED***
    templateUrl: './help.component.html',
    providers: [UserService]

***REMOVED***)

export class HelpComponent ***REMOVED***

  public emailSubject: string;
  public emailText: string;
  public emailStatus: number = 0;
  public emailAdress: string;

  constructor(private userService: UserService)***REMOVED***

***REMOVED***

  sendEmail(subject: string, message: string, adress: string) ***REMOVED***
        this.userService.sendHelpMail(encodeURIComponent(subject), encodeURIComponent(message)).subscribe(result => ***REMOVED***
            if (result == 1) ***REMOVED***
                this.emailStatus = 1;
            ***REMOVED***
            else ***REMOVED***
                this.emailStatus = 2;
            ***REMOVED***
        ***REMOVED***)

    ***REMOVED***
  resetEmail()***REMOVED***
    this.emailStatus = 0;
    this.emailText = '';
    this.emailSubject = '';
    this.emailAdress = '';
  ***REMOVED***
***REMOVED***


